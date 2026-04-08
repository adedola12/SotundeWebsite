import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminAuthPage() {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/admin";

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Authenticating..." });
    try {
      const email = (form.email || "").trim().toLowerCase();
      const password = form.password || "";
      if (mode === "signin") {
        await signIn({ email, password });
      } else {
        const name = (form.name || "").trim() || email.split("@")[0];
        await signUp({ name, email, password });
      }
      setStatus({ type: "success", message: "Welcome!" });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Authentication failed." });
    }
  };

  return (
    <div className="min-h-screen bg-[#050A15] pb-16 text-white flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="rounded-2xl border border-white/10 bg-[#0A1628] px-6 py-8 shadow-2xl">
          <h1 className="text-2xl font-semibold mb-2">
            {mode === "signin" ? "Admin Sign In" : "Admin Sign Up"}
          </h1>
          <p className="text-sm text-white/50 mb-6">
            Manage speeches, gallery, articles, and website content.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold mb-1 text-white/80">Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  className="w-full rounded-md bg-white/10 border border-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50"
                  placeholder="Your name" />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold mb-1 text-white/80">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                className="w-full rounded-md bg-white/10 border border-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50"
                placeholder="admin@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-white/80">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required
                className="w-full rounded-md bg-white/10 border border-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={status.type === "loading"}
              className="mt-2 w-full btn disabled:opacity-60 disabled:cursor-not-allowed">
              {status.type === "loading" ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Admin Account"}
            </button>
          </form>

          {status.type !== "idle" && (
            <p className={`mt-3 text-xs ${status.type === "error" ? "text-red-400" : status.type === "success" ? "text-green-400" : "text-white/50"}`}>
              {status.message}
            </p>
          )}

          <button type="button" onClick={() => setMode((p) => p === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-center text-xs text-white/50 hover:text-white">
            {mode === "signin" ? "Need an account? Sign up as admin" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
