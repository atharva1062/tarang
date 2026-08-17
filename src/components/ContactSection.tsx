'use client';

export default function ContactSection({ site }: { site: any }) {
  const instagram = site?.instagram || 'https://www.instagram.com/tarang.dypdpu';
  const linkedin  = site?.linkedin  || 'https://www.linkedin.com/company/tarang-dit';
  const email     = site?.email     || 'tarang.dyp@gmail.com';

  const socials = [
    { label: 'Instagram', icon: '📸', href: instagram, color: '#e67e22' },
    { label: 'LinkedIn',  icon: '💼', href: linkedin,  color: '#1abc9c' },
    { label: 'Email',     icon: '📧', href: `mailto:${email}`, color: '#c0392b' },
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
