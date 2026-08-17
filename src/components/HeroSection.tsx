'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/* ─── Animated starfield ─── */
function StarField() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: 80 }).map((_, i) => {
        const size   = Math.random() * 2 + 1;
        const top    = Math.random() * 100;
        const left   = Math.random() * 100;
        const dur    = (Math.random() * 4 + 2).toFixed(1) + 's';
        const delay  = (Math.random() * 5).toFixed(1) + 's';
        return (
          <span
            key={i}
            className="star"
            style={{
              width: size, height: size,
              top: top + '%', left: left + '%',
              opacity: Math.random() * 0.6 + 0.1,
              '--dur': dur, '--delay': delay,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}


/* ─── Floating orbs ─── */
function Orbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(192,57,43,0.18) 0%, transparent 70%)',
          top: '10%', left: '-10%',
          animation: 'float 8s ease-in-out infinite',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(125,60,152,0.22) 0%, transparent 70%)',
          top: '30%', right: '-5%',
          animation: 'float 10s ease-in-out infinite 2s',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(26,188,156,0.16) 0%, transparent 70%)',
          bottom: '10%', left: '30%',
          animation: 'float 7s ease-in-out infinite 1s',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(230,126,34,0.12) 0%, transparent 70%)',
          top: '60%', right: '20%',
          animation: 'float 9s ease-in-out infinite 3s',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}

export default function HeroSection({ hero }: { hero: any }) {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / 30;
      const dy   = (e.clientY - cy) / 30;
      el.style.transform = `rotateY(${dx}deg) rotateX(${-dy}deg)`;
    };
    const handleLeave = () => { el.style.transform = 'rotateY(0deg) rotateX(0deg)'; };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const badge = hero?.badge || "DIT Pimpri • AI & DS Cultural Club";
  const titleDevanagari = hero?.titleDevanagari || "तरंग";
  const titleEnglish = hero?.titleEnglish || "Cultural Club";
  const tagline = hero?.tagline || "Where creativity meets expression — celebrating culture, art, and community in the heart of DIT.";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise-bg"
    >
      <StarField />
      <Orbs />

      {/* Gradient mesh background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(192,57,43,0.08) 0%, transparent 60%), ' +
            'radial-gradient(ellipse 60% 40% at 80% 80%, rgba(125,60,152,0.1) 0%, transparent 60%), ' +
            'radial-gradient(ellipse 40% 50% at 10% 60%, rgba(26,188,156,0.06) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto section-padding flex flex-col items-center text-center pt-24 pb-16">
        {/* Department badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
          style={{
            background: 'rgba(192,57,43,0.12)',
            border: '1px solid rgba(192,57,43,0.35)',
            color: '#e07060',
            animation: 'fadeInUp 0.6s ease forwards',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-cultural-red animate-pulse" />
          {badge}
        </div>

        {/* Animated logo with glow ring */}
        <div
          ref={logoRef}
          className="relative mb-10 cursor-none"
          style={{
            perspective: '800px',
            transition: 'transform 0.15s ease',
          }}
        >
          {/* Rotating outer ring */}
          <div
            className="absolute -inset-6 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #c0392b, #e67e22, #7d3c98, #1abc9c, #c0392b)',
              animation: 'ringRotate 8s linear infinite',
              filter: 'blur(1px)',
              opacity: 0.7,
            }}
            aria-hidden="true"
          />
          {/* Glow layer */}
          <div
            className="absolute -inset-4 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(192,57,43,0.5) 0%, rgba(125,60,152,0.3) 50%, transparent 70%)',
              animation: 'glowPulse 3s ease-in-out infinite',
            }}
            aria-hidden="true"
          />
          {/* Logo image */}
          <div
            className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden ring-4"
            style={{ ringColor: 'rgba(192,57,43,0.6)' }}
          >
            <Image
              src="/logo.png"
              alt="Tarang Cultural Club Logo"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
            />
          </div>
        </div>

        {/* Club name */}
        <h1 className="section-title mb-3">
          <span
            className="block gradient-text mb-1"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          >
            {titleDevanagari}
          </span>
          <span className="block text-white/90 text-2xl sm:text-3xl lg:text-4xl font-light tracking-widest uppercase">
            {titleEnglish}
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="mt-6 max-w-2xl text-lg sm:text-xl text-white/60 leading-relaxed font-light"
          style={{ animation: 'fadeInUp 0.8s ease 0.3s forwards', opacity: 0 }}
        >
          {tagline}
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-wrap gap-4 justify-center mt-10"
          style={{ animation: 'fadeInUp 0.8s ease 0.5s forwards', opacity: 0 }}
        >
          <a href="#events" className="btn-primary">
            <span>Explore Events</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a href="#gallery" className="btn-outline">
            <span>View Gallery</span>
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
          aria-hidden="true"
        >
          <span className="text-xs tracking-widest uppercase text-white/50">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
            <div
              className="w-1 h-2 bg-white/60 rounded-full"
              style={{ animation: 'float 2s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
