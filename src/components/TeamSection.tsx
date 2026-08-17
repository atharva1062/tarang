'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TeamMember {
  id: string; position: string; name: string; photo: string; quote: string;
}

const POSITION_ICONS: Record<string, string> = {
  'president':        '👑',
  'event-management': '🎉',
  'cultural':         '🎭',
  'technical':        '⚙️',
  'design':           '🎨',
  'media':            '📸',
};

const POSITION_COLORS: Record<string, string> = {
  'president':        '#c0392b',
  'event-management': '#e67e22',
  'cultural':         '#7d3c98',
  'technical':        '#1abc9c',
  'design':           '#e67e22',
  'media':            '#c0392b',
};

export default function TeamSection({ initialTeam }: { initialTeam: TeamMember[] }) {
  const [team] = useState<TeamMember[]>(initialTeam);

  return (
    <section id="team" className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(125,60,152,0.06) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto section-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-cultural-purple text-sm font-semibold tracking-widest uppercase mb-3">Our Leadership</p>
          <h2 className="section-title text-white">
            Board of <span className="gradient-text">Directors</span>
          </h2>
          <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-cultural-purple to-cultural-teal" />
          <p className="mt-5 text-white/50 text-base max-w-xl mx-auto">
            Selected through an interview process — the passionate team leading Tarang Cultural Club.
          </p>
        </div>

        {team.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/40">No team members added yet.</p>
          </div>
        ) : (
          <>
            {/* President — full width highlight */}
            {team.filter(m => m.id === 'president').map(m => (
              <div
                key={m.id}
                className="mb-8 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(192,57,43,0.12), rgba(125,60,152,0.08))', border: '1px solid rgba(192,57,43,0.3)' }}
              >
                {/* glow */}
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-20 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, #c0392b, transparent)', filter: 'blur(40px)' }} aria-hidden="true" />

                {/* Photo */}
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4" style={{ ringColor: 'rgba(192,57,43,0.5)', border: '3px solid rgba(192,57,43,0.5)' }}>
                    {m.photo ? (
                      <Image src={m.photo} alt={m.name || 'President'} fill className="object-cover" sizes="144px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: 'rgba(192,57,43,0.15)' }}>👑</div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: '#c0392b' }}>👑</div>
                </div>

                {/* Info */}
                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block" style={{ background: 'rgba(192,57,43,0.2)', color: '#c0392b' }}>President</span>
                  <h3 className="text-2xl font-bold text-white mt-2">
                    {m.name || <span className="text-white/30 italic text-xl">Name to be added</span>}
                  </h3>
                  {m.quote && <p className="text-white/60 italic mt-2 text-sm">&ldquo;{m.quote}&rdquo;</p>}
                </div>
              </div>
            ))}

            {/* Other 5 heads */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {team.filter(m => m.id !== 'president').map(m => {
                const color = POSITION_COLORS[m.id] || '#c0392b';
                const icon  = POSITION_ICONS[m.id]  || '⭐';
                return (
                  <div
                    key={m.id}
                    className="glass-card rounded-2xl p-6 group flex flex-col items-center text-center gap-4"
                    style={{ borderColor: color + '25' }}
                  >
                    {/* Photo */}
                    <div
                      className="w-24 h-24 rounded-full overflow-hidden ring-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                      style={{ border: `2px solid ${color}50` }}
                    >
                      {m.photo ? (
                        <Image src={m.photo} alt={m.name || m.position} width={96} height={96} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: color + '15' }}>{icon}</div>
                      )}
                    </div>

                    {/* Badge */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: color + '20', color }}>
                        {m.position}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2">
                        {m.name || <span className="text-white/30 italic text-sm">Name to be added</span>}
                      </h3>
                      {m.quote && <p className="text-white/50 text-sm italic mt-1.5">&ldquo;{m.quote}&rdquo;</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
