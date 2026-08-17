'use client';

import { useEffect, useRef, useState } from 'react';

type EventStatus = 'upcoming' | 'past';

interface ClubEvent {
  id: number; title: string; date: string; type: string; desc: string;
  status: EventStatus; color: string; icon: string; venue: string; highlights?: string[];
}

const events: ClubEvent[] = [
  {
    id: 1,
    title: "Teachers Day Celebration",
    date: 'September 5, 2025',
    type: 'Cultural Event',
    desc: "A heartfelt tribute to our beloved teachers — celebrating their dedication, love, and guidance with performances, skits, and special moments of appreciation.",
    status: 'upcoming',
    color: '#c0392b',
    icon: '🎓',
    venue: 'College Auditorium',
    highlights: ['Cultural Performances', 'Skit', 'Gratitude Ceremony', 'Surprise Acts'],
  },
  {
    id: 2,
    title: "Dussehra Celebration",
    date: 'October 2024',
    type: 'Festival Celebration',
    desc: "Tarang celebrated Dussehra with a unique blend of cultural celebration and social awareness — including a powerful street play on cybersecurity.",
    status: 'past',
    color: '#7d3c98',
    icon: '🎉',
    venue: 'College Campus',
    highlights: ['Street Play', 'Cultural Dance', 'Cybersecurity Awareness'],
  },
  {
    id: 3,
    title: "Children's Day Celebration",
    date: 'November 2023',
    type: 'Cultural Event',
    desc: "Bringing out the inner child in everyone — with joyful performances, games, and activities that celebrated the spirit of innocence and creativity.",
    status: 'past',
    color: '#1abc9c',
    icon: '🎈',
    venue: 'Department Hall',
    highlights: ['Fun Activities', 'Cultural Shows', 'Games'],
  },
  {
    id: 4,
    title: "Engineers Day Celebration",
    date: 'September 2024',
    type: 'Cultural Event',
    desc: "Honoring the spirit of engineering through cultural performances and creative showcases dedicated to the great engineers who shaped our nation.",
    status: 'past',
    color: '#e67e22',
    icon: '⚙️',
    venue: 'College Auditorium',
    highlights: ['Cultural Acts', 'Tribute Show', 'Performances'],
  },
  {
    id: 5,
    title: "Science Day Celebration",
    date: 'February 2024',
    type: 'Cultural Event',
    desc: "National Science Day was celebrated with cultural flair — showcasing the beauty of science through art, drama, and creative expression.",
    status: 'past',
    color: '#1abc9c',
    icon: '🔬',
    venue: 'Department Courtyard',
    highlights: ['Science-themed Drama', 'Art Display', 'Cultural Performances'],
  },
  {
    id: 6,
    title: "Teachers Day Celebration",
    date: 'September 2023',
    type: 'Cultural Event',
    desc: "Tarang's very first Teachers Day celebration — a heartfelt tribute blending gratitude with creativity as students and faculty came together in joy and cultural expressions.",
    status: 'past',
    color: '#c0392b',
    icon: '🌹',
    venue: 'Department Hall',
    highlights: ['First Edition', 'Cultural Performances', 'Faculty Appreciation'],
  },
];

export default function EventsSection() {
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
  }, [filter]);

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(ev => (
            <div
              key={ev.id}
              className="event-card glass-card rounded-2xl overflow-hidden group"
              style={{ opacity: 0, borderColor: ev.color + '25' }}
            >
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ev.color}, transparent)` }} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: ev.color + '20', border: `1px solid ${ev.color}40` }}
                  >
                    {ev.icon}
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: ev.color + '20', color: ev.color }}>
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
                {ev.highlights && (
                  <div className="flex flex-wrap gap-2">
                    {ev.highlights.map(h => (
                      <span key={h} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/8">{h}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
