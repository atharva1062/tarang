'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

/* ─── Types ─── */
interface TeamMember {
  id: string; position: string; name: string; photo: string; quote: string;
}
interface GalleryItem {
  id: string; src: string; alt: string; category: string; event: string; caption: string;
}

const CATEGORIES = ['General', 'Teachers Day', "Children's Day", 'Engineers Day', 'Science Day', 'Dussehra', 'Ganesh Utsav', 'Other'];

/* ─── Utility ─── */
function cls(...c: (string | false | undefined)[]) { return c.filter(Boolean).join(' '); }

/* ──────────────────────────────────────────────────────────────────────────── */
/* Login Screen                                                                 */
/* ──────────────────────────────────────────────────────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw]   = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    const data = await res.json();
    setLoading(false);
    if (data.success) onLogin();
    else setErr('Incorrect password. Try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(8,6,14)' }}>
      <div className="w-full max-w-sm mx-4">
        {/* Logo + title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-2 ring-red-600/50 mb-4">
            <Image src="/logo.png" alt="Tarang" width={80} height={80} className="object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white">Tarang Admin</h1>
          <p className="text-white/40 text-sm mt-1">Cultural Club — DIT Pimpri</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">Admin Password</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-600/50 transition-all"
              required
            />
          </div>
          {err && <p className="text-red-400 text-sm">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#c0392b,#7d3c98)' }}
          >
            {loading ? 'Verifying…' : 'Login to Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* BOD Panel                                                                    */
/* ──────────────────────────────────────────────────────────────────────────── */
function BODPanel({ team, onRefresh }: { team: TeamMember[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm]       = useState<Partial<TeamMember>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = (m: TeamMember) => { setEditing(m.id); setForm({ name: m.name, quote: m.quote }); };

  const handleSave = async (id: string) => {
    setSaving(true);
    await fetch('/api/team', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...form }) });
    setSaving(false); setEditing(null); onRefresh();
  };

  const handlePhotoUpload = async (id: string, file: File) => {
    setUploading(true);
    const fd = new FormData(); fd.append('file', file); fd.append('memberId', id);
    await fetch('/api/team/upload', { method: 'POST', body: fd });
    setUploading(false); onRefresh();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Board of Directors</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map(m => (
          <div key={m.id} className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'rgba(20,12,40,0.8)', border: '1px solid rgba(192,57,43,0.2)' }}>
            {/* Photo */}
            <div className="flex items-center gap-4">
              <div
                className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 cursor-pointer ring-2 ring-white/10 hover:ring-red-600/50 transition-all"
                onClick={() => { setEditing(m.id); fileRef.current?.click(); (fileRef.current as any)._target = m.id; }}
              >
                {m.photo ? (
                  <Image src={m.photo} alt={m.name || m.position} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1" style={{ background: 'rgba(192,57,43,0.12)' }}>
                    <span className="text-2xl">👤</span>
                    <span className="text-[9px] text-white/40 text-center">Click to<br/>upload</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                  <span className="text-white text-xs font-medium">📷</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#e67e22' }}>{m.position}</p>
                <p className="text-white font-semibold">{m.name || <span className="text-white/30 italic text-sm">Name not set</span>}</p>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file && editing) handlePhotoUpload(editing, file);
                e.target.value = '';
              }}
            />

            {/* Edit form */}
            {editing === m.id ? (
              <div className="space-y-2.5">
                <input
                  value={form.name || ''}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Full name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600/50"
                />
                <input
                  value={form.quote || ''}
                  onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                  placeholder="Short quote (optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600/50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(m.id)}
                    disabled={saving}
                    className="flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60"
                    style={{ background: '#c0392b' }}
                  >
                    {saving ? 'Saving…' : '✓ Save'}
                  </button>
                  <button onClick={() => setEditing(null)} className="flex-1 py-2 rounded-lg text-white/60 text-sm border border-white/10 hover:border-white/30">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => startEdit(m)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-white/70 border border-white/10 hover:border-white/30 hover:text-white transition-all"
                >
                  ✏️ Edit Details
                </button>
                <button
                  onClick={() => { setEditing(m.id); setTimeout(() => fileRef.current?.click(), 100); }}
                  className="py-2 px-3 rounded-lg text-sm border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all"
                  title="Upload photo"
                >
                  📷
                </button>
              </div>
            )}
            {uploading && editing === m.id && (
              <p className="text-xs text-yellow-400 text-center animate-pulse">Uploading photo…</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Gallery Panel                                                                */
/* ──────────────────────────────────────────────────────────────────────────── */
function GalleryPanel({ gallery, onRefresh }: { gallery: GalleryItem[]; onRefresh: () => void }) {
  const [caption,  setCaption]  = useState('');
  const [category, setCategory] = useState('General');
  const [event,    setEvent]    = useState('');
  const [files,    setFiles]    = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [preview,   setPreview]   = useState<string[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFiles = (newFiles: File[]) => {
    const imgs = newFiles.filter(f => f.type.startsWith('image/'));
    setFiles(imgs);
    setPreview(imgs.map(f => URL.createObjectURL(f)));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    fd.append('caption',  caption);
    fd.append('category', category);
    fd.append('event',    event);
    await fetch('/api/gallery/upload', { method: 'POST', body: fd });
    setUploading(false);
    setFiles([]); setPreview([]); setCaption(''); setEvent('');
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo?')) return;
    setDeleting(id);
    await fetch('/api/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setDeleting(null); onRefresh();
  };

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-600/50 transition-all';

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-white">Gallery Management</h2>

      {/* Upload zone */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(20,12,40,0.8)', border: '1px solid rgba(192,57,43,0.2)' }}>
        <h3 className="text-white font-semibold">Upload Photos</h3>

        {/* Drop zone */}
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => document.getElementById('gallery-file-input')?.click()}
          className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all hover:border-red-600/50"
          style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
        >
          <p className="text-4xl mb-2">🖼️</p>
          <p className="text-white/60 text-sm">Drag & drop photos here, or <span className="text-red-400">click to browse</span></p>
          <p className="text-white/30 text-xs mt-1">Multiple files supported • JPG, PNG, WEBP</p>
          <input
            id="gallery-file-input"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={e => handleFiles(Array.from(e.target.files || []))}
          />
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {preview.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              </div>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-white/50 text-xs mb-1 block">Caption</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Teachers Day 2024" className={inputCls} />
          </div>
          <div>
            <label className="text-white/50 text-xs mb-1 block">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls + ' cursor-pointer'}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-white/50 text-xs mb-1 block">Event Name (optional)</label>
            <input value={event} onChange={e => setEvent(e.target.value)} placeholder="e.g. Tarang Fest 2.0" className={inputCls} />
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={!files.length || uploading}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40 transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#c0392b,#7d3c98)' }}
        >
          {uploading ? `Uploading ${files.length} photo${files.length > 1 ? 's' : ''}…` : `Upload ${files.length || ''} Photo${files.length !== 1 ? 's' : ''}`}
        </button>
      </div>

      {/* Existing photos */}
      <div>
        <h3 className="text-white font-semibold mb-4">Current Gallery ({gallery.length} photos)</h3>
        {gallery.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
            <p className="text-4xl mb-2">📷</p>
            <p className="text-white/40">No photos yet. Upload your first photo above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.map(g => (
              <div key={g.id} className="relative group rounded-xl overflow-hidden aspect-square">
                <Image src={g.src} alt={g.alt} fill className="object-cover" sizes="200px" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(g.id)}
                      disabled={deleting === g.id}
                      className="w-8 h-8 rounded-full bg-red-600/80 flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
                    >
                      {deleting === g.id ? '…' : '✕'}
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white/80">{g.category}</span>
                    {g.caption && <p className="text-white text-xs mt-1 truncate">{g.caption}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Main Admin Page                                                              */
/* ──────────────────────────────────────────────────────────────────────────── */
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [tab, setTab]     = useState<'bod' | 'gallery'>('bod');
  const [team,    setTeam]    = useState<TeamMember[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  /* Check auth on mount */
  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(d => setAuthenticated(d.authenticated));
  }, []);

  const fetchData = async () => {
    const [t, g] = await Promise.all([
      fetch('/api/team').then(r => r.json()),
      fetch('/api/gallery').then(r => r.json()),
    ]);
    setTeam(t); setGallery(g);
  };

  useEffect(() => { if (authenticated) fetchData(); }, [authenticated]);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(8,6,14)' }}>
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) return <LoginScreen onLogin={() => setAuthenticated(true)} />;

  return (
    <div className="min-h-screen" style={{ background: 'rgb(8,6,14)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(8,6,14,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-red-600/40">
            <Image src="/logo.png" alt="Tarang" width={32} height={32} className="object-cover" />
          </div>
          <div>
            <p className="text-white text-sm font-bold">Tarang Admin</p>
            <p className="text-white/30 text-[10px]">Cultural Club — DIT Pimpri</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-white/50 hover:text-white text-xs transition-colors">↗ View Site</a>
          <button onClick={handleLogout} className="text-xs px-3 py-1.5 rounded-lg text-white/60 border border-white/10 hover:text-white hover:border-white/30 transition-all">
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 pt-6 pb-2 flex gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {([['bod', '👑 Board of Directors'], ['gallery', '🖼️ Gallery']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cls(
              'px-5 py-2.5 rounded-full text-sm font-medium transition-all',
              tab === id
                ? 'text-white'
                : 'text-white/50 hover:text-white'
            )}
            style={tab === id ? { background: 'linear-gradient(135deg,#c0392b,#7d3c98)' } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {tab === 'bod'     && <BODPanel     team={team}    onRefresh={fetchData} />}
        {tab === 'gallery' && <GalleryPanel gallery={gallery} onRefresh={fetchData} />}
      </main>
    </div>
  );
}
