'use client';

import { useEffect, useRef } from 'react';

const milestones = [
  {
    year: 'Aug 2023',
    title: 'Foundation of Club',
    desc: 'On August 2023, Tarang was born as a cultural haven at DIT, laying its foundation in a spirit of diversity, creativity, and unity, poised to become the vibrant heartbeat of our college community. 🎡',
    color: '#c0392b',
    icon: '🌱',
    hasPhoto: false,
  },
  {
    year: 'Sep 2023',
    title: 'Teachers Day Celebration',
    desc: "Tarang's Teachers Day celebration (Sep'23) was a heartfelt tribute to our guiding lights, blending gratitude with creativity as students and faculty came together for a memorable event filled with joy, appreciation, and cultural expressions. 🎉",
    color: '#e67e22',
    icon: '🎤',
    hasPhoto: false,
  },
  {
    year: 'Oct 2023',
    title: 'Dussehra Celebration',
    desc: "Tarang's Dussehra event (Oct'23) illuminated the festival with a unique twist, as we combined cultural celebration with a crucial social cause — raising awareness about cybersecurity and presented it via a street play. 🥁",
    color: '#7d3c98',
    icon: '🎉',
    hasPhoto: false,
  },
  {
    year: 'Nov 2023',
    title: "Children's Day Celebration",
    desc: "On Children's Day, Tarang brought out the inner child in everyone — with games, performances, and joyful activities that reminded us all of the innocence and creativity we carry within.",
    color: '#1abc9c',
    icon: '🎈',
    hasPhoto: false,
  },
  {
    year: '2024',
    title: 'Engineers Day & Science Day',
    desc: "Tarang celebrated Engineers Day and National Science Day with cultural performances, street plays, and creative showcases — honoring India's great scientific and engineering minds through art and expression.",
    color: '#e67e22',
    icon: '🔬',
    hasPhoto: false,
  },
  {
    year: '2024–25',
    title: 'Growing Stronger',
    desc: "Tarang continues to grow — organizing more events, welcoming new members, and cementing its place as the cultural heart of the AI & Data Science department at DIT Pimpri.",
    color: '#c0392b',
    icon: '🚀',
    hasPhoto: false,
  },
];

export default function JourneySection() {
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
  }, []);

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

          <div className="space-y-10">
            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`milestone-card relative flex gap-6 lg:gap-0 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  style={{ opacity: 0 }}
                >
                  {/* Card */}
                  <div
                    className={`glass-card rounded-2xl p-6 flex-1 lg:w-[calc(50%-3rem)] ${isLeft ? 'lg:mr-auto lg:pr-12' : 'lg:ml-auto lg:pl-12'} ml-12 lg:ml-0`}
                    style={{ borderColor: m.color + '30' }}
                  >
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                      style={{ background: m.color + '22', color: m.color }}
                    >
                      {m.year}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-2">{m.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{m.desc}</p>
                  </div>

                  {/* Icon — desktop */}
                  <div
                    className="hidden lg:flex absolute left-1/2 top-6 -translate-x-1/2 w-12 h-12 rounded-full items-center justify-center text-xl z-10"
                    style={{ background: m.color + '22', border: `2px solid ${m.color}` }}
                  >
                    {m.icon}
                  </div>

                  {/* Icon — mobile */}
                  <div
                    className="lg:hidden absolute left-0 top-6 w-10 h-10 rounded-full flex items-center justify-center text-lg z-10"
                    style={{ background: m.color + '22', border: `2px solid ${m.color}` }}
                  >
                    {m.icon}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
