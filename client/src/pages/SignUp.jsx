import { useState } from "react";
import { fetchJson } from "../api/http";
import { FiArrowRight } from "react-icons/fi";

const HERO_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23222'/%3E%3Cstop offset='100%25' stop-color='%23111'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='600' height='800'/%3E%3Ctext fill='%23555' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18'%3ESignUp Image — Replace via Admin%3C/text%3E%3C/svg%3E";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus({ type: "loading", message: "Subscribing..." });

    try {
      const data = await fetchJson("/api/contact/subscribe", {
        method: "POST",
        body: JSON.stringify({ firstName: firstName.trim(), email: email.trim() }),
      });
      setStatus({ type: "success", message: data.message || "Subscribed successfully!" });
      setFirstName("");
      setEmail("");
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to subscribe." });
    }
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-[80vh]">
      {/* ── MAIN SECTION: Image left + Form right ── */}
      <section className="flex flex-col lg:flex-row min-h-[70vh]">
        {/* Left — B&W Image */}
        <div className="lg:w-[45%] w-full">
          <img
            src={HERO_IMG}
            alt="Join Monthly Insights"
            className="w-full h-full object-cover min-h-[300px] lg:min-h-full"
            style={{ filter: "grayscale(100%) contrast(1.1)" }}
          />
        </div>

        {/* Right — Form */}
        <div className="lg:w-[55%] w-full flex items-center justify-center px-8 sm:px-12 lg:px-16 py-16">
          <div className="max-w-md w-full">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-8">
              Join for Monthly Insights
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="flex border border-gray-400 bg-white">
                {/* First Name */}
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="FIRST NAME"
                  className="flex-1 px-4 py-4 text-xs uppercase tracking-wider text-gray-600 placeholder:text-gray-400 bg-transparent focus:outline-none border-r border-gray-300"
                />
                {/* Email */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL ADDRESS"
                  required
                  className="flex-1 px-4 py-4 text-xs uppercase tracking-wider text-gray-600 placeholder:text-gray-400 bg-transparent focus:outline-none"
                />
                {/* Submit arrow */}
                <button
                  type="submit"
                  disabled={status.type === "loading"}
                  className="px-5 flex items-center justify-center bg-transparent hover:bg-gray-100 transition border-l border-gray-300"
                >
                  <FiArrowRight size={18} className="text-gray-600" />
                </button>
              </div>
            </form>

            {/* Status message */}
            {status.type !== "idle" && (
              <p className={`mt-3 text-sm ${
                status.type === "error" ? "text-red-500" :
                status.type === "success" ? "text-green-600" : "text-gray-500"
              }`}>
                {status.message}
              </p>
            )}

            <p className="mt-4 text-xs text-gray-500 leading-relaxed">
              We will never share or spam your email address. By clicking "Sign Up"
              you agree to the{" "}
              <span className="underline">Terms of Use</span> and{" "}
              <span className="underline">Privacy Policy</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
