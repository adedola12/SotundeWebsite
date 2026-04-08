import { Link } from "react-router-dom";
import { useState } from "react";
import { fetchJson } from "../api/http";
import { FaYoutube, FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";

export default function Footer() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const data = await fetchJson("/api/contact/subscribe", {
        method: "POST",
        body: JSON.stringify({
          firstName: `${firstName.trim()} ${lastName.trim()}`.trim(),
          email: email.trim(),
        }),
      });
      setStatus(data.message || "Subscribed!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setStatus(err.message || "Failed to subscribe");
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ── LEFT SIDE: Social + Newsletter ── */}
          <div>
            {/* Social Icons */}
            <div className="flex items-center gap-5 mb-6">
              {[
                { icon: FaYoutube, href: "#", label: "YouTube" },
                { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
                { icon: FaFacebookF, href: "#", label: "Facebook" },
                { icon: FaXTwitter, href: "#", label: "Twitter" },
                { icon: FaInstagram, href: "#", label: "Instagram" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition"
                  title={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>

            {/* Newsletter heading */}
            <h4 className="text-lg font-semibold mb-4">Join for Monthly Insights</h4>

            {/* Subscribe form — 3 fields + arrow */}
            <form onSubmit={handleSubscribe} className="flex border border-white/25 bg-transparent">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="FIRST NAME"
                className="w-28 sm:w-32 px-3 py-3 text-[11px] uppercase tracking-wider text-white placeholder:text-white/30 bg-transparent focus:outline-none border-r border-white/15"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="LAST NAME"
                className="w-28 sm:w-32 px-3 py-3 text-[11px] uppercase tracking-wider text-white placeholder:text-white/30 bg-transparent focus:outline-none border-r border-white/15"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                required
                className="flex-1 px-3 py-3 text-[11px] uppercase tracking-wider text-white placeholder:text-white/30 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 flex items-center justify-center border-l border-white/15 hover:bg-white/10 transition"
              >
                <FiArrowRight size={16} className="text-white/70" />
              </button>
            </form>

            {status && <p className="text-xs mt-2 text-red-400">{status}</p>}

            <p className="mt-3 text-[11px] text-white/30 leading-relaxed max-w-md">
              We will never share or spam your email address. By clicking "Sign Up"
              you agree to the{" "}
              <Link to="/contact" className="underline hover:text-white/50">Terms of Use</Link> and{" "}
              <Link to="/contact" className="underline hover:text-white/50">Privacy Policy</Link>
            </p>
          </div>

          {/* ── RIGHT SIDE: Page Links (2 columns) ── */}
          <div className="flex justify-end">
            <div className="flex gap-16 sm:gap-20">
              {/* Column 1 */}
              <div className="flex flex-col gap-3">
                <Link to="/about" className="text-xs font-bold tracking-wider text-red-400 hover:text-red-300 transition uppercase">
                  ABOUT SOTUNDE
                </Link>
                <Link to="/thought-leadership" className="text-xs font-bold tracking-wider text-red-400 hover:text-red-300 transition uppercase">
                  THOUGHT LEADERSHIP
                </Link>
                <Link to="/about/quantity-surveying" className="text-xs font-bold tracking-wider text-red-400 hover:text-red-300 transition uppercase">
                  QUANTITY SURVEYING
                </Link>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-3">
                <Link to="/about/project-management" className="text-xs font-bold tracking-wider text-red-400 hover:text-red-300 transition uppercase">
                  PROJECT MANAGEMENT
                </Link>
                <Link to="/library" className="text-xs font-bold tracking-wider text-red-400 hover:text-red-300 transition uppercase">
                  LIBRARY
                </Link>
                <Link to="/contact" className="text-xs font-bold tracking-wider text-red-400 hover:text-red-300 transition uppercase">
                  CONTACT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR: Copyright + Policy Links ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs font-bold tracking-wider text-red-400 uppercase">
            &copy; {new Date().getFullYear()} BOLAJI O. SOTUNDE
          </p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="text-xs text-white/40 hover:text-white/60 transition underline">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-xs text-white/40 hover:text-white/60 transition underline">
              Terms of Use
            </Link>
            <Link to="/contact" className="text-xs text-white/40 hover:text-white/60 transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
