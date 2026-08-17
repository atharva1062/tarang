'use client';

import { useEffect, useRef, useState } from 'react';

type EventStatus = 'upcoming' | 'past';

export default function EventsSection({ events }: { events: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | EventStatus>('all');

  const filtered = filter === 'all' ? events : events.filter(e => e.status === filter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.event-card').forEach((el, i) => {
              setTimeout(() => {
                el.classList.add('animate-fade-in-up');
                (el as HTMLElement).style.opacity = '1';
              }, i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [filter, events]);

  return (
    <section id="events" ref={ref} className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 0% 50%, rgba(192,57,43,0.05) 0%, transparent 60%),' +
            'radial-gradient(ellipse 60% 50% at 100% 50%, rgba(26,188,156,0.05) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-cultural-red text-sm font-semibold tracking-widest uppercase mb-3">What We Celebrate</p>
          <h2 className="section-title text-white">
            Events &amp; <span className="gradient-text">Celebrations</span>
          </h2>
          <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-cultural-red to-cultural-orange" />
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-3 mb-12">
          {(['all', 'upcoming', 'past'] as const).map(f => (
            <button
              key={f}
              id={`events-filter-${f}`}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                filter === f ? 'text-white shadow-lg shadow-cultural-red/20' : 'text-white/60 hover:text-white'
              }`}
              style={filter === f
                ? { background: 'linear-gradient(135deg, #c0392b, #7d3c98)' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {f === 'all' ? 'All Events' : f === 'upcoming' ? '🔮 Upcoming' : '📽️ Past Events'}
            </button>
          ))}
        </div>

        {/* Events grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/40">No events found in this category.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ev: any) => {
              const color = ev.color || '#c0392b';
              return (
                <div
                  key={ev.id}
                  className="event-card glass-card rounded-2xl overflow-hidden group"
                  style={{ opacity: 0, borderColor: color + '25' }}
                >
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: color + '20', border: `1px solid ${color}40` }}
                      >
                        {ev.icon || '📅'}
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: color + '20', color: color }}>
                          {ev.type}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${ev.status === 'upcoming' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                          {ev.status === 'upcoming' ? '● Upcoming' : 'Past'}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cultural-orange transition-colors">{ev.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                      <span>📅 {ev.date}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>📍 {ev.venue}</span>
                    </div>
                    <p className="text-white/55 text-sm leading-relaxed mb-4">{ev.desc}</p>
                    {ev.highlights && ev.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {ev.highlights.map((h: string) => (
                          <span key={h} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/8">{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
