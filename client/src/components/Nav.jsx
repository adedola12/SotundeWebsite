import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

const mainLinks = [
  {
    label: "ABOUT",
    path: "/about",
    dropdown: [
      { label: "About Sotunde", path: "/about" },
      { label: "Project Management", path: "/about/project-management" },
      { label: "Quantity Surveying", path: "/about/quantity-surveying" },
    ],
  },
  { label: "SPEECHES", path: "/speeches" },
  { label: "LIFESTYLE", path: "/lifestyle" },
  { label: "THOUGHT LEADERSHIP", path: "/thought-leadership" },
  { label: "GALLERY", path: "/gallery" },
];

// Full-screen MENU overlay items with hover preview text
const menuItems = [
  { label: "Library", path: "/library", preview: "My Books and Top Reads" },
  { label: "Lifestyle", path: "/lifestyle", preview: "Travel, Events & Personal Life" },
  { label: "Thoughts", path: "/thought-leadership", preview: "I Love Sharing My Experiences & Thoughts" },
  { label: "Videos", path: "/videos", preview: "Catch Up with the Media" },
  { label: "News", path: "/news", preview: "Latest Updates & Announcements" },
  { label: "SignUp", path: "/signup", preview: "Stay Connected — Join the Community" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dropRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setDropdownOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isAboutActive = location.pathname.startsWith("/about");

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="shrink-0">
              <span className="text-sm sm:text-base font-bold tracking-[0.12em] text-gray-900 uppercase">
                BOLAJI O. SOTUNDE
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {mainLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label} className="relative" ref={dropRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`flex items-center gap-1 px-3 py-2 text-[11px] font-medium tracking-[0.1em] transition-colors ${
                        isAboutActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {link.label}
                      <FiChevronDown size={11} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-100 shadow-lg py-2 z-50">
                        {link.dropdown.map((sub) => (
                          <Link key={sub.path} to={sub.path} className="block px-5 py-2.5 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `px-3 py-2 text-[11px] font-medium tracking-[0.1em] transition-colors ${isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              )}

              {/* MENU button */}
              <button onClick={() => setMenuOpen(true)} className="ml-3 flex flex-col items-end gap-[5px] px-2 py-2 group" title="Menu">
                <span className="text-[11px] font-medium tracking-[0.1em] text-gray-500 group-hover:text-gray-900 transition-colors mb-0.5">MENU</span>
                <span className="block w-6 h-[2px] bg-gray-900" />
                <span className="block w-6 h-[2px] bg-gray-900" />
              </button>
            </div>

            {/* Mobile */}
            <button onClick={() => setMenuOpen(true)} className="lg:hidden flex flex-col items-end gap-[5px] px-2 py-2">
              <span className="text-[11px] font-medium tracking-[0.1em] text-gray-500">MENU</span>
              <span className="block w-6 h-[2px] bg-gray-900" />
              <span className="block w-6 h-[2px] bg-gray-900" />
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          FULL-SCREEN DARK MENU OVERLAY
          ══════════════════════════════════════════ */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#111] flex">
          {/* Left side — Preview text area */}
          <div className="hidden md:flex flex-1 items-center px-12 lg:px-20">
            <p
              className="text-white/50 text-sm sm:text-base font-light leading-relaxed transition-all duration-300"
              style={{ opacity: hoveredItem ? 1 : 0 }}
            >
              {hoveredItem?.preview || ""}
            </p>
          </div>

          {/* Right side — Links + Search + Close */}
          <div className="flex flex-col w-full md:w-auto md:min-w-[400px] lg:min-w-[480px] px-8 sm:px-12 lg:px-16 py-8">
            {/* Close button (hamburger X) */}
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center gap-[5px] p-2 group"
              >
                <span className="block w-7 h-[2px] bg-white rotate-45 translate-y-[3.5px]" />
                <span className="block w-7 h-[2px] bg-white -rotate-45 -translate-y-[3.5px]" />
              </button>
            </div>

            {/* Search bar */}
            <div className="mb-10">
              <div className="flex items-center border-b border-white/20 pb-2">
                <input
                  type="text"
                  placeholder="Search the site"
                  className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/30 focus:outline-none"
                />
                <svg className="w-5 h-5 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col items-end gap-1 flex-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white hover:text-white/60 transition-colors duration-200 py-1"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
