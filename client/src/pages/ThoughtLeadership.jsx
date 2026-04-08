import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJson } from "../api/http";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23D5D5D5' width='600' height='400'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16'%3EArticle Image%3C/text%3E%3C/svg%3E";

const PER_PAGE = 9;

export default function ThoughtLeadership() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchJson("/api/blogs")
      .then((d) => {
        const arr = Array.isArray(d) ? d : [];
        arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBlogs(arr);
      })
      .catch(() => {});
  }, []);

  const totalPages = Math.ceil(blogs.length / PER_PAGE);
  const paginated = blogs.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white text-gray-900">
      {/* ── PAGE HEADER (matches TOE "Thoughts" page) ── */}
      <section className="pt-10 pb-6 px-4">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-normal tracking-[0.12em] text-gray-400 uppercase mb-2">
            THOUGHTS
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight max-w-md">
            I love sharing my experiences &amp; thoughts
          </h1>
        </div>
      </section>

      {/* ── ARTICLES GRID ── */}
      <section className="py-8 px-4">
        <div className="mx-auto max-w-7xl">
          {blogs.length === 0 && (
            <p className="text-gray-400 text-center py-12">
              No articles published yet. Add from the admin dashboard.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {paginated.map((blog) => (
              <ArticleCard key={blog._id} blog={blog} />
            ))}
          </div>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`text-sm transition ${
                  page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-900"
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
                  page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:text-red-600"
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

function ArticleCard({ blog }) {
  return (
    <article className="group">
      <Link to={`/thought-leadership/${blog.slug}`} className="block">
        {/* Image — B&W default, color on hover */}
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={blog.coverImage || PLACEHOLDER_IMG}
            alt={blog.title}
            className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-[1.02]"
          />
        </div>

        {/* Title */}
        <h2 className="mt-4 text-[17px] font-bold leading-snug text-gray-900 group-hover:text-gray-700 transition-colors">
          {blog.title}
        </h2>
      </Link>

      {/* Date */}
      <p className="mt-1 text-xs text-gray-400 uppercase tracking-wider">
        {new Date(blog.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {/* Excerpt */}
      {blog.excerpt && (
        <p className="mt-2 text-[13px] text-gray-500 leading-relaxed line-clamp-4">
          {blog.excerpt}
        </p>
      )}

      {/* Read More */}
      <Link
        to={`/thought-leadership/${blog.slug}`}
        className="inline-block mt-3 text-xs font-medium text-red-500 hover:text-red-600 tracking-wider transition-colors"
      >
        READ MORE &raquo;
      </Link>
    </article>
  );
}
