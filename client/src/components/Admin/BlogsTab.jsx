import { useEffect, useState } from "react";
import { fetchJson } from "../../api/http";
import { FiEdit2, FiTrash2, FiUpload, FiSearch } from "react-icons/fi";
import RichEditor from "./RichEditor";

export default function BlogsTab() {
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", author: "", category: "thought-leadership", tags: "", coverImage: "", published: true, featured: false });
  const [uploading, setUploading] = useState(false);

  const load = () => fetchJson("/api/blogs/admin").then((d) => setBlogs(Array.isArray(d) ? d : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ title: "", slug: "", excerpt: "", content: "", author: "", category: "thought-leadership", tags: "", coverImage: "", published: true, featured: false }); setEditing(null); };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  const autoSlug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSave = async () => {
    try {
      const payload = { ...form, slug: form.slug || autoSlug(form.title), tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
      if (editing) {
        await fetchJson(`/api/blogs/admin/${editing}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await fetchJson("/api/blogs/admin", { method: "POST", body: JSON.stringify(payload) });
      }
      resetForm(); load();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (b) => {
    setEditing(b._id);
    setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt || "", content: b.content || "", author: b.author || "", category: b.category || "thought-leadership", tags: (b.tags || []).join(", "), coverImage: b.coverImage || "", published: b.published, featured: b.featured });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this article?")) return;
    await fetchJson(`/api/blogs/admin/${id}`, { method: "DELETE" }).catch(() => {});
    load();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file);
      const data = await fetchJson("/api/blogs/admin/upload", { method: "POST", body: fd });
      setForm((p) => ({ ...p, coverImage: data.url }));
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.toLowerCase().includes(search.toLowerCase()) ||
    (b.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Article" : "Add New Article"}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold mb-1 text-white/80">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className="input-dark" placeholder="Article title" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-white/80">Slug</label>
          <input name="slug" value={form.slug} onChange={handleChange} className="input-dark" placeholder="auto-generated" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-white/80">Author</label>
          <input name="author" value={form.author} onChange={handleChange} className="input-dark" placeholder="Author name" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-white/80">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-dark">
            {["thought-leadership", "lifestyle", "business", "philanthropy", "news", "travel", "events", "personal", "other"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1 text-white/80">Excerpt</label>
          <input name="excerpt" value={form.excerpt} onChange={handleChange} className="input-dark" placeholder="Brief summary" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1 text-white/80">Content</label>
          <RichEditor value={form.content} onChange={(val) => setForm((p) => ({ ...p, content: val }))} placeholder="Article content..." />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-white/80">Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} className="input-dark" placeholder="leadership, africa, business" />
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
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-white/80">
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4" /> Published
          </label>
          <label className="flex items-center gap-2 text-xs text-white/80">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4" /> Featured
          </label>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <button onClick={handleSave} className="btn">{editing ? "Update Article" : "Add Article"}</button>
        {editing && <button onClick={resetForm} className="btn-outline text-white border-white/20">Cancel</button>}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <FiSearch size={14} className="text-white/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-dark max-w-xs" placeholder="Search articles..." />
      </div>

      <h3 className="text-sm font-semibold mb-3 text-white/70">All Articles ({filtered.length})</h3>
      <div className="space-y-3">
        {filtered.map((b) => (
          <div key={b._id} className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {b.coverImage && <img src={b.coverImage} alt="" className="w-12 h-9 object-cover rounded shrink-0" />}
              <div className="min-w-0">
                <h4 className="text-sm font-semibold truncate">{b.title}</h4>
                <p className="text-xs text-white/40">{b.category} &middot; {b.published ? "Published" : "Draft"}{b.featured ? " &middot; Featured" : ""}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(b)} className="p-2 hover:bg-white/10 rounded"><FiEdit2 size={14} /></button>
              <button onClick={() => handleDelete(b._id)} className="p-2 hover:bg-red-500/20 rounded text-red-400"><FiTrash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
