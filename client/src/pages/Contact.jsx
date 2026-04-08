import { useState } from "react";
import { fetchJson } from "../api/http";
import { FiArrowRight } from "react-icons/fi";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='900'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23333'/%3E%3Cstop offset='100%25' stop-color='%23222'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='700' height='900'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18'%3EContact Photo — Replace via Admin%3C/text%3E%3C/svg%3E";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Sending..." });
    try {
      const data = await fetchJson("/api/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setStatus({ type: "success", message: data.message || "Message sent!" });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to send message." });
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-[80vh]">
      <section className="flex flex-col lg:flex-row">
        {/* ── LEFT: Contact Form ── */}
        <div className="lg:w-[48%] w-full px-6 sm:px-10 lg:px-14 py-12 lg:py-16 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-10" style={{ fontFamily: "Georgia, serif" }}>
            Contact
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Full Name */}
            <div>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="FULL NAME"
                className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-sm uppercase tracking-wider text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="EMAIL ADDRESS"
                className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-sm uppercase tracking-wider text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="PHONE NUMBER"
                className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-sm uppercase tracking-wider text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>

            {/* Message */}
            <div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={3}
                placeholder="MESSAGE"
                className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-sm uppercase tracking-wider text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors resize-y"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status.type === "loading"}
              className="flex items-center gap-2 text-sm font-medium tracking-wider text-gray-700 hover:text-gray-900 transition-colors mt-4 disabled:opacity-50"
            >
              SUBMIT <FiArrowRight size={14} />
            </button>
          </form>

          {/* Status */}
          {status.type !== "idle" && (
            <p className={`mt-4 text-sm ${
              status.type === "error" ? "text-red-500" :
              status.type === "success" ? "text-green-600" : "text-gray-500"
            }`}>
              {status.message}
            </p>
          )}
        </div>

        {/* ── RIGHT: B&W Image ── */}
        <div className="lg:w-[52%] w-full">
          <img
            src={PLACEHOLDER_IMG}
            alt="Bolaji Sotunde"
            className="w-full h-full object-cover min-h-[400px] lg:min-h-full"
            style={{ filter: "grayscale(100%) contrast(1.1)" }}
          />
        </div>
      </section>
    </div>
  );
}
