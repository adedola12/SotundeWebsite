import { useEffect, useState } from "react";
import { fetchJson } from "../../api/http";
import { FiEdit2, FiTrash2, FiUpload, FiYoutube, FiVideo } from "react-icons/fi";

export default function VideosTab() {
  const [videos, setVideos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "", description: "", videoUrl: "", thumbnailUrl: "",
    category: "", published: true, featured: false, videoType: "youtube",
  });
  const [uploading, setUploading] = useState(false);

  const load = () => fetchJson("/api/videos/admin").then(setVideos).catch(() => {});
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", videoUrl: "", thumbnailUrl: "", category: "", published: true, featured: false, videoType: "youtube" });
    setEditing(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  // Convert YouTube watch URL to embed URL
  const normalizeYouTubeUrl = (url) => {
    if (!url) return url;
    // Already an embed URL
    if (url.includes("/embed/")) return url;
    // Standard watch URL
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        videoUrl: form.videoType === "youtube" ? normalizeYouTubeUrl(form.videoUrl) : form.videoUrl,
      };
      delete payload.videoType;

      if (editing) {
        await fetchJson(`/api/videos/admin/${editing}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await fetchJson("/api/videos/admin", { method: "POST", body: JSON.stringify(payload) });
      }
      resetForm(); load();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (v) => {
    const isYoutube = v.videoUrl?.includes("youtube") || v.videoUrl?.includes("youtu.be");
    setEditing(v._id);
    setForm({
      title: v.title, description: v.description || "", videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl || "", category: v.category || "",
      published: v.published, featured: v.featured,
      videoType: isYoutube ? "youtube" : "direct",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this video?")) return;
    await fetchJson(`/api/videos/admin/${id}`, { method: "DELETE" }).catch(() => {});
    load();
  };

  // Direct video upload via Cloudinary (using gallery upload endpoint)
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file); // Cloudinary handles video too
      const data = await fetchJson("/api/gallery/admin/upload", { method: "POST", body: fd });
      setForm((p) => ({ ...p, videoUrl: data.url }));
    } catch (err) { alert("Upload failed: " + err.message); }
    setUploading(false);
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file);
      const data = await fetchJson("/api/gallery/admin/upload", { method: "POST", body: fd });
      setForm((p) => ({ ...p, thumbnailUrl: data.url }));
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Video" : "Add New Video"}</h2>

      {/* Video Type Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setForm((p) => ({ ...p, videoType: "youtube" }))}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition ${
            form.videoType === "youtube"
              ? "bg-red-500 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          <FiYoutube size={14} /> YouTube URL
        </button>
        <button
          onClick={() => setForm((p) => ({ ...p, videoType: "direct" }))}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition ${
            form.videoType === "direct"
              ? "bg-red-500 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          <FiVideo size={14} /> Direct Upload
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold mb-1">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className="input-dark" placeholder="Video title" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Category</label>
          <input name="category" value={form.category} onChange={handleChange} className="input-dark" placeholder="Interview, Keynote, etc." />
        </div>

        {/* YouTube URL or Direct Upload */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1">
            {form.videoType === "youtube" ? "YouTube URL *" : "Video File *"}
          </label>
          {form.videoType === "youtube" ? (
            <input
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              className="input-dark"
              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
            />
          ) : (
            <div className="flex gap-2">
              <input
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                className="input-dark flex-1"
                placeholder="Video URL (or upload)"
              />
              <label className="btn btn-sm cursor-pointer flex items-center gap-1">
                <FiUpload size={12} /> {uploading ? "..." : "Upload Video"}
                <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
              </label>
            </div>
          )}
          {form.videoType === "youtube" && form.videoUrl && (
            <p className="text-[10px] text-white/30 mt-1">
              Will auto-convert to embed URL: {normalizeYouTubeUrl(form.videoUrl)}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="input-dark resize-y" placeholder="Brief description" />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Thumbnail (optional)</label>
          <div className="flex gap-2">
            <input name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} className="input-dark flex-1" placeholder="Thumbnail URL" />
            <label className="btn btn-sm cursor-pointer flex items-center gap-1">
              <FiUpload size={12} /> Upload
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4" /> Published
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4" /> Featured
          </label>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <button onClick={handleSave} className="btn">{editing ? "Update Video" : "Add Video"}</button>
        {editing && <button onClick={resetForm} className="btn-outline">Cancel</button>}
      </div>

      {/* List */}
      <h3 className="text-sm font-semibold mb-3 text-white/70">All Videos ({videos.length})</h3>
      <div className="space-y-3">
        {videos.map((v) => (
          <div key={v._id} className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold truncate">{v.title}</h4>
              <p className="text-xs text-white/40 truncate">{v.videoUrl}</p>
              <p className="text-xs text-white/30">{v.published ? "Published" : "Draft"}{v.featured ? " • Featured" : ""}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(v)} className="p-2 hover:bg-white/10 rounded"><FiEdit2 size={14} /></button>
              <button onClick={() => handleDelete(v._id)} className="p-2 hover:bg-red-500/20 rounded text-red-400"><FiTrash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function normalizeYouTubeUrl(url) {
  if (!url) return url;
  if (url.includes("/embed/")) return url;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}
