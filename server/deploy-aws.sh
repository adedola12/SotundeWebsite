#!/usr/bin/env bash
# Deploy the Sotunde Website API to Amazon ECS Express Mode.
#
#   ECR image -> ECS Express service (Fargate + ALB + autoscaling, managed)
#   secrets injected from SSM Parameter Store at task start
#
# Express Mode provisions the load balancer, target groups, security groups,
# networking, autoscaling and a public URL for you. No VPC or ALB to manage.
#
# Prerequisites:
#   1. server/.env holds WORKING values (especially a valid MONGO_URI).
#   2. MongoDB Atlas -> Network Access allows 0.0.0.0/0. Fargate egress IPs are
#      dynamic, so an IP allowlist will not work.
#   3. aws CLI >= 2.36 and authenticated (aws sts get-caller-identity).
#
# Safe to re-run: creates the service the first time, updates it after that.

set -euo pipefail

# Git Bash / MSYS rewrites any argument that looks like a Unix path into a
# Windows one before the process sees it, so "/sotunde/backend/MONGO_URI"
# arrives as "C:/Program Files/Git/sotunde/...". That breaks SSM parameter
# names and --health-check-path. Turn the conversion off for this script.
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL='*'

ACCOUNT=065634457992
REGION=eu-west-1
PROJECT=sotunde
SERVICE=${PROJECT}-api
CLUSTER=default
ECR_URI=${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${PROJECT}-backend
SSM_PREFIX=/${PROJECT}/backend

EXEC_ROLE=arn:aws:iam::${ACCOUNT}:role/ecsTaskExecutionRole
INFRA_ROLE=arn:aws:iam::${ACCOUNT}:role/ecsInfrastructureRoleForExpressServices

cd "$(dirname "$0")"

# A shell started before the AWS CLI was installed has a stale PATH and fails
# with "aws: command not found". Fall back to the standard Windows install dir.
if ! command -v aws >/dev/null 2>&1; then
  for candidate in \
    "/c/Program Files/Amazon/AWSCLIV2" \
    "/c/Program Files (x86)/Amazon/AWSCLIV2" \
    "$HOME/AppData/Local/Programs/Amazon/AWSCLIV2"
  do
    if [ -x "$candidate/aws.exe" ] || [ -x "$candidate/aws" ]; then
      PATH="$candidate:$PATH"
      export PATH
      echo "==> found AWS CLI in $candidate"
      break
    fi
  done
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "ERROR: aws CLI not found on PATH." >&2
  echo "       Open a NEW terminal (PATH may be stale), or install it from" >&2
  echo "       https://aws.amazon.com/cli/" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1 && [ "${SKIP_BUILD-0}" != "1" ]; then
  echo "ERROR: docker not found on PATH. Start Docker Desktop, or re-run with" >&2
  echo "       SKIP_BUILD=1 if the image is already in ECR." >&2
  exit 1
fi

# --------------------------------------------------- secrets -> SSM (SecureString)
# SSM is the source of truth for the running service, and .env is only a staging
# area. If a secret was set directly in SSM and .env was not updated to match,
# this step would silently overwrite the good value with the stale one, so skip
# it with SKIP_SECRETS=1 when rolling tasks to pick up a parameter change.
if [ "${SKIP_SECRETS-0}" = "1" ]; then
  echo "==> skipping SSM push (SKIP_SECRETS=1)"
else
echo "==> SSM parameters (read from server/.env, never printed)"

if [ ! -f .env ]; then
  echo "    ERROR: server/.env not found." >&2
  exit 1
fi

# Source a CR-stripped copy. A CRLF .env (normal on Windows) would otherwise put
# a trailing \r inside every secret, which silently breaks the Mongo URI.
ENV_TMP=$(mktemp)
trap 'rm -f "$ENV_TMP"' EXIT
tr -d '\r' < .env > "$ENV_TMP"

set -a
# shellcheck disable=SC1090
. "$ENV_TMP"
set +a

put_secret() {
  local key=$1 val=${2-}
  if [ -z "$val" ]; then
    echo "    SKIP  $key (empty in .env)"
    return
  fi
  aws ssm put-parameter \
    --region "$REGION" \
    --name "${SSM_PREFIX}/${key}" \
    --type SecureString \
    --value "$val" \
    --overwrite >/dev/null
  echo "    set   $key"
}

# A malformed connection string is only discovered by a task that starts, fails
# to parse it and retries forever, several minutes after the deploy claimed
# success. Check the scheme here, where the message is immediate and readable.
case "${MONGO_URI-}" in
  mongodb://*|mongodb+srv://*) ;;
  "") echo "    ERROR: MONGO_URI is empty in .env" >&2; exit 1 ;;
  *)
    echo "    ERROR: MONGO_URI does not start with mongodb:// or mongodb+srv://" >&2
    echo "           Length ${#MONGO_URI}, begins '$(printf %.12s "${MONGO_URI}")'" >&2
    echo "           A placeholder such as NEW_URI reaches this point looking valid." >&2
    exit 1
    ;;
esac

put_secret MONGO_URI             "${MONGO_URI-}"
put_secret JWT_SECRET            "${JWT_SECRET-}"
put_secret CLOUDINARY_CLOUD_NAME "${CLOUDINARY_CLOUD_NAME-}"
put_secret CLOUDINARY_API_KEY    "${CLOUDINARY_API_KEY-}"
put_secret CLOUDINARY_API_SECRET "${CLOUDINARY_API_SECRET-}"
put_secret GOOGLE_SHEET_WEBHOOK  "${GOOGLE_SHEET_WEBHOOK-}"
fi

# --------------------------------------------------------- build & push image
# Skip with:  SKIP_BUILD=1 ./deploy-aws.sh
if [ "${SKIP_BUILD-0}" != "1" ]; then
  echo "==> building and pushing image"
  aws ecr get-login-password --region "$REGION" \
    | docker login --username AWS --password-stdin "${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com"
  docker build -t "${ECR_URI}:latest" .
  docker push "${ECR_URI}:latest"
else
  echo "==> skipping image build (SKIP_BUILD=1)"
fi

# ------------------------------------------------------------- container config
CORS_VALUE="https://sotunde-website.vercel.app,https://sotunde-website-cpqb.vercel.app"

secret_arn() { echo "arn:aws:ssm:${REGION}:${ACCOUNT}:parameter${SSM_PREFIX}/$1"; }

PRIMARY_CONTAINER=$(cat <<JSON
{
  "image": "${ECR_URI}:latest",
  "containerPort": 4000,
  "environment": [
    {"name": "NODE_ENV",       "value": "production"},
    {"name": "PORT",           "value": "4000"},
    {"name": "JSON_LIMIT",     "value": "5mb"},
    {"name": "JWT_EXPIRES_IN", "value": "7d"},
    {"name": "CORS_ORIGINS",   "value": "${CORS_VALUE}"}
  ],
  "secrets": [
    {"name": "MONGO_URI",             "valueFrom": "$(secret_arn MONGO_URI)"},
    {"name": "JWT_SECRET",            "valueFrom": "$(secret_arn JWT_SECRET)"},
    {"name": "CLOUDINARY_CLOUD_NAME", "valueFrom": "$(secret_arn CLOUDINARY_CLOUD_NAME)"},
    {"name": "CLOUDINARY_API_KEY",    "valueFrom": "$(secret_arn CLOUDINARY_API_KEY)"},
    {"name": "CLOUDINARY_API_SECRET", "valueFrom": "$(secret_arn CLOUDINARY_API_SECRET)"},
    {"name": "GOOGLE_SHEET_WEBHOOK",  "valueFrom": "$(secret_arn GOOGLE_SHEET_WEBHOOK)"}
  ]
}
JSON
)

SCALING='{"minTaskCount":1,"maxTaskCount":4,"autoScalingMetric":"AVERAGE_CPU","autoScalingTargetValue":70}'

# ---------------------------------------------------------- create or update
echo "==> ECS Express service"

ARN=$(aws ecs list-services --region "$REGION" --cluster "$CLUSTER" \
  --query "serviceArns[?ends_with(@, '/${SERVICE}')] | [0]" --output text 2>/dev/null || echo "None")

if [ -n "$ARN" ] && [ "$ARN" != "None" ]; then
  echo "    updating existing service"
  aws ecs update-express-gateway-service \
    --region "$REGION" \
    --service-arn "$ARN" \
    --primary-container "$PRIMARY_CONTAINER" \
    --health-check-path "/" \
    --scaling-target "$SCALING" \
    --cpu 256 --memory 512 >/dev/null
else
  echo "    creating new service (takes ~3-5 minutes)"
  ARN=$(aws ecs create-express-gateway-service \
    --region "$REGION" \
    --service-name "$SERVICE" \
    --execution-role-arn "$EXEC_ROLE" \
    --infrastructure-role-arn "$INFRA_ROLE" \
    --primary-container "$PRIMARY_CONTAINER" \
    --health-check-path "/" \
    --scaling-target "$SCALING" \
    --cpu 256 --memory 512 \
    --query 'service.serviceArn' --output text)
fi

# service.status flips to ACTIVE the instant the service record exists — long
# before the ALB is provisioned or a single task is running. The deployment is
# the thing worth waiting on: it uses a canary strategy with a bake period, so
# a real first rollout takes several minutes.
echo "==> waiting for the deployment to finish"

DEPLOYMENT=""
for _ in $(seq 1 30); do
  DEPLOYMENT=$(aws ecs describe-express-gateway-service --region "$REGION" \
    --service-arn "$ARN" --query 'service.currentDeployment' --output text 2>/dev/null || echo "")
  [ -n "$DEPLOYMENT" ] && [ "$DEPLOYMENT" != "None" ] && break
  sleep 10
done

if [ -z "$DEPLOYMENT" ] || [ "$DEPLOYMENT" = "None" ]; then
  echo "    no deployment was created for the service" >&2
  exit 1
fi

DEPLOY_STATUS=""
for _ in $(seq 1 60); do
  read -r DEPLOY_STATUS RUNNING PENDING <<<"$(aws ecs describe-service-deployments \
    --region "$REGION" --service-deployment-arns "$DEPLOYMENT" \
    --query 'serviceDeployments[0].[status,targetServiceRevision.runningTaskCount,targetServiceRevision.pendingTaskCount]' \
    --output text 2>/dev/null || echo "UNKNOWN 0 0")"
  echo "    $DEPLOY_STATUS  running=$RUNNING pending=$PENDING"
  [ "$DEPLOY_STATUS" != "IN_PROGRESS" ] && [ "$DEPLOY_STATUS" != "UNKNOWN" ] && break
  sleep 20
done

if [ "$DEPLOY_STATUS" != "SUCCESSFUL" ]; then
  echo "    deployment ended as $DEPLOY_STATUS — check CloudWatch Logs:" >&2
  echo "    aws logs tail /aws/ecs/default/${SERVICE}-* --region $REGION --follow" >&2
  aws ecs describe-service-deployments --region "$REGION" \
    --service-deployment-arns "$DEPLOYMENT" \
    --query 'serviceDeployments[0].statusReason' --output text >&2 || true
  exit 1
fi

URL=$(aws ecs describe-express-gateway-service --region "$REGION" --service-arn "$ARN" \
  --query "service.activeConfigurations[0].ingressPaths[?accessType=='PUBLIC'].endpoint | [0]" \
  --output text 2>/dev/null || echo "")

if [ -z "$URL" ] || [ "$URL" = "None" ]; then
  echo "    deployment succeeded but no public endpoint was published" >&2
  exit 1
fi

# The endpoint is normally a bare hostname; tolerate it already having a scheme.
case "$URL" in
  http://*|https://*) API_URL=$URL ;;
  *)                  API_URL="https://${URL}" ;;
esac

echo
echo "==> smoke test"
curl -s -m 30 -o /dev/null -w "    GET /        -> HTTP %{http_code}\n" "${API_URL}/"       || true
curl -s -m 30 -w "    GET /health  -> %{http_code} " "${API_URL}/health" || true
echo

echo
echo "=========================================================="
echo " API is live:  ${API_URL}"
echo
echo " Next: set this in Vercel for BOTH sotunde projects"
echo "   VITE_AUTH_ENDPOINT = ${API_URL}"
echo " then redeploy the frontend."
echo "=========================================================="
