'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryItem {
  id: string; src: string; alt: string; category: string; event: string; caption: string;
}

const CATEGORIES = ['All', 'General', 'Teachers Day', "Children's Day", 'Engineers Day', 'Science Day', 'Dussehra', 'Ganesh Utsav', 'Other'];

export default function GallerySection() {
  const [gallery,  setGallery]  = useState<GalleryItem[]>([]);
  const [filter,   setFilter]   = useState('All');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => { setGallery(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const filtered = filter === 'All' ? gallery : gallery.filter(g => g.category === filter);
  const usedCats = ['All', ...Array.from(new Set(gallery.map(g => g.category)))];

  return (
    <section id="gallery" className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(230,126,34,0.05) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-cultural-orange text-sm font-semibold tracking-widest uppercase mb-3">Memories</p>
          <h2 className="section-title text-white">
            Our <span className="gradient-text">Gallery</span>
          </h2>
          <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-cultural-orange to-cultural-red" />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-cultural-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : gallery.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24 rounded-3xl" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
            <p className="text-6xl mb-4">📷</p>
            <h3 className="text-xl font-semibold text-white mb-2">Gallery Coming Soon</h3>
            <p className="text-white/40 text-sm max-w-xs mx-auto">
              Our photos will appear here once uploaded by the admin.
            </p>
          </div>
        ) : (
          <>
            {/* Category filter — only show categories that have photos */}
            <div className="flex flex-wrap justify-center gap-2.5 mb-10">
              {usedCats.map(cat => (
                <button
                  key={cat}
                  id={`gallery-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filter === cat
                      ? 'text-white shadow-lg shadow-cultural-orange/20'
                      : 'text-white/60 hover:text-white'
                  }`}
                  style={filter === cat
                    ? { background: 'linear-gradient(135deg, #e67e22, #c0392b)' }
                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Masonry grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[180px]">
              {filtered.map((item, i) => {
                const isLarge = i % 7 === 0;
                return (
                  <div
                    key={item.id}
                    className={`relative overflow-hidden rounded-xl cursor-pointer group ${isLarge ? 'col-span-2 row-span-2' : ''}`}
                    onClick={() => setLightbox(item)}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      {item.category && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full mb-1 self-start bg-cultural-red/80 text-white">
                          {item.category}
                        </span>
                      )}
                      {item.caption && <p className="text-white text-sm font-medium">{item.caption}</p>}
                      {item.event   && <p className="text-white/60 text-xs">{item.event}</p>}
                    </div>
                    {/* Expand icon */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(12px)' }}
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={1200} height={800}
              className="object-contain w-full"
              style={{ maxHeight: '80vh' }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              {lightbox.caption  && <p className="text-white text-sm font-medium">{lightbox.caption}</p>}
              {lightbox.category && <p className="text-white/60 text-xs">{lightbox.category}{lightbox.event ? ` • ${lightbox.event}` : ''}</p>}
            </div>
            <button
              id="lightbox-close"
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              onClick={() => setLightbox(null)}
              aria-label="Close lightbox"
            >✕</button>
          </div>
        </div>
      )}
    </section>
  );
}
