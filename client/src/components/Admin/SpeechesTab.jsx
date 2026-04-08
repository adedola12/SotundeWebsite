import { useEffect, useState } from "react";
import { fetchJson } from "../../api/http";
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiSearch } from "react-icons/fi";
import RichEditor from "./RichEditor";

export default function SpeechesTab() {
  const [speeches, setSpeeches] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", date: "", location: "", category: "Speech", coverImage: "", videoUrl: "", published: true });
  const [uploading, setUploading] = useState(false);

  const load = () => fetchJson("/api/speeches/admin").then((d) => setSpeeches(Array.isArray(d) ? d : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ title: "", slug: "", excerpt: "", content: "", date: "", location: "", category: "Speech", coverImage: "", videoUrl: "", published: true }); setEditing(null); };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSave = async () => {
    try {
      if (editing) {
        await fetchJson(`/api/speeches/admin/${editing}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await fetchJson("/api/speeches/admin", { method: "POST", body: JSON.stringify({ ...form, slug: form.slug || autoSlug(form.title) }) });
      }
      resetForm(); load();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (s) => {
    setEditing(s._id);
    setForm({ title: s.title, slug: s.slug, excerpt: s.excerpt || "", content: s.content || "", date: s.date ? s.date.slice(0, 10) : "", location: s.location || "", category: s.category || "Speech", coverImage: s.coverImage || "", videoUrl: s.videoUrl || "", published: s.published });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this speech?")) return;
    await fetchJson(`/api/speeches/admin/${id}`, { method: "DELETE" }).catch(() => {});
    load();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file);
      const data = await fetchJson("/api/speeches/admin/upload", { method: "POST", body: fd });
      setForm((p) => ({ ...p, coverImage: data.url }));
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  const filtered = speeches.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Speech" : "Add New Speech"}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold mb-1 text-white/80">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className="input-dark" placeholder="Speech title" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-white/80">Slug</label>
          <input name="slug" value={form.slug} onChange={handleChange} className="input-dark" placeholder="auto-generated-from-title" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-white/80">Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} className="input-dark" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-white/80">Location</label>
          <input name="location" value={form.location} onChange={handleChange} className="input-dark" placeholder="Lagos, Nigeria" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1 text-white/80">Excerpt</label>
          <input name="excerpt" value={form.excerpt} onChange={handleChange} className="input-dark" placeholder="Brief summary" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1 text-white/80">Content</label>
          <RichEditor value={form.content} onChange={(val) => setForm((p) => ({ ...p, content: val }))} placeholder="Full speech content..." />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-white/80">Video URL</label>
          <input name="videoUrl" value={form.videoUrl} onChange={handleChange} className="input-dark" placeholder="YouTube embed URL" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-white/80">Cover Image</label>
          <div className="flex gap-2">
            <input name="coverImage" value={form.coverImage} onChange={handleChange} className="input-dark flex-1" placeholder="Image URL" />
            <label className="btn btn-sm cursor-pointer flex items-center gap-1">
              <FiUpload size={12} /> {uploading ? "..." : "Upload"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          {form.coverImage && <img src={form.coverImage} alt="Preview" className="mt-2 h-16 rounded object-cover" />}
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4" />
          <label className="text-xs text-white/80">Published</label>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <button onClick={handleSave} className="btn">{editing ? "Update Speech" : "Add Speech"}</button>
        {editing && <button onClick={resetForm} className="btn-outline text-white border-white/20">Cancel</button>}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <FiSearch size={14} className="text-white/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-dark max-w-xs" placeholder="Search speeches..." />
      </div>

      <h3 className="text-sm font-semibold mb-3 text-white/70">All Speeches ({filtered.length})</h3>
      <div className="space-y-3">
        {filtered.map((s) => (
          <div key={s._id} className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {s.coverImage && <img src={s.coverImage} alt="" className="w-12 h-9 object-cover rounded shrink-0" />}
              <div className="min-w-0">
                <h4 className="text-sm font-semibold truncate">{s.title}</h4>
                <p className="text-xs text-white/40">{s.slug} &middot; {s.published ? "Published" : "Draft"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(s)} className="p-2 hover:bg-white/10 rounded transition"><FiEdit2 size={14} /></button>
              <button onClick={() => handleDelete(s._id)} className="p-2 hover:bg-red-500/20 rounded transition text-red-400"><FiTrash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
