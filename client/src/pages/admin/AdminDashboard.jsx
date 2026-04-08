import { useState } from "react";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

import SpeechesTab from "../../components/Admin/SpeechesTab";
import GalleryTab from "../../components/Admin/GalleryTab";
import BlogsTab from "../../components/Admin/BlogsTab";
import AboutTab from "../../components/Admin/AboutTab";
import VideosTab from "../../components/Admin/VideosTab";
import ContactsTab from "../../components/Admin/ContactsTab";
import BooksTab from "../../components/Admin/BooksTab";

const tabs = [
  { id: "speeches", label: "Speeches" },
  { id: "blogs", label: "Articles" },
  { id: "gallery", label: "Gallery" },
  { id: "videos", label: "Videos" },
  { id: "books", label: "Library" },
  { id: "about", label: "About" },
  { id: "contacts", label: "Messages" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("speeches");
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#050A15] pt-24 pb-16 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#C9A96E] font-semibold">Admin</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold playfair">
              Content Management
            </h1>
            <p className="mt-2 text-sm text-white/50 max-w-xl">
              Manage speeches, articles, gallery, videos, about sections, and contact messages.
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/60">
                Logged in as <span className="font-semibold text-white">{user.email}</span>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-red-400/70 bg-red-500/10 text-red-300 hover:bg-red-500/25 transition-colors"
                title="Sign out"
              >
                <FiLogOut className="h-4 w-4" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8 inline-flex flex-wrap rounded-xl border border-white/15 bg-black/50 p-1 text-xs gap-1">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  active
                    ? "bg-[#C9A96E] text-[#050A15] shadow-[0_0_20px_rgba(201,169,110,0.25)]"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border border-white/10 bg-[#0A1628] px-6 py-7 sm:px-8 sm:py-8 shadow-2xl">
          {activeTab === "speeches" && <SpeechesTab />}
          {activeTab === "blogs" && <BlogsTab />}
          {activeTab === "gallery" && <GalleryTab />}
          {activeTab === "videos" && <VideosTab />}
          {activeTab === "books" && <BooksTab />}
          {activeTab === "about" && <AboutTab />}
          {activeTab === "contacts" && <ContactsTab />}
        </div>
      </div>
    </div>
  );
}
