import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJson } from "../api/http";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23D5D5D5' width='600' height='400'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16'%3ESpeech Photo%3C/text%3E%3C/svg%3E";

const HERO_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='0.5'%3E%3Cstop offset='0%25' stop-color='%23333'/%3E%3Cstop offset='100%25' stop-color='%23555'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='1400' height='600'/%3E%3Ctext fill='%23888' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24'%3ESpeeches Hero — Replace via Admin%3C/text%3E%3C/svg%3E";

const PER_PAGE = 9;

export default function Speeches() {
  const [speeches, setSpeeches] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchJson("/api/speeches")
      .then((d) => {
        const arr = Array.isArray(d) ? d : [];
        // Sort by date descending (latest first)
        arr.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
        setSpeeches(arr);
      })
      .catch(() => {});
  }, []);

  const totalPages = Math.ceil(speeches.length / PER_PAGE);
  const paginated = speeches.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Scroll to top of grid on page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  return (
    <div className="bg-white text-gray-900">
      {/* ── HERO BANNER ── */}
      <section className="relative w-full group" style={{ height: "60vh", minHeight: 400 }}>
        <img
          src={HERO_IMG}
          alt="Speeches"
          className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
      </section>

      {/* ── SPEECHES GRID ── */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-7xl">
          {speeches.length === 0 && (
            <p className="text-gray-400 text-center py-12">
              No speeches published yet. Add speeches from the admin dashboard.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {paginated.map((speech) => (
              <SpeechCard key={speech._id} speech={speech} />
            ))}
          </div>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`text-sm transition ${
                  page === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                &laquo; Previous
              </button>

              <span className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`text-sm transition ${
                  page === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-red-500 hover:text-red-600"
                }`}
              >
                Next &raquo;
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SpeechCard({ speech }) {
  return (
    <article className="group">
      <Link to={`/speeches/${speech.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={speech.coverImage || PLACEHOLDER_IMG}
            alt={speech.title}
            className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-[1.02]"
          />
        </div>
        <h2 className="mt-4 text-[17px] font-bold leading-snug text-gray-900 group-hover:text-gray-700 transition-colors">
          {speech.title}
        </h2>
      </Link>
      {speech.excerpt && (
        <p className="mt-2 text-[13px] text-gray-500 leading-relaxed line-clamp-5">
          {speech.excerpt}
        </p>
      )}
      <Link
        to={`/speeches/${speech.slug}`}
        className="inline-block mt-3 text-xs font-medium text-red-500 hover:text-red-600 tracking-wider transition-colors"
      >
        READ MORE &raquo;
      </Link>
    </article>
  );
}
