import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJson } from "../api/http";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='500'%3E%3Crect fill='%23E5E5E5' width='900' height='500'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20'%3EArticle Image%3C/text%3E%3C/svg%3E";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchJson(`/api/blogs/slug/${slug}`)
      .then(setBlog)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-400">
        <p className="text-lg">Article not found.</p>
        <Link to="/thought-leadership" className="mt-4 text-red-500 text-sm hover:underline">
          Back to Thought Leadership
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="bg-white text-gray-900">
      {/* ── Cover Image ── */}
      <section className="w-full">
        <div className="mx-auto max-w-4xl px-4 pt-6">
          <img
            src={blog.coverImage || PLACEHOLDER_IMG}
            alt={blog.title}
            className="w-full rounded-sm"
          />
        </div>
      </section>

      {/* ── Title + Meta ── */}
      <section className="mx-auto max-w-4xl px-4 mt-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-gray-900">
          {blog.title}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        {blog.author && (
          <p className="mt-1 text-sm text-gray-400">By {blog.author}</p>
        )}

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[11px] font-medium bg-gray-100 text-gray-500 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── Content + Share Sidebar ── */}
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div
              className="prose prose-gray max-w-none text-[15px] leading-relaxed text-gray-600
                         prose-p:mb-4 prose-h3:text-lg prose-h3:font-bold prose-h3:text-gray-900 prose-h3:mt-8
                         prose-ul:list-disc prose-ul:pl-5 prose-li:text-gray-600
                         prose-strong:text-gray-800
                         prose-em:text-gray-500"
              dangerouslySetInnerHTML={{
                __html: blog.content || "<p>Full article content coming soon.</p>",
              }}
            />
          </div>

          {/* Share Sidebar */}
          <div className="hidden md:flex flex-col items-center gap-4 pt-2 shrink-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
              SHARE THIS
            </p>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition"
            >
              <FaXTwitter size={14} />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition"
            >
              <FaLinkedinIn size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Back link ── */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <Link
          to="/thought-leadership"
          className="text-sm text-red-500 hover:text-red-600 transition"
        >
          &laquo; Back to Thought Leadership
        </Link>
      </section>
    </div>
  );
}
