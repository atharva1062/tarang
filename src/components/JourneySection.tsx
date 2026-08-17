'use client';

import { useEffect, useRef } from 'react';

export default function JourneySection({ journey }: { journey: any[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.milestone-card').forEach((el, i) => {
              setTimeout(() => {
                el.classList.add('animate-fade-in-up');
                (el as HTMLElement).style.opacity = '1';
              }, i * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [journey]);

  return (
    <section id="journey" ref={ref} className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(125,60,152,0.07) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto section-padding">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-cultural-teal text-sm font-semibold tracking-widest uppercase mb-3">Our Story</p>
          <h2 className="section-title text-white">
            Our Amazing Journey <span className="gradient-text">So Far</span> ⛵
          </h2>
          <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-cultural-purple to-cultural-teal" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line desktop */}
          <div className="absolute left-1/2 -translate-x-1/2 w-0.5 top-0 bottom-0 timeline-line rounded-full opacity-30 hidden lg:block" aria-hidden="true" />
          {/* Left line mobile */}
          <div className="absolute left-6 w-0.5 top-0 bottom-0 timeline-line rounded-full opacity-30 lg:hidden" aria-hidden="true" />

          {journey.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/40">No milestones added yet. Add them in the admin panel!</p>
            </div>
          ) : (
            <div className="space-y-10">
              {journey.map((m: any, i: number) => {
                const isLeft = i % 2 === 0;
                const color = m.color || '#c0392b';
                return (
                  <div
                    key={m.id || i}
                    className={`milestone-card relative flex gap-6 lg:gap-0 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                    style={{ opacity: 0 }}
                  >
                    {/* Card */}
                    <div
                      className={`glass-card rounded-2xl p-6 flex-1 lg:w-[calc(50%-3rem)] ${isLeft ? 'lg:mr-auto lg:pr-12' : 'lg:ml-auto lg:pl-12'} ml-12 lg:ml-0`}
                      style={{ borderColor: color + '30' }}
                    >
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                        style={{ background: color + '22', color: color }}
                      >
                        {m.year}
                      </span>
                      <h3 className="text-lg font-bold text-white mb-2">{m.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{m.desc}</p>
                    </div>

                    {/* Icon — desktop */}
                    <div
                      className="hidden lg:flex absolute left-1/2 top-6 -translate-x-1/2 w-12 h-12 rounded-full items-center justify-center text-xl z-10"
                      style={{ background: color + '22', border: `2px solid ${color}` }}
                    >
                      {m.icon || '📍'}
                    </div>

                    {/* Icon — mobile */}
                    <div
                      className="lg:hidden absolute left-0 top-6 w-10 h-10 rounded-full flex items-center justify-center text-lg z-10"
                      style={{ background: color + '22', border: `2px solid ${color}` }}
                    >
                      {m.icon || '📍'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
