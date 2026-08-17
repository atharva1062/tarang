'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

/* ─── Interfaces ─── */
interface TeamMember {
  id: string; position: string; name: string; photo: string; quote: string;
}
interface GalleryItem {
  id: string; src: string; alt: string; category: string; event: string; caption: string;
}
interface Milestone {
  id: string; year: string; title: string; desc: string; color: string; icon: string;
}
interface EventItem {
  id: number; title: string; date: string; type: string; desc: string;
  status: 'upcoming' | 'past'; color: string; icon: string; venue: string; highlights: string[];
}

const CATEGORIES = ['General', 'Teachers Day', "Children's Day", 'Engineers Day', 'Science Day', 'Dussehra', 'Ganesh Utsav', 'Other'];

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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-2 ring-red-600/50 mb-4">
            <Image src="/logo.png" alt="Tarang" width={80} height={80} className="object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white">Tarang Admin Portal</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage all website content dynamically</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-zinc-400 text-xs mb-1.5 block">Admin Password</label>
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
            {loading ? 'Verifying…' : 'Enter Dashboard'}
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
      <h2 className="text-xl font-bold text-white mb-6">Board of Directors (6 roles)</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map(m => (
          <div key={m.id} className="rounded-2xl p-5 flex flex-col gap-4 bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-4">
              <div
                className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 cursor-pointer ring-2 ring-white/10 hover:ring-red-600/50 transition-all"
                onClick={() => { setEditing(m.id); fileRef.current?.click(); }}
              >
                {m.photo ? (
                  <Image src={m.photo} alt={m.name || m.position} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-red-600/10 text-red-500">
                    <span className="text-2xl">👤</span>
                    <span className="text-[9px] text-zinc-400 text-center">Upload</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                  <span className="text-white text-xs">📷</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-orange-500">{m.position}</p>
                <p className="text-white font-semibold">{m.name || <span className="text-zinc-500 italic text-sm">Not set</span>}</p>
              </div>
            </div>

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
                    className="flex-1 py-2 rounded-lg text-white text-sm font-medium bg-red-600 disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : '✓ Save'}
                  </button>
                  <button onClick={() => setEditing(null)} className="flex-1 py-2 rounded-lg text-zinc-400 text-sm border border-white/10 hover:border-white/30">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => startEdit(m)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-zinc-400 border border-white/10 hover:border-white hover:text-white transition-all"
                >
                  ✏️ Edit Details
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

      <div className="rounded-2xl p-6 bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-white font-semibold">Upload Photos</h3>
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => document.getElementById('gallery-file-input')?.click()}
          className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all hover:border-red-600/50 border-zinc-800 bg-white/5"
        >
          <p className="text-4xl mb-2">🖼️</p>
          <p className="text-zinc-400 text-sm">Drag & drop photos here, or <span className="text-red-500">click to browse</span></p>
          <p className="text-zinc-600 text-xs mt-1">JPG, PNG, WEBP</p>
          <input id="gallery-file-input" type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(Array.from(e.target.files || []))} />
        </div>

        {preview.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {preview.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              </div>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-zinc-400 text-xs mb-1 block">Caption</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Teachers Day" className={inputCls} />
          </div>
          <div>
            <label className="text-zinc-400 text-xs mb-1 block">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls + ' cursor-pointer'}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-zinc-400 text-xs mb-1 block">Event Name (optional)</label>
            <input value={event} onChange={e => setEvent(e.target.value)} placeholder="e.g. Teachers Day Celebration" className={inputCls} />
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={!files.length || uploading}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40 transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#c0392b,#7d3c98)' }}
        >
          {uploading ? `Uploading…` : `Upload ${files.length || ''} Photo${files.length !== 1 ? 's' : ''}`}
        </button>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Current Gallery ({gallery.length} photos)</h3>
        {gallery.length === 0 ? (
          <div className="rounded-2xl p-12 text-center border border-dashed border-zinc-800">
            <p className="text-zinc-500">No photos uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.map(g => (
              <div key={g.id} className="relative group rounded-xl overflow-hidden aspect-square">
                <Image src={g.src} alt={g.alt} fill className="object-cover" sizes="200px" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end">
                    <button onClick={() => handleDelete(g.id)} disabled={deleting === g.id} className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">
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
/* Editable Text Configuration Panels                                           */
/* ──────────────────────────────────────────────────────────────────────────── */
function FormSection({ title, children, onSave, saving }: { title: string; children: React.ReactNode; onSave: () => void; saving: boolean }) {
  return (
    <div className="rounded-2xl p-6 bg-zinc-900 border border-zinc-800 space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2 rounded-xl text-white font-semibold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg,#c0392b,#7d3c98)' }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Main Admin Page Component                                                    */
/* ──────────────────────────────────────────────────────────────────────────── */
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [tab, setTab]     = useState<'bod' | 'gallery' | 'hero' | 'about' | 'journey' | 'events' | 'site'>('bod');

  // Dynamic content states
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [hero, setHero] = useState<any>({});
  const [about, setAbout] = useState<any>({});
  const [journey, setJourney] = useState<Milestone[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [site, setSite] = useState<any>({});

  const [saving, setSaving] = useState(false);

  // Journey & Event editing states
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({ year: '', title: '', desc: '', color: '#c0392b', icon: '📍' });
  const [newEvent, setNewEvent] = useState<Partial<EventItem>>({ title: '', date: '', type: 'Cultural Event', desc: '', status: 'upcoming', color: '#c0392b', icon: '📅', venue: '', highlights: [] });

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(d => setAuthenticated(d.authenticated));
  }, []);

  const fetchAllData = async () => {
    const [teamRes, galleryRes, contentRes] = await Promise.all([
      fetch('/api/team').then(r => r.json()),
      fetch('/api/gallery').then(r => r.json()),
      fetch('/api/content').then(r => r.json())
    ]);
    setTeam(teamRes);
    setGallery(galleryRes);
    setHero(contentRes.hero);
    setAbout(contentRes.about);
    setJourney(contentRes.journey);
    setEvents(contentRes.events);
    setSite(contentRes.site);
  };

  useEffect(() => { if (authenticated) fetchAllData(); }, [authenticated]);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthenticated(false);
  };

  const saveContent = async (type: string, data: any) => {
    setSaving(true);
    await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    });
    setSaving(false);
    fetchAllData();
  };

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600/50 transition-all';
  const labelCls = 'text-zinc-400 text-xs mb-1 block';

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) return <LoginScreen onLogin={() => setAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-red-600/40">
            <Image src="/logo.png" alt="Tarang" width={32} height={32} className="object-cover" />
          </div>
          <div>
            <p className="text-white text-sm font-bold">Tarang Admin Dashboard</p>
            <p className="text-zinc-500 text-[10px]">DIT Pimpri AI & DS Cultural Club</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-zinc-400 hover:text-white text-xs transition-colors">↗ View Website</a>
          <button onClick={handleLogout} className="text-xs px-3 py-1.5 rounded-lg text-zinc-400 border border-white/10 hover:text-white hover:border-white/30 transition-all">
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 py-4 flex flex-wrap gap-2 border-b border-zinc-850 bg-zinc-900/50">
        {[
          ['bod', '👑 BOD (Board)'],
          ['gallery', '🖼️ Gallery'],
          ['hero', '✨ Hero Section'],
          ['about', 'ℹ️ About Details'],
          ['journey', '⛵ Journey Timeline'],
          ['events', '📅 Events & Celebrations'],
          ['site', '📞 Contact & Socials']
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id as any)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              tab === id ? 'text-white bg-red-600' : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
        {tab === 'bod' && <BODPanel team={team} onRefresh={fetchAllData} />}
        {tab === 'gallery' && <GalleryPanel gallery={gallery} onRefresh={fetchAllData} />}

        {/* ─── Hero Section Tab ─── */}
        {tab === 'hero' && (
          <FormSection title="Hero Section Settings" saving={saving} onSave={() => saveContent('hero', hero)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>Badge Text</label>
                <input value={hero.badge || ''} onChange={e => setHero({ ...hero, badge: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Devanagari Title</label>
                <input value={hero.titleDevanagari || ''} onChange={e => setHero({ ...hero, titleDevanagari: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>English Sub-title</label>
                <input value={hero.titleEnglish || ''} onChange={e => setHero({ ...hero, titleEnglish: e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Hero Tagline</label>
                <textarea rows={3} value={hero.tagline || ''} onChange={e => setHero({ ...hero, tagline: e.target.value })} className={inputCls + ' resize-none'} />
              </div>
            </div>
          </FormSection>
        )}

        {/* ─── About Section Tab ─── */}
        {tab === 'about' && (
          <FormSection title="About Section Settings" saving={saving} onSave={() => saveContent('about', about)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Section Subtitle</label>
                <input value={about.subtitle || ''} onChange={e => setAbout({ ...about, subtitle: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Section Title</label>
                <input value={about.title || ''} onChange={e => setAbout({ ...about, title: e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Section Catchy Heading</label>
                <input value={about.heading || ''} onChange={e => setAbout({ ...about, heading: e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Description Paragraphs (Line breaks create new paragraphs)</label>
                <textarea
                  rows={4}
                  value={about.paragraphs ? about.paragraphs.join('\n\n') : ''}
                  onChange={e => setAbout({ ...about, paragraphs: e.target.value.split('\n\n').filter(Boolean) })}
                  className={inputCls + ' resize-none'}
                />
              </div>
              <div className="col-span-2 grid grid-cols-3 gap-2">
                <div>
                  <label className={labelCls}>Stat 1 Value</label>
                  <input value={about.stats?.[0]?.value || ''} onChange={e => {
                    const stats = [...(about.stats || [])]; stats[0] = { ...stats[0], value: e.target.value }; setAbout({ ...about, stats });
                  }} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Stat 2 Value</label>
                  <input value={about.stats?.[1]?.value || ''} onChange={e => {
                    const stats = [...(about.stats || [])]; stats[1] = { ...stats[1], value: e.target.value }; setAbout({ ...about, stats });
                  }} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Stat 3 Value</label>
                  <input value={about.stats?.[2]?.value || ''} onChange={e => {
                    const stats = [...(about.stats || [])]; stats[2] = { ...stats[2], value: e.target.value }; setAbout({ ...about, stats });
                  }} className={inputCls} />
                </div>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Inspirational Quote</label>
                <textarea rows={2} value={about.quote || ''} onChange={e => setAbout({ ...about, quote: e.target.value })} className={inputCls + ' resize-none'} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Quote Author</label>
                <input value={about.quoteAuthor || ''} onChange={e => setAbout({ ...about, quoteAuthor: e.target.value })} className={inputCls} />
              </div>

              {/* Pillars (Drama, Dance, Music, Art) */}
              <div className="col-span-2 border-t border-zinc-800 pt-6 mt-2">
                <h4 className="text-white font-semibold mb-4">Four Cultural Pillars</h4>
                <div className="space-y-4">
                  {(about.pillars || []).map((p: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-4 gap-2 bg-white/5 p-3 rounded-xl">
                      <div>
                        <label className={labelCls}>Icon</label>
                        <input value={p.icon || ''} onChange={e => {
                          const pillars = [...about.pillars]; pillars[idx] = { ...p, icon: e.target.value }; setAbout({ ...about, pillars });
                        }} className={inputCls} />
                      </div>
                      <div className="col-span-3">
                        <label className={labelCls}>Pillar Title</label>
                        <input value={p.title || ''} onChange={e => {
                          const pillars = [...about.pillars]; pillars[idx] = { ...p, title: e.target.value }; setAbout({ ...about, pillars });
                        }} className={inputCls} />
                      </div>
                      <div className="col-span-4 mt-2">
                        <label className={labelCls}>Pillar Description</label>
                        <input value={p.desc || ''} onChange={e => {
                          const pillars = [...about.pillars]; pillars[idx] = { ...p, desc: e.target.value }; setAbout({ ...about, pillars });
                        }} className={inputCls} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FormSection>
        )}

        {/* ─── Journey Tab ─── */}
        {tab === 'journey' && (
          <div className="space-y-6">
            <FormSection title="Add Milestone to Timeline" saving={saving} onSave={async () => {
              if (!newMilestone.year || !newMilestone.title) return alert('Enter year and title!');
              const item = { id: `j-${Date.now()}`, ...newMilestone };
              const updated = [...journey, item];
              await saveContent('journey', updated);
              setNewMilestone({ year: '', title: '', desc: '', color: '#c0392b', icon: '📍' });
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Year/Month</label>
                  <input value={newMilestone.year} onChange={e => setNewMilestone({ ...newMilestone, year: e.target.value })} placeholder="e.g. Aug 2023" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Milestone Title</label>
                  <input value={newMilestone.title} onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })} placeholder="e.g. Club Founded" className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea rows={2} value={newMilestone.desc} onChange={e => setNewMilestone({ ...newMilestone, desc: e.target.value })} placeholder="Tell the story..." className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Icon (Emoji)</label>
                  <input value={newMilestone.icon} onChange={e => setNewMilestone({ ...newMilestone, icon: e.target.value })} placeholder="e.g. 🌱" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Color Highlight (HEX)</label>
                  <input value={newMilestone.color} onChange={e => setNewMilestone({ ...newMilestone, color: e.target.value })} placeholder="#c0392b" className={inputCls} />
                </div>
              </div>
            </FormSection>

            {/* List and Delete Journey items */}
            <div className="rounded-2xl p-6 bg-zinc-900 border border-zinc-800">
              <h3 className="text-white font-semibold mb-4">Milestone History ({journey.length})</h3>
              <div className="space-y-3">
                {journey.map((m: any, idx: number) => (
                  <div key={m.id || idx} className="flex justify-between items-start bg-white/5 p-3 rounded-xl">
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white mr-2">{m.year}</span>
                      <strong className="text-white text-sm">{m.title}</strong>
                      <p className="text-zinc-400 text-xs mt-1 pr-6">{m.desc}</p>
                    </div>
                    <button onClick={async () => {
                      if (confirm('Delete this milestone?')) {
                        const updated = journey.filter(item => item.id !== m.id);
                        await saveContent('journey', updated);
                      }
                    }} className="text-xs text-red-500 hover:text-red-400">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Events Tab ─── */}
        {tab === 'events' && (
          <div className="space-y-6">
            <FormSection title="Create Event / Celebration" saving={saving} onSave={async () => {
              if (!newEvent.title || !newEvent.date) return alert('Enter event title and date!');
              const item = { id: Date.now(), ...newEvent };
              const updated = [...events, item];
              await saveContent('events', updated);
              setNewEvent({ title: '', date: '', type: 'Cultural Event', desc: '', status: 'upcoming', color: '#c0392b', icon: '📅', venue: '', highlights: [] });
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>Event Title</label>
                  <input value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="e.g. Teachers Day" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} placeholder="e.g. September 5, 2025" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Venue</label>
                  <input value={newEvent.venue} onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })} placeholder="e.g. Main Auditorium" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Type</label>
                  <input value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })} placeholder="e.g. Cultural Event" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select value={newEvent.status} onChange={e => setNewEvent({ ...newEvent, status: e.target.value as any })} className={inputCls}>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Highlights (comma separated)</label>
                  <input
                    value={newEvent.highlights ? newEvent.highlights.join(', ') : ''}
                    onChange={e => setNewEvent({ ...newEvent, highlights: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="e.g. Dance, Skit, Music"
                    className={inputCls}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea rows={3} value={newEvent.desc} onChange={e => setNewEvent({ ...newEvent, desc: e.target.value })} placeholder="Describe the celebration..." className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Icon (Emoji)</label>
                  <input value={newEvent.icon} onChange={e => setNewEvent({ ...newEvent, icon: e.target.value })} placeholder="e.g. 🎓" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Highlight Color (HEX)</label>
                  <input value={newEvent.color} onChange={e => setNewEvent({ ...newEvent, color: e.target.value })} placeholder="e.g. #c0392b" className={inputCls} />
                </div>
              </div>
            </FormSection>

            {/* List and Delete Events */}
            <div className="rounded-2xl p-6 bg-zinc-900 border border-zinc-800">
              <h3 className="text-white font-semibold mb-4">Event List ({events.length})</h3>
              <div className="space-y-3">
                {events.map((ev: any, idx: number) => (
                  <div key={ev.id || idx} className="flex justify-between items-start bg-white/5 p-3 rounded-xl">
                    <div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${ev.status === 'upcoming' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'} mr-2`}>
                        {ev.status}
                      </span>
                      <strong className="text-white text-sm">{ev.title}</strong>
                      <p className="text-zinc-400 text-xs mt-1 pr-6">{ev.desc}</p>
                    </div>
                    <button onClick={async () => {
                      if (confirm('Delete this event?')) {
                        const updated = events.filter(item => item.id !== ev.id);
                        await saveContent('events', updated);
                      }
                    }} className="text-xs text-red-500 hover:text-red-400">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Site Settings Tab ─── */}
        {tab === 'site' && (
          <FormSection title="Contact Details & Socials" saving={saving} onSave={() => saveContent('site', site)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Instagram Link</label>
                <input value={site.instagram || ''} onChange={e => setSite({ ...site, instagram: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>LinkedIn Link</label>
                <input value={site.linkedin || ''} onChange={e => setSite({ ...site, linkedin: e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Contact Email Address</label>
                <input value={site.email || ''} onChange={e => setSite({ ...site, email: e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2 grid grid-cols-3 gap-2 border-t border-zinc-800 pt-6 mt-2">
                <div className="col-span-3"><h4 className="text-white font-semibold text-sm mb-2">Address in Footer</h4></div>
                <div>
                  <label className={labelCls}>Department/Block</label>
                  <input value={site.addressDept || ''} onChange={e => setSite({ ...site, addressDept: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>College/Campus</label>
                  <input value={site.addressClg || ''} onChange={e => setSite({ ...site, addressClg: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Pin Code</label>
                  <input value={site.addressPin || ''} onChange={e => setSite({ ...site, addressPin: e.target.value })} className={inputCls} />
                </div>
              </div>

              {/* Motivations & Privacy arrays */}
              <div className="col-span-2 border-t border-zinc-800 pt-6 mt-2 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-semibold text-sm mb-4">Motivations (One per line)</h4>
                  <textarea
                    rows={4}
                    value={site.motivations ? site.motivations.join('\n') : ''}
                    onChange={e => setSite({ ...site, motivations: e.target.value.split('\n').filter(Boolean) })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-4">Privacy Policy Links (One per line)</h4>
                  <textarea
                    rows={4}
                    value={site.privacyPolicy ? site.privacyPolicy.join('\n') : ''}
                    onChange={e => setSite({ ...site, privacyPolicy: e.target.value.split('\n').filter(Boolean) })}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          </FormSection>
        )}
      </main>
    </div>
  );
}
