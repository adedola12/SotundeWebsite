import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchJson } from "../api/http";
import SafeImage from "../components/common/SafeImage";
import { FaArrowRight } from "react-icons/fa";

// Placeholder hero (dark silhouette on gradient)
const PLACEHOLDER_HERO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='700'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23222'/%3E%3Cstop offset='100%25' stop-color='%23444'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='1200' height='700'/%3E%3Ctext fill='%23888' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='28' font-family='Arial'%3EHero Image — Replace via Admin%3C/text%3E%3C/svg%3E";

// Placeholder article image
const PLACEHOLDER_CARD =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23D5D5D5' width='600' height='400'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18' font-family='Arial'%3EArticle Image%3C/text%3E%3C/svg%3E";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [about, setAbout] = useState([]);

  useEffect(() => {
    fetchJson("/api/blogs/featured").then((d) => setBlogs(Array.isArray(d) ? d : [])).catch(() => {});
    fetchJson("/api/videos").then((v) => setVideos(Array.isArray(v) ? v.slice(0, 3) : [])).catch(() => {});
    fetchJson("/api/about").then((d) => setAbout(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const heroSection = (about || []).find((s) => s.section === "hero");
  const quoteSection = (about || []).find((s) => s.section === "quote");

  // Use first 3 blogs for featured cards, pad with placeholders
  const featuredCards = [...blogs.slice(0, 3)];
  while (featuredCards.length < 3) {
    featuredCards.push({
      _id: `placeholder-${featuredCards.length}`,
      title: ["Leadership in Modern Construction", "The Future of Quantity Surveying in Africa", "Building Sustainable Communities"][featuredCards.length] || "Article Coming Soon",
      excerpt: "Read more about insights and perspectives on leadership, construction, and professional development.",
      slug: "",
      coverImage: "",
      category: "thought-leadership",
      createdAt: new Date().toISOString(),
      _placeholder: true,
    });
  }

  return (
    <div className="bg-white text-gray-900">
      {/* ══════════════════════════════════════════
          HERO SECTION — Full-width B&W image with overlay text
          ══════════════════════════════════════════ */}
      <section className="relative w-full" style={{ height: "85vh", minHeight: 500 }}>
        {/* B&W Hero Image */}
        <div className="absolute inset-0">
          <img
            src={heroSection?.imageUrl || PLACEHOLDER_HERO}
            alt="Bolaji Sotunde"
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(100%) contrast(1.1)" }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        {/* Hero Text */}
        <div className="relative z-10 h-full flex items-end pb-16 sm:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-lg"
            >
              {heroSection?.title
                ? `${heroSection.title}'s Lifework & Impact`
                : "Bolaji Sotunde's Lifework & Impact"}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURED ARTICLES — 3 cards, B&W images that colorize on hover
          ══════════════════════════════════════════ */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCards.map((blog) => (
              <article key={blog._id} className="group">
                {blog.slug && !blog._placeholder ? (
                  <Link to={`/thought-leadership/${blog.slug}`} className="block">
                    <CardContent blog={blog} />
                  </Link>
                ) : (
                  <div><CardContent blog={blog} /></div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LIFESTYLE — 3 categories: Travel, Events, Personal
          ══════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-sm font-medium tracking-[0.2em] text-gray-400 uppercase mb-10">
            LIFESTYLE
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "TRAVEL",
                subtitle: "Spreading the Message",
                img: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='500'%3E%3Crect fill='%23CCC' width='600' height='500'/%3E%3Ctext fill='%23888' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20'%3ETravel Photo%3C/text%3E%3C/svg%3E",
              },
              {
                title: "EVENTS",
                subtitle: "Work Hard, Play Hard",
                img: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='500'%3E%3Crect fill='%23BBB' width='600' height='500'/%3E%3Ctext fill='%23777' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20'%3EEvents Photo%3C/text%3E%3C/svg%3E",
              },
              {
                title: "PERSONAL",
                subtitle: "Life Beyond Work",
                img: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='500'%3E%3Crect fill='%23AAA' width='600' height='500'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20'%3EPersonal Photo%3C/text%3E%3C/svg%3E",
              },
            ].map((item) => (
              <Link
                key={item.title}
                to="/lifestyle"
                className="group relative block overflow-hidden rounded-sm aspect-[4/5]"
              >
                {/* B&W by default, full color on hover */}
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
                />
                {/* Overlay with title */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-lg font-bold tracking-[0.2em]">{item.title}</h3>
                    <p className="text-sm mt-1 opacity-80">{item.subtitle}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VIDEO GALLERY — YouTube embeds with play buttons
          ══════════════════════════════════════════ */}
      {videos.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <div key={video._id}>
                  <div className="aspect-video rounded-sm overflow-hidden bg-gray-100">
                    <iframe
                      src={video.videoUrl}
                      title={video.title}
                      className="w-full h-full"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-gray-900 leading-snug">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed line-clamp-3">
                      {video.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          QUOTE SECTION — Circle quote + B&W background image
          ══════════════════════════════════════════ */}
      <section className="relative py-0" style={{ minHeight: 500 }}>
        {/* B&W background */}
        <div className="absolute inset-0 bg-gray-900">
          <img
            src={heroSection?.imageUrl || PLACEHOLDER_HERO}
            alt=""
            className="w-full h-full object-cover opacity-40"
            style={{ filter: "grayscale(100%)" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 flex flex-col lg:flex-row items-center min-h-[500px]">
          {/* Quote Circle */}
          <div className="w-full lg:w-1/2 flex justify-center py-16">
            <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gray-100/95 flex flex-col items-center justify-center px-10 text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-medium mb-4">
                Words to Live By
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-gray-800 italic">
                {quoteSection?.content ||
                  "Nothing is impossible. With the right mindset, teamwork, and unwavering commitment, any challenge can be overcome."}
              </p>
              <p className="mt-4 text-xs font-medium text-gray-500 tracking-wider">
                - {quoteSection?.title || "BOLAJI SOTUNDE"}
              </p>
            </div>
          </div>

          {/* Right side — portrait (hidden on mobile, covered by bg) */}
          <div className="hidden lg:block w-1/2" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LIBRARY — Recommended Books
          ══════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-sm font-medium tracking-[0.2em] text-gray-400 uppercase mb-10">
            LIBRARY
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {/* Book 1 */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-sm p-6 inline-block">
                <div className="w-40 h-56 bg-gray-200 flex items-center justify-center text-gray-500 text-xs mx-auto rounded-sm">
                  Book Cover
                </div>
              </div>
              <h3 className="mt-4 text-sm font-bold uppercase tracking-wider">
                The Seven Habits of Highly Effective People
              </h3>
              <p className="text-xs text-red-500 mt-1">Stephen Covey</p>
            </div>

            {/* Book 2 */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-sm p-6 inline-block">
                <div className="w-40 h-56 bg-gray-200 flex items-center justify-center text-gray-500 text-xs mx-auto rounded-sm">
                  Book Cover
                </div>
              </div>
              <h3 className="mt-4 text-sm font-bold uppercase tracking-wider">
                Atomic Habits
              </h3>
              <p className="text-xs text-red-500 mt-1">James Clear</p>
            </div>

            {/* Visit Library Link */}
            <div className="flex items-center justify-center h-full">
              <Link
                to="/library"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                <FaArrowRight size={12} />
                <span>VISIT LIBRARY</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Article Card Component ── */
function CardContent({ blog }) {
  return (
    <>
      {/* Image — B&W default, color on hover */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 rounded-sm">
        <img
          src={blog.coverImage || PLACEHOLDER_CARD}
          alt={blog.title}
          className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0"
        />
      </div>

      {/* Text */}
      <div className="mt-4">
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-3 group-hover:text-gray-700 transition-colors">
          {blog.title}
        </h3>
        {blog.slug && (
          <p className="mt-2 text-xs font-medium text-red-500 uppercase tracking-wider">
            Read More &raquo;
          </p>
        )}
        <p className="mt-3 text-xs text-gray-400">
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {"  "}
          <span className="mx-1">&middot;</span> No Comments
        </p>
      </div>
    </>
  );
}
