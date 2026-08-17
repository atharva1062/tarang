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

export default function Navbar({ site, logo }: { site: any; logo: string }) {
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
            <Image src={logo} alt="Tarang Cultural Club Logo" fill className="object-cover" sizes="40px" />
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
  {/* Instagram */}
  <a
    href={instagram}
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:-translate-y-0.5 transition-transform"
    aria-label="Instagram"
  >
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  </a>

  {/* LinkedIn */}
  <a
    href={linkedin}
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:-translate-y-0.5 transition-transform"
    aria-label="LinkedIn"
  >
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.5 8.5H3.2V21h3.3V8.5ZM4.85 3C3.8 3 3 3.8 3 4.85S3.8 6.7 4.85 6.7s1.85-.8 1.85-1.85S5.9 3 4.85 3ZM21 13.9c0-3.76-2-5.5-4.67-5.5-2.15 0-3.1 1.18-3.63 2.01V8.5H9.4V21h3.3v-6.19c0-1.63.3-3.2 2.32-3.2 1.99 0 2.02 1.86 2.02 3.32V21H21v-7.1Z" />
    </svg>
  </a>
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
          <div className="flex gap-5 pt-2">
  <a
    href={instagram}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors"
    aria-label="Instagram"
  >
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
    Instagram
  </a>

  <a
    href={linkedin}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors"
    aria-label="LinkedIn"
  >
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.5 8.5H3.2V21h3.3V8.5ZM4.85 3C3.8 3 3 3.8 3 4.85S3.8 6.7 4.85 6.7s1.85-.8 1.85-1.85S5.9 3 4.85 3ZM21 13.9c0-3.76-2-5.5-4.67-5.5-2.15 0-3.1 1.18-3.63 2.01V8.5H9.4V21h3.3v-6.19c0-1.63.3-3.2 2.32-3.2 1.99 0 2.02 1.86 2.02 3.32V21H21v-7.1Z" />
    </svg>
    LinkedIn
  </a>
</div>
        </div>
      </div>
    </nav>
  );
}
