import { useEffect, useState } from "react";
import { fetchJson } from "../../api/http";
import { FiUpload, FiSave } from "react-icons/fi";
import RichEditor from "./RichEditor";

const sectionTypes = [
  { key: "hero", label: "Home Page Hero" },
  { key: "biography", label: "About — Biography" },
  { key: "business", label: "About — Project Management" },
  { key: "philanthropy", label: "About — Quantity Surveying" },
  { key: "vision", label: "About — Vision" },
  { key: "quote", label: "Home — Quote" },
  { key: "speeches_hero", label: "Speeches — Hero Image" },
  { key: "library_hero", label: "Library — Hero Image" },
  { key: "lifestyle_hero", label: "Lifestyle — Hero Image" },
  { key: "pm_hero", label: "Project Management — Hero Image" },
  { key: "qs_hero", label: "Quantity Surveying — Hero Image" },
];

export default function AboutTab() {
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState("hero");
  const [form, setForm] = useState({ section: "hero", title: "", subtitle: "", content: "", imageUrl: "", ctaText: "", ctaLink: "" });
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () => fetchJson("/api/about").then((d) => setSections(Array.isArray(d) ? d : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  useEffect(() => {
    const existing = sections.find((s) => s.section === activeSection);
    if (existing) {
      setForm({ section: existing.section, title: existing.title || "", subtitle: existing.subtitle || "", content: existing.content || "", imageUrl: existing.imageUrl || "", ctaText: existing.ctaText || "", ctaLink: existing.ctaLink || "" });
    } else {
      setForm({ section: activeSection, title: "", subtitle: "", content: "", imageUrl: "", ctaText: "", ctaLink: "" });
    }
  }, [activeSection, sections]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      await fetchJson("/api/about/admin", { method: "POST", body: JSON.stringify(form) });
      load(); setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (err) { alert(err.message); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file);
      const data = await fetchJson("/api/about/admin/upload", { method: "POST", body: fd });
      setForm((p) => ({ ...p, imageUrl: data.url }));
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  const isHeroSection = activeSection.endsWith("_hero");

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Page Sections & Hero Images</h2>

      {/* Section tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {sectionTypes.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSection === s.key ? "bg-[#C9A96E] text-[#050A15]" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Current section label */}
      <p className="text-xs text-[#C9A96E] mb-4 font-semibold">
        Editing: {sectionTypes.find((s) => s.key === activeSection)?.label}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {!isHeroSection && (
          <>
            <div>
              <label className="block text-xs font-semibold mb-1 text-white/80">Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="input-dark" placeholder="Section title" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-white/80">Subtitle</label>
              <input name="subtitle" value={form.subtitle} onChange={handleChange} className="input-dark" placeholder="Section subtitle" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 text-white/80">Content</label>
              <RichEditor value={form.content} onChange={(val) => setForm((p) => ({ ...p, content: val }))} placeholder="Write content here..." />
            </div>
          </>
        )}

        {/* Image upload — shown for ALL sections */}
        <div className={isHeroSection ? "sm:col-span-2" : ""}>
          <label className="block text-xs font-semibold mb-1 text-white/80">
            {isHeroSection ? "Hero Image *" : "Image"}
          </label>
          <div className="flex gap-2">
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="input-dark flex-1" placeholder="Image URL or upload" />
            <label className="btn btn-sm cursor-pointer flex items-center gap-1">
              <FiUpload size={12} /> {uploading ? "..." : "Upload"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Preview" className="mt-2 h-24 rounded object-cover" />
          )}
        </div>

        {!isHeroSection && (
          <>
            <div>
              <label className="block text-xs font-semibold mb-1 text-white/80">CTA Text</label>
              <input name="ctaText" value={form.ctaText} onChange={handleChange} className="input-dark" placeholder="Learn More" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-white/80">CTA Link</label>
              <input name="ctaLink" value={form.ctaLink} onChange={handleChange} className="input-dark" placeholder="/contact" />
            </div>
          </>
        )}
      </div>

      <button onClick={handleSave} className="btn flex items-center gap-2">
        <FiSave size={14} /> Save {sectionTypes.find((s) => s.key === activeSection)?.label}
      </button>
      {saved && <p className="mt-2 text-xs text-green-400">Saved successfully!</p>}
    </div>
  );
}
