import { useEffect, useState } from "react";
import { fetchJson } from "../api/http";

const PLACEHOLDER_IMGS = Array.from({ length: 8 }, (_, i) => ({
  _id: `ph-${i}`,
  title: "",
  imageUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23${["E8E0D4","D4DDE8","D8E4D4","E4D4D8","D4E8E0","E0D4E8","E8D4D4","D4D8E8"][i]}' width='400' height='400'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14'%3EGallery ${i + 1}%3C/text%3E%3C/svg%3E`,
  category: "other",
  _placeholder: true,
}));

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchJson("/api/gallery")
      .then((d) => setImages(Array.isArray(d) ? d : []))
      .catch(() => {});
    fetchJson("/api/videos")
      .then((d) => setVideos(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  // Use real images or placeholders
  const displayImages = images.length > 0 ? images : PLACEHOLDER_IMGS;

  return (
    <div className="bg-white text-gray-900">
      {/* ── PAGE TITLE ── */}
      <section className="pt-8 pb-4 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Sotunde Gallery
          </h1>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          IMAGES SECTION
          ═══════════════════════════════════════ */}
      <section className="py-6 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-sm font-normal text-gray-400 mb-6">Images</h2>

          {/* 4-column grid matching TOE gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
            {displayImages.map((item) => (
              <div
                key={item._id}
                className="group relative aspect-square overflow-hidden bg-gray-200 cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || "Gallery"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Hover overlay with title */}
                {item.title && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                    <p className="px-3 py-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <p className="text-center text-sm text-gray-400 mt-4 italic">
              Placeholder images shown. Add real photos from the admin dashboard.
            </p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          VIDEOS SECTION
          ═══════════════════════════════════════ */}
      <section className="py-10 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-sm font-normal text-gray-400 mb-6">Videos</h2>

          {videos.length === 0 && (
            <p className="text-gray-300 text-sm py-8">
              No videos added yet. Add videos from the admin dashboard.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <h3 className="mt-3 text-sm font-semibold text-gray-900 leading-snug">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                    {video.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
