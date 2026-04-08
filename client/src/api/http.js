// client/src/api/http.js
const RAW_BASE = import.meta.env.VITE_AUTH_ENDPOINT || "";
const API_BASE = String(RAW_BASE).replace(/\/+$/, "");

export const buildUrl = (path) => {
  const p = String(path || "");
  const cleanPath = p.startsWith("/") ? p : `/${p}`;

  if (!API_BASE) return cleanPath;

  if (API_BASE.endsWith("/api") && cleanPath.startsWith("/api/")) {
    return `${API_BASE}${cleanPath.slice(4)}`;
  }

  return `${API_BASE}${cleanPath}`;
};

function getToken() {
  try {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      ""
    );
  } catch {
    return "";
  }
}

function isFormData(body) {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

export async function fetchJson(path, options = {}) {
  const url = buildUrl(path);

  const method = (options.method || "GET").toUpperCase();
  const hasBody = options.body != null && method !== "GET" && method !== "HEAD";

  const headers = { ...(options.headers || {}) };

  const token = getToken();
  if (token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (hasBody && !isFormData(options.body) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      `Request failed: ${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
