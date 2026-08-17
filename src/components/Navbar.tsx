'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const navLinks = [
  { label: 'Home',    href: '#home' },
  { label: 'About',   href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Events',  href: '#events' },
  { label: 'Team',    href: '#team' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ site }: { site: any }) {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = navLinks.map(l => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveLink('#' + sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const instagram = site?.instagram || '#';
  const linkedin  = site?.linkedin  || '#';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-white/5 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto section-padding flex items-center justify-between">
        {/* Logo + Name */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-cultural-red/40 group-hover:ring-cultural-orange/60 transition-all duration-300">
            <Image src="/logo.png" alt="Tarang Cultural Club Logo" fill className="object-cover" sizes="40px" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-wide gradient-text" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              तरंग
            </span>
            <span className="text-[10px] text-white/50 uppercase tracking-widest -mt-0.5">Cultural Club</span>
          </div>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav-link text-sm font-medium transition-colors duration-200 ${
                  activeLink === link.href ? 'text-cultural-orange active' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Social icons — desktop */}
        <div className="hidden md:flex items-center gap-3">
          <a href={instagram} target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-base hover:-translate-y-0.5 transition-transform" aria-label="Instagram">📸</a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-base hover:-translate-y-0.5 transition-transform" aria-label="LinkedIn">💼</a>
        </div>

        {/* Mobile hamburger */}
        <button
          id="nav-menu-toggle"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white/80 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white/80 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white/80 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="glass border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium py-1 transition-colors ${activeLink === link.href ? 'text-cultural-orange' : 'text-white/70 hover:text-white'}`}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-white/60 text-sm hover:text-white transition-colors">📸 Instagram</a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 text-sm hover:text-white transition-colors">💼 LinkedIn</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
