# Deploying the Sotunde Website API to AWS

The API runs on **Amazon ECS Express Mode** (Fargate) in `eu-west-1`, pulling a
container image from **ECR**, with secrets injected from **SSM Parameter Store**.

Express Mode provisions and manages the Application Load Balancer, target
groups, security groups, VPC networking, auto-scaling and a public HTTPS URL —
so there is no load balancer or VPC to maintain by hand.

| Resource | Name |
| --- | --- |
| ECR repository | `sotunde-backend` |
| ECS Express service | `sotunde-api` (in the `default` cluster) |
| Execution role | `ecsTaskExecutionRole` |
| Infrastructure role | `ecsInfrastructureRoleForExpressServices` |
| SSM prefix | `/sotunde/backend/` |
| Region / account | `eu-west-1` / `065634457992` |
| Task size | 256 CPU units (.25 vCPU) / 512 MiB |
| Scaling | 1–4 tasks on 70% average CPU |

Both IAM roles already existed in this account. The execution role was given an
inline policy `SotundeSecretRead` granting `ssm:GetParameter{,s}` on
`/sotunde/backend/*` — the *execution* role fetches secrets, not the task role.

## Deploy

```bash
cd server && ./deploy-aws.sh
```

The script is idempotent — it pushes secrets from `server/.env` into SSM, builds
and pushes the image, then creates or updates the Express service, waits for it
to go `ACTIVE`, smoke-tests it, and prints the public URL.

To redeploy without rebuilding the image: `SKIP_BUILD=1 ./deploy-aws.sh`

## Before the first deploy

1. **`server/.env` must hold working values.** In particular `MONGO_URI` — the
   value present as of this writing is rejected by Atlas with
   `bad auth : authentication failed`. Reset the database user's password in
   Atlas and update `.env`.

2. **Atlas Network Access must allow `0.0.0.0/0`.** Fargate egress IPs are
   dynamic, so an IP allowlist will lock the service out. (Symptom of getting
   this wrong is a *connection timeout*, not `bad auth`.)

Because `index.js` exits when the database is unreachable, a bad `MONGO_URI`
shows up as tasks that start and immediately die, and the service never reaches
a healthy state. Check CloudWatch Logs if that happens.

## After deploying

Set `VITE_AUTH_ENDPOINT` to the printed URL in the Vercel dashboard for both
`sotunde-website` and `sotunde-website-cpqb`, then redeploy the frontend.

## Environment variables

Plain values, set on the container:
`NODE_ENV`, `PORT` (4000), `JSON_LIMIT`, `JWT_EXPIRES_IN`, `CORS_ORIGINS`

Secrets, resolved from SSM at task start:
`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`, `GOOGLE_SHEET_WEBHOOK`

To rotate one:

```bash
aws ssm put-parameter --region eu-west-1 --name /sotunde/backend/JWT_SECRET --type SecureString --overwrite --value 'NEW_VALUE'
```

Secrets are read when a task starts, so re-run `SKIP_BUILD=1 ./deploy-aws.sh` to
roll the tasks and pick up the new value.

## Health checks

- `GET /` — always 200 while the process is up. This is the ALB health check path.
- `GET /health` — 200 when Mongo is connected, 503 when it is not. Use this to
  distinguish "process alive" from "database reachable".

## Useful commands

```bash
aws ecs describe-express-gateway-service --region eu-west-1 --service-arn "$(aws ecs list-services --region eu-west-1 --cluster default --query "serviceArns[?ends_with(@,'/sotunde-api')] | [0]" --output text)"
```

## Why not App Runner

The sibling `horlawealth-api` in this account runs on App Runner. AWS moved App
Runner to **maintenance on 2026-04-30** — closed to new customers, existing
accounts still work, eventual sunset. ECS Express Mode is AWS's stated migration
target, so this service was built there directly.
