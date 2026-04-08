import { useEffect, useState } from "react";
import { fetchJson } from "../../api/http";
import { FiMail, FiCheck, FiTrash2, FiUsers } from "react-icons/fi";

export default function ContactsTab() {
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [view, setView] = useState("messages");

  const loadContacts = () => fetchJson("/api/contact/admin").then(setContacts).catch(() => {});
  const loadSubscribers = () => fetchJson("/api/contact/admin/subscribers").then(setSubscribers).catch(() => {});

  useEffect(() => { loadContacts(); loadSubscribers(); }, []);

  const markRead = async (id) => {
    await fetchJson(`/api/contact/admin/${id}/read`, { method: "PUT" }).catch(() => {});
    loadContacts();
  };

  const deleteContact = async (id) => {
    if (!confirm("Delete this message?")) return;
    await fetchJson(`/api/contact/admin/${id}`, { method: "DELETE" }).catch(() => {});
    loadContacts();
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setView("messages")} className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${view === "messages" ? "bg-[#C9A96E] text-[#050A15]" : "bg-white/5 text-white/60"}`}>
          <FiMail size={14} /> Messages ({contacts.length})
        </button>
        <button onClick={() => setView("subscribers")} className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${view === "subscribers" ? "bg-[#C9A96E] text-[#050A15]" : "bg-white/5 text-white/60"}`}>
          <FiUsers size={14} /> Subscribers ({subscribers.length})
        </button>
      </div>

      {view === "messages" && (
        <div className="space-y-3">
          {contacts.length === 0 && <p className="text-white/50 text-sm">No messages yet.</p>}
          {contacts.map((c) => (
            <div key={c._id} className={`rounded-lg border p-4 ${c.read ? "border-white/5 bg-white/[0.01]" : "border-[#C9A96E]/20 bg-[#C9A96E]/[0.03]"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold">{c.name}</h4>
                    {!c.read && <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                  </div>
                  <p className="text-xs text-white/40 mb-1">{c.email} {c.subject && `• ${c.subject}`}</p>
                  <p className="text-sm text-white/70">{c.message}</p>
                  <p className="text-[10px] text-white/30 mt-2">{new Date(c.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-1">
                  {!c.read && (
                    <button onClick={() => markRead(c._id)} className="p-2 hover:bg-white/10 rounded" title="Mark read">
                      <FiCheck size={14} className="text-green-400" />
                    </button>
                  )}
                  <button onClick={() => deleteContact(c._id)} className="p-2 hover:bg-red-500/20 rounded text-red-400" title="Delete">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "subscribers" && (
        <div className="space-y-2">
          {subscribers.length === 0 && <p className="text-white/50 text-sm">No subscribers yet.</p>}
          {subscribers.map((s) => (
            <div key={s._id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div>
                <p className="text-sm">{s.email}</p>
                <p className="text-[10px] text-white/30">{new Date(s.createdAt).toLocaleDateString()} • {s.active ? "Active" : "Inactive"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
