'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const pillars = [
  { icon: '🎭', title: 'Drama & Theatre',   desc: 'Street plays, one-acts, and grand theatrical productions that bring stories to life.',          color: '#c0392b' },
  { icon: '💃', title: 'Dance & Movement',  desc: 'Classical, folk, and contemporary dance forms celebrated across every cultural event.',         color: '#7d3c98' },
  { icon: '🎶', title: 'Music & Singing',   desc: 'Vocal and instrumental performances honoring festivals, traditions, and cultural moments.',      color: '#e67e22' },
  { icon: '🎨', title: 'Visual Arts',       desc: 'Rangoli, posters, digital art, and creative installations for every occasion.',                 color: '#1abc9c' },
];

const motivations = [
  'Cultural Celebration',
  'Creative Expression',
  'Community Building',
  'Cultural Awareness & Education',
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              (el as HTMLElement).style.animationDelay = `${i * 0.12}s`;
              el.classList.add('animate-fade-in-up');
              (el as HTMLElement).style.opacity = '1';
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto section-padding">
        {/* Header */}
        <div className="text-center mb-20 reveal" style={{ opacity: 0 }}>
          <p className="text-cultural-orange text-sm font-semibold tracking-widest uppercase mb-3">Who We Are</p>
          <h2 className="section-title text-white">
            About <span className="gradient-text">Tarang</span>
          </h2>
          <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-cultural-red to-cultural-purple" />
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left – logo + stats */}
          <div className="flex flex-col items-center gap-8 reveal" style={{ opacity: 0 }}>
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-full opacity-40"
                style={{ background: 'conic-gradient(from 0deg, #c0392b, #e67e22, #7d3c98, #1abc9c, #c0392b)', animation: 'ringRotate 12s linear infinite', filter: 'blur(8px)' }}
                aria-hidden="true"
              />
              <div className="relative w-56 h-56 rounded-full overflow-hidden ring-2 ring-white/10">
                <Image src="/logo.png" alt="Tarang Logo" fill className="object-cover" sizes="224px" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
              {[
                { value: '2023', label: 'Founded' },
                { value: '5',    label: 'Teams' },
                { value: '10+',  label: 'Events' },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold gradient-text-warm">{s.value}</p>
                  <p className="text-xs text-white/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – description */}
          <div className="space-y-6">
            <div className="reveal" style={{ opacity: 0 }}>
              <h3 className="text-2xl font-bold text-white mb-3">
                The Cultural Heartbeat of the <span className="gradient-text">AIDS Department</span>
              </h3>
              <p className="text-white/65 leading-relaxed text-base">
                <strong className="text-white/90">Tarang</strong> (तरंग) — meaning <em>&ldquo;wave&rdquo;</em> in Hindi — is the official cultural club of the Artificial Intelligence &amp; Data Science department at DIT Pimpri. We celebrate every festival, every occasion, and every tradition with full heart.
              </p>
            </div>

            <p className="text-white/65 leading-relaxed reveal" style={{ opacity: 0 }}>
              From Teachers Day to Dussehra, from Children's Day to Engineers Day and Science Day — Tarang brings colour, creativity, and community to every celebration. We believe that art and culture are the soul of every institution.
            </p>

            {/* Motivations */}
            <div className="reveal" style={{ opacity: 0 }}>
              <p className="text-white/80 text-sm font-semibold mb-3 uppercase tracking-wider">Our Motivations</p>
              <div className="flex flex-wrap gap-2">
                {motivations.map(m => (
                  <span key={m} className="px-3 py-1.5 rounded-full text-sm text-white/70 border border-white/10" style={{ background: 'rgba(192,57,43,0.08)' }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="p-5 rounded-2xl reveal"
              style={{ background: 'linear-gradient(135deg, rgba(192,57,43,0.08), rgba(125,60,152,0.08))', border: '1px solid rgba(192,57,43,0.2)', opacity: 0 }}
            >
              <p className="text-white/80 italic text-base font-light leading-relaxed">
                &ldquo;Where every celebration becomes a memory, and every performance tells a story — Tarang is where the AIDS department truly comes alive.&rdquo;
              </p>
              <p className="text-cultural-orange text-sm mt-3 font-medium">— Tarang Core Team</p>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-20">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="glass-card rounded-2xl p-6 group reveal"
              style={{ opacity: 0, animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: p.color + '22', border: `1px solid ${p.color}44` }}
              >
                {p.icon}
              </div>
              <h4 className="font-semibold text-white mb-2">{p.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
