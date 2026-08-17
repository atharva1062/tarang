'use client';

import Image from 'next/image';

const footerLinks = [
  { label: 'Home',    href: '#home' },
  { label: 'About',   href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Events',  href: '#events' },
  { label: 'Team',    href: '#team' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer({ site }: { site: any }) {
  const year = new Date().getFullYear();

  const addressDept = site?.addressDept || "AI & DS Dept";
  const addressClg  = site?.addressClg  || "DIT Pimpri";
  const addressPin  = site?.addressPin  || "411018";
  const email       = site?.email       || "tarang.dyp@gmail.com";
  const instagram   = site?.instagram   || "https://www.instagram.com/tarang.dypdpu";
  const linkedin    = site?.linkedin    || "https://www.linkedin.com/company/tarang-dit";

  const motivations = site?.motivations || [
    "Cultural Celebration",
    "Creative Expression",
    "Community Building",
    "Cultural Awareness & Education"
  ];

  const privacyPolicy = site?.privacyPolicy || [
    "Information Collection",
    "Data Usage & Purpose",
    "Data Security Measures",
    "User Rights & Choices"
  ];

  return (
    <footer className="relative pt-20 pb-8 overflow-hidden">
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #c0392b, #e67e22, #7d3c98, #1abc9c, transparent)' }}
        aria-hidden="true"
      />
      {/* Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c0392b 0%, #7d3c98 50%, transparent 100%)', filter: 'blur(60px)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto section-padding">
        {/* Main 4-column grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-cultural-red/40">
                <Image src="/logo.png" alt="Tarang Logo" fill className="object-cover" sizes="48px" />
              </div>
              <div>
                <p className="text-xl font-bold gradient-text" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>तरंग</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Cultural Club</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              The cultural heartbeat of the AI &amp; Data Science department, DIT Pimpri.
            </p>
            <div className="flex gap-3">
              <a href={instagram} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-lg hover:-translate-y-1 transition-transform duration-200" aria-label="Instagram">
                📸
              </a>
              <a href={linkedin} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-lg hover:-translate-y-1 transition-transform duration-200" aria-label="LinkedIn">
                💼
              </a>
              <a href={`mailto:${email}`}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-lg hover:-translate-y-1 transition-transform duration-200" aria-label="Email">
                📧
              </a>
            </div>
          </div>

          {/* Motivations */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-widest mb-5">Motivations</h4>
            <ul className="space-y-3">
              {motivations.map((m: string) => (
                <li key={m} className="text-sm text-white/50">{m}</li>
              ))}
            </ul>
          </div>

          {/* Privacy Policy */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-widest mb-5">Privacy Policy</h4>
            <ul className="space-y-3">
              {privacyPolicy.map((p: string) => (
                <li key={p}>
                  <a href="#" className="text-sm text-white/50 hover:text-cultural-orange transition-colors duration-200">{p}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-widest mb-5">Address</h4>
            <address className="not-italic space-y-1 text-sm text-white/50">
              <p>{addressDept}</p>
              <p>{addressClg}</p>
              <p>{addressPin}</p>
              <a href={`mailto:${email}`} className="block mt-3 hover:text-cultural-orange transition-colors">
                {email}
              </a>
            </address>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mb-8">
          {footerLinks.map(l => (
            <a key={l.href} href={l.href} className="text-xs text-white/40 hover:text-cultural-orange transition-colors duration-200">
              {l.label}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5 mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {year} Tarang Cultural Club — AI &amp; Data Science Department, {addressClg}. All rights reserved.</p>
          <p>Made with <span className="text-cultural-red">♥</span> by the Tarang Core Team</p>
        </div>
      </div>
    </footer>
  );
}
