import { useEffect, useState } from "react";
import { fetchJson } from "../../api/http";
import { FiEdit2, FiTrash2, FiUpload } from "react-icons/fi";

export default function BooksTab() {
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", author: "", description: "", coverImage: "", purchaseLink: "", published: true, order: 0 });
  const [uploading, setUploading] = useState(false);

  const load = () => fetchJson("/api/books/admin").then(setBooks).catch(() => {});
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ title: "", author: "", description: "", coverImage: "", purchaseLink: "", published: true, order: 0 }); setEditing(null); };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : name === "order" ? Number(value) : value }));
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await fetchJson(`/api/books/admin/${editing}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await fetchJson("/api/books/admin", { method: "POST", body: JSON.stringify(form) });
      }
      resetForm(); load();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (b) => {
    setEditing(b._id);
    setForm({ title: b.title, author: b.author || "", description: b.description || "", coverImage: b.coverImage || "", purchaseLink: b.purchaseLink || "", published: b.published, order: b.order || 0 });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this book?")) return;
    await fetchJson(`/api/books/admin/${id}`, { method: "DELETE" }).catch(() => {});
    load();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file);
      const data = await fetchJson("/api/books/admin/upload", { method: "POST", body: fd });
      setForm((p) => ({ ...p, coverImage: data.url }));
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Book" : "Add Book to Library"}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold mb-1">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className="input-dark" placeholder="Book title" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Author</label>
          <input name="author" value={form.author} onChange={handleChange} className="input-dark" placeholder="Author name" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1">Description / Summary</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-dark resize-y" placeholder="Brief book description for the popup..." />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Cover Image</label>
          <div className="flex gap-2">
            <input name="coverImage" value={form.coverImage} onChange={handleChange} className="input-dark flex-1" placeholder="Cover URL or upload" />
            <label className="btn btn-sm cursor-pointer flex items-center gap-1">
              <FiUpload size={12} /> {uploading ? "..." : "Upload"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Purchase Link</label>
          <input name="purchaseLink" value={form.purchaseLink} onChange={handleChange} className="input-dark" placeholder="https://amazon.com/..." />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Sort Order</label>
          <input name="order" type="number" value={form.order} onChange={handleChange} className="input-dark w-24" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4" />
          <label className="text-xs">Published</label>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <button onClick={handleSave} className="btn">{editing ? "Update Book" : "Add Book"}</button>
        {editing && <button onClick={resetForm} className="btn-outline">Cancel</button>}
      </div>

      <h3 className="text-sm font-semibold mb-3 text-white/70">Library ({books.length} books)</h3>
      <div className="space-y-3">
        {books.map((b) => (
          <div key={b._id} className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {b.coverImage && (
                <img src={b.coverImage} alt="" className="w-10 h-14 object-cover rounded shrink-0" />
              )}
              <div className="min-w-0">
                <h4 className="text-sm font-semibold truncate">{b.title}</h4>
                <p className="text-xs text-white/40">{b.author} &middot; Order: {b.order}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(b)} className="p-2 hover:bg-white/10 rounded"><FiEdit2 size={14} /></button>
              <button onClick={() => handleDelete(b._id)} className="p-2 hover:bg-red-500/20 rounded text-red-400"><FiTrash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
