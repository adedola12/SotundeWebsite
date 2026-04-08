import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJson } from "../api/http";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23E5E5E5' width='400' height='300'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14'%3ENews Image%3C/text%3E%3C/svg%3E";

const PER_PAGE = 9;

// Placeholder news for when DB is empty
const placeholderNews = [
  { _id: "pn1", title: "Keynote Address at the Nigerian Bar Association's Annual General Conference 2023", slug: "", createdAt: "2023-08-27", coverImage: "" },
  { _id: "pn2", title: "Celebrating the 50th Anniversary of NIQS Lagos Chapter", slug: "", createdAt: "2023-10-15", coverImage: "" },
  { _id: "pn3", title: "Men of Impact 2025 — Recognising Leaders in Quantity Surveying", slug: "", createdAt: "2025-02-01", coverImage: "" },
  { _id: "pn4", title: "World Architectural Festival Awards — Berlin, Germany 2016", slug: "", createdAt: "2016-11-20", coverImage: "" },
  { _id: "pn5", title: "PMO Global Awards Recognition — Project Management Excellence", slug: "", createdAt: "2019-06-15", coverImage: "" },
  { _id: "pn6", title: "NIQS Press Conference — Addressing Construction Material Price Escalation", slug: "", createdAt: "2024-02-29", coverImage: "" },
  { _id: "pn7", title: "Investiture as Fellow of the Nigerian Institute of Quantity Surveyors", slug: "", createdAt: "2023-11-15", coverImage: "" },
  { _id: "pn8", title: "Big 5 Talks Panel — Circular Economy in Construction", slug: "", createdAt: "2024-03-10", coverImage: "" },
];

export default function News() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchJson("/api/blogs")
      .then((d) => {
        const arr = Array.isArray(d) ? d : [];
        // Filter news category or use all if few exist
        const news = arr.filter((b) => b.category === "news");
        setArticles(news.length > 0 ? news : arr);
      })
      .catch(() => {});
  }, []);

  // Use real articles or placeholders
  const displayArticles = articles.length > 0 ? articles : placeholderNews;
  const sorted = [...displayArticles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white text-gray-900">
      {/* ── HEADER ── */}
      <section className="pt-10 pb-4 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm text-gray-400 italic leading-relaxed">
            Bolaji O. Sotunde is a resolute, determined, and results-focused professional
            committed to excellence in Quantity Surveying and Project Management.
          </p>
          <hr className="mt-6 border-gray-200" />
        </div>
      </section>

      {/* ── NEWS GRID ── */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {paginated.map((article) => (
              <NewsCard key={article._id} article={article} />
            ))}
          </div>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`text-sm transition ${page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-900"}`}
              >
                &laquo; Previous
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`text-sm transition ${page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:text-red-600"}`}
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

function NewsCard({ article }) {
  const hasSlug = article.slug && !article.slug.startsWith("pn");
  const Wrapper = hasSlug ? Link : "div";
  const wrapperProps = hasSlug ? { to: `/thought-leadership/${article.slug}` } : {};

  return (
    <article className="group">
      <Wrapper {...wrapperProps} className="block">
        {/* Image — centered, smaller than full width */}
        <div className="w-[85%] mx-auto aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={article.coverImage || PLACEHOLDER_IMG}
            alt={article.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>

        {/* Title */}
        <h2 className="mt-4 text-[15px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors">
          {article.title}
        </h2>
      </Wrapper>

      {/* Divider line */}
      <hr className="mt-3 mb-2 border-gray-200" />

      {/* Date */}
      <p className="text-xs text-gray-400">
        {new Date(article.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </article>
  );
}
