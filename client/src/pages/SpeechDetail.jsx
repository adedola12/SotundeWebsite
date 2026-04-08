import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJson } from "../api/http";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='500'%3E%3Crect fill='%23E5E5E5' width='900' height='500'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20'%3ESpeech Image%3C/text%3E%3C/svg%3E";

export default function SpeechDetail() {
  const { slug } = useParams();
  const [speech, setSpeech] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchJson(`/api/speeches/slug/${slug}`)
      .then(setSpeech)
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

  if (!speech) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-400">
        <p className="text-lg">Speech not found.</p>
        <Link to="/speeches" className="mt-4 text-red-500 text-sm hover:underline">
          Back to Speeches
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="bg-white text-gray-900">
      {/* ── Hero Image ── */}
      <section className="w-full">
        <div className="mx-auto max-w-4xl px-4 pt-6">
          <img
            src={speech.coverImage || PLACEHOLDER_IMG}
            alt={speech.title}
            className="w-full rounded-sm"
          />
        </div>
      </section>

      {/* ── Title + Date ── */}
      <section className="mx-auto max-w-4xl px-4 mt-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-gray-900">
          {speech.title}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {speech.date
            ? new Date(speech.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""}
        </p>
        {speech.location && (
          <p className="mt-1 text-sm text-gray-400">{speech.location}</p>
        )}
      </section>

      {/* ── Content + Share Sidebar ── */}
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Video embed if available */}
            {speech.videoUrl && (
              <div className="aspect-video rounded-sm overflow-hidden mb-8">
                <iframe
                  src={speech.videoUrl}
                  title={speech.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}

            {/* Speech body */}
            <div
              className="prose prose-gray max-w-none text-[15px] leading-relaxed text-gray-600
                         prose-p:mb-4 prose-h3:text-lg prose-h3:font-bold prose-h3:text-gray-900 prose-h3:mt-8
                         prose-ul:list-disc prose-ul:pl-5 prose-li:text-gray-600"
              dangerouslySetInnerHTML={{
                __html:
                  speech.content || "<p>Full speech content coming soon.</p>",
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
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(speech.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition"
            >
              <FaXTwitter size={14} />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(speech.title)}`}
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
          to="/speeches"
          className="text-sm text-red-500 hover:text-red-600 transition"
        >
          &laquo; Back to all Speeches
        </Link>
      </section>
    </div>
  );
}
