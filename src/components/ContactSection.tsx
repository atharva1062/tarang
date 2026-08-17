'use client';

export default function ContactSection({ site }: { site: any }) {
  const instagram = site?.instagram || 'https://www.instagram.com/tarang.dypdpu';
  const linkedin  = site?.linkedin  || 'https://www.linkedin.com/company/tarang-dit';
  const email     = site?.email     || 'tarang.dyp@gmail.com';

const socials = [
  {
    label: 'Instagram',
    href: instagram,
    color: '#e67e22',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-9 h-9"
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
    ),
  },
  {
    label: 'LinkedIn',
    href: linkedin,
    color: '#1abc9c',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-9 h-9"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M6.5 8.5H3.2V21h3.3V8.5ZM4.85 3C3.8 3 3 3.8 3 4.85S3.8 6.7 4.85 6.7s1.85-.8 1.85-1.85S5.9 3 4.85 3ZM21 13.9c0-3.76-2-5.5-4.67-5.5-2.15 0-3.1 1.18-3.63 2.01V8.5H9.4V21h3.3v-6.19c0-1.63.3-3.2 2.32-3.2 1.99 0 2.02 1.86 2.02 3.32V21H21v-7.1Z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: `mailto:${email}`,
    color: '#c0392b',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-9 h-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
];

  return (
    <section id="contact" className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(192,57,43,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto section-padding text-center">
        {/* Header */}
        <p className="text-cultural-red text-sm font-semibold tracking-widest uppercase mb-3">Connect With Us</p>
        <h2 className="section-title text-white mb-4">
          Get in <span className="gradient-text">Touch</span>
        </h2>
        <div className="mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-cultural-red to-cultural-purple mb-8" />
        <p className="text-white/50 text-base max-w-lg mx-auto mb-14">
          Follow us on social media to stay updated on all upcoming events, celebrations, and behind-the-scenes moments from Tarang Cultural Club.
        </p>

        {/* Social cards */}
        <div className="flex flex-wrap justify-center gap-5">
          {socials.map(s => (
            <a
              key={s.label}
              href={s.href}
              id={`social-${s.label.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 min-w-[140px]"
              style={{ background: s.color + '12', border: `1px solid ${s.color}30` }}
            >
              <span className="text-4xl">{s.icon}</span>
              <span className="font-semibold text-sm" style={{ color: s.color }}>{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
