import { useEffect, useState } from "react";
import { fetchJson } from "../api/http";

// Extract YouTube video ID from embed URL
function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:embed\/|watch\?v=|youtu\.be\/)([^&?\s/]+)/);
  return m ? m[1] : null;
}

// Get YouTube thumbnail from video ID
function getYouTubeThumbnail(url) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='360'%3E%3Crect fill='%23222' width='480' height='360'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18'%3EVideo Thumbnail%3C/text%3E%3C/svg%3E";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [featuredId, setFeaturedId] = useState(null);

  useEffect(() => {
    fetchJson("/api/videos")
      .then((d) => {
        const arr = Array.isArray(d) ? d : [];
        setVideos(arr);
        if (arr.length > 0) setFeaturedId(arr[0]._id);
      })
      .catch(() => {});
  }, []);

  const featured = videos.find((v) => v._id === featuredId) || videos[0];
  const others = videos.filter((v) => v._id !== featuredId);

  return (
    <div className="bg-[#111] text-white min-h-screen">
      {/* ── FEATURED VIDEO (large embed) ── */}
      {featured && (
        <section className="pt-4 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="aspect-video w-full rounded-sm overflow-hidden bg-black">
              <iframe
                src={featured.videoUrl}
                title={featured.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── VIDEO THUMBNAILS GRID ── */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-7xl">
          {videos.length === 0 && (
            <p className="text-white/40 text-center py-12">
              No videos added yet. Add videos from the admin dashboard.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const thumb = video.thumbnailUrl || getYouTubeThumbnail(video.videoUrl) || PLACEHOLDER_THUMB;
              const isActive = video._id === featuredId;

              return (
                <div
                  key={video._id}
                  className={`group cursor-pointer ${isActive ? "ring-2 ring-red-500 rounded-sm" : ""}`}
                  onClick={() => {
                    setFeaturedId(video._id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {/* Thumbnail with play overlay */}
                  <div className="aspect-video overflow-hidden bg-gray-900 rounded-sm relative">
                    <img
                      src={thumb}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-sm font-semibold text-white leading-snug group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
