// client/src/context/AuthContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_AUTH_ENDPOINT || "";
const TOKEN_KEYS = ["token", "authToken", "accessToken"];
const USER_KEY = "user";

function safeJsonParse(v) {
  try { return JSON.parse(v); } catch { return null; }
}

function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url) || String(url || "").startsWith("//");
}

function withBase(url) {
  const u = String(url || "");
  if (!u) return u;
  if (isAbsoluteUrl(u)) return u;
  return API_BASE ? `${API_BASE}${u}` : u;
}

function readToken() {
  try {
    for (const k of TOKEN_KEYS) {
      const v = localStorage.getItem(k);
      if (v) return v;
    }
    return "";
  } catch { return ""; }
}

function writeToken(token) {
  try {
    TOKEN_KEYS.forEach((k) => localStorage.removeItem(k));
    if (token) localStorage.setItem("token", token);
  } catch {}
}

function clearStorage() {
  try {
    TOKEN_KEYS.forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem(USER_KEY);
  } catch {}
}

function parseJwt(token) {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(jsonPayload);
  } catch { return null; }
}

function isTokenExpired(token) {
  const p = parseJwt(token);
  if (!p?.exp) return false;
  return Date.now() >= p.exp * 1000;
}

async function readBody(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json().catch(() => null);
  return res.text().catch(() => "");
}

function makeHttpError(status, body) {
  const msg = (body && typeof body === "object" && body.message) || (typeof body === "string" && body) || `Request failed (${status})`;
  const err = new Error(msg);
  err.status = status;
  err.body = body;
  return err;
}

export function AuthProvider({ children }) {
  const tokenRef = useRef(readToken());
  const [user, setUser] = useState(() => safeJsonParse(localStorage.getItem(USER_KEY) || "") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!readToken());
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const authFetch = useCallback(async (url, options = {}) => {
    const token = tokenRef.current || readToken();
    tokenRef.current = token;
    const headers = new Headers(options.headers || {});
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(withBase(url), { ...options, headers, credentials: options.credentials ?? "include" });
  }, []);

  const authJson = useCallback(async (url, options = {}) => {
    const headers = new Headers(options.headers || {});
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    const res = await authFetch(url, { ...options, headers });
    const body = await readBody(res);
    if (!res.ok) throw makeHttpError(res.status, body);
    return body;
  }, [authFetch]);

  const refreshMe = useCallback(async () => {
    const data = await authJson("/api/auth/me", { method: "GET" });
    const u = data?.user ?? data ?? null;
    setUser(u);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    setIsAuthenticated(true);
    return u;
  }, [authJson]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      const tok = readToken();
      tokenRef.current = tok;
      if (tok && isTokenExpired(tok)) { clearStorage(); tokenRef.current = ""; }
      const token2 = readToken();
      tokenRef.current = token2;
      const cachedUser = safeJsonParse(localStorage.getItem(USER_KEY) || "");

      if (!token2) {
        if (cancelled) return;
        setUser(null); setIsAuthenticated(false); setIsLoading(false); setInitialized(true);
        return;
      }

      if (cachedUser) setUser(cachedUser);
      setIsAuthenticated(true);

      try {
        await refreshMe();
      } catch (err) {
        if (cancelled) return;
        if (err?.status === 401) {
          clearStorage(); tokenRef.current = "";
          setUser(null); setIsAuthenticated(false);
        } else {
          if (cachedUser) setUser(cachedUser);
          setIsAuthenticated(true);
        }
      } finally {
        if (cancelled) return;
        setIsLoading(false); setInitialized(true);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshMe]);

  const signin = useCallback(async ({ email, password }) => {
    const data = await authJson("/api/auth/signin", { method: "POST", body: JSON.stringify({ email, password }) });
    const token = data?.token || data?.accessToken || "";
    if (token) { writeToken(token); tokenRef.current = token; } else { tokenRef.current = readToken(); }
    const u = data?.user || null;
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u); setIsAuthenticated(true); setIsLoading(false); setInitialized(true);
    return data;
  }, [authJson]);

  const signup = useCallback(async ({ name, email, password }) => {
    const data = await authJson("/api/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) });
    const token = data?.token || data?.accessToken || "";
    if (token) { writeToken(token); tokenRef.current = token; } else { tokenRef.current = readToken(); }
    const u = data?.user || null;
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u); setIsAuthenticated(true); setIsLoading(false); setInitialized(true);
    return data;
  }, [authJson]);

  const signout = useCallback(async () => {
    try { await authFetch("/api/auth/signout", { method: "POST" }); } catch {}
    clearStorage(); tokenRef.current = "";
    setUser(null); setIsAuthenticated(false); setIsLoading(false); setInitialized(true);
  }, [authFetch]);

  const value = useMemo(() => ({
    user, isAuthenticated, isLoading, initialized,
    authFetch, refreshMe, signin, signup, signout,
    signIn: signin, signUp: signup, signOut: signout, logout: signout, logOut: signout,
  }), [user, isAuthenticated, isLoading, initialized, authFetch, refreshMe, signin, signup, signout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
