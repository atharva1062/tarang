import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tarang Cultural Club – AI & Data Science Department',
  description:
    'Tarang is the vibrant cultural club of the Artificial Intelligence & Data Science department, celebrating art, expression, and community through events, fests, and creative endeavors.',
  keywords: [
    'Tarang',
    'Cultural Club',
    'AI & Data Science',
    'AIDS',
    'dance',
    'music',
    'drama',
    'college fest',
  ],
  openGraph: {
    title: 'Tarang Cultural Club – AI & Data Science Department',
    description:
      'The cultural heartbeat of the AIDS department — where technology meets art.',
    type: 'website',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarang Cultural Club',
    description: 'The cultural heartbeat of the AIDS department.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,700&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
