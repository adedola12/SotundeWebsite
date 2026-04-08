import { useEffect, useState } from "react";
import { fetchJson } from "../../api/http";
import { FiEdit2, FiTrash2, FiUpload, FiImage } from "react-icons/fi";

export default function GalleryTab() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", category: "other", published: true });
  const [uploading, setUploading] = useState(false);

  const load = () => fetchJson("/api/gallery/admin").then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ title: "", description: "", imageUrl: "", category: "other", published: true }); setEditing(null); };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await fetchJson(`/api/gallery/admin/${editing}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await fetchJson("/api/gallery/admin", { method: "POST", body: JSON.stringify(form) });
      }
      resetForm(); load();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (item) => {
    setEditing(item._id);
    setForm({ title: item.title || "", description: item.description || "", imageUrl: item.imageUrl, category: item.category || "other", published: item.published });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this gallery item?")) return;
    await fetchJson(`/api/gallery/admin/${id}`, { method: "DELETE" }).catch(() => {});
    load();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file);
      const data = await fetchJson("/api/gallery/admin/upload", { method: "POST", body: fd });
      setForm((p) => ({ ...p, imageUrl: data.url }));
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  // Quick upload — upload image and immediately create a gallery item
  const handleQuickUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    for (const file of files) {
      try {
        const fd = new FormData(); fd.append("image", file);
        const data = await fetchJson("/api/gallery/admin/upload", { method: "POST", body: fd });
        await fetchJson("/api/gallery/admin", {
          method: "POST",
          body: JSON.stringify({ title: file.name.replace(/\.[^.]+$/, ""), imageUrl: data.url, category: "other", published: true }),
        });
      } catch (err) { console.error(err); }
    }
    setUploading(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">{editing ? "Edit Gallery Item" : "Add Gallery Item"}</h2>
        <label className="btn btn-sm cursor-pointer flex items-center gap-2">
          <FiImage size={14} /> Quick Upload{uploading ? "..." : ""}
          <input type="file" accept="image/*" multiple onChange={handleQuickUpload} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="input-dark" placeholder="Photo title" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-dark">
            {["events", "travel", "personal", "official", "other"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1">Description</label>
          <input name="description" value={form.description} onChange={handleChange} className="input-dark" placeholder="Brief description" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1">Image *</label>
          <div className="flex gap-2">
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="input-dark flex-1" placeholder="Image URL or upload" />
            <label className="btn btn-sm cursor-pointer flex items-center gap-1">
              <FiUpload size={12} /> {uploading ? "..." : "Upload"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4" />
          <label className="text-xs">Published</label>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <button onClick={handleSave} className="btn">{editing ? "Update" : "Add Item"}</button>
        {editing && <button onClick={resetForm} className="btn-outline">Cancel</button>}
      </div>

      {/* Gallery Grid */}
      <h3 className="text-sm font-semibold mb-3 text-white/70">Gallery Items ({items.length})</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
        {items.map((item) => (
          <div key={item._id} className="rounded overflow-hidden bg-white/5 group relative aspect-square">
            <img src={item.imageUrl} alt={item.title || ""} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => handleEdit(item)} className="p-2 bg-white/10 rounded hover:bg-white/20"><FiEdit2 size={14} /></button>
              <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-500/20 rounded hover:bg-red-500/30 text-red-400"><FiTrash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
