import fs from 'fs';
import path from 'path';

import Navbar         from '@/components/Navbar';
import HeroSection    from '@/components/HeroSection';
import AboutSection   from '@/components/AboutSection';
import JourneySection from '@/components/JourneySection';
import EventsSection  from '@/components/EventsSection';
import TeamSection    from '@/components/TeamSection';
import GallerySection from '@/components/GallerySection';
import ContactSection from '@/components/ContactSection';
import Footer         from '@/components/Footer';

function readJSON(file: string) {
  const filePath = path.join(process.cwd(), 'data', `${file}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}


export default function Home() {
  const hero    = readJSON('hero')    || {};
  const about   = readJSON('about')   || {};
  const journey = readJSON('journey') || [];
  const events  = readJSON('events')  || [];
  const site    = readJSON('site')    || {};
  const team    = readJSON('team')    || [];
  const gallery = readJSON('gallery') || [];

  const logo    = site?.logo        || '/logo.png';

  return (
    <main className="min-h-screen">
      <Navbar site={site} logo={logo} />
      <HeroSection hero={hero} logo={logo} />
      <AboutSection about={about} logo={logo} />
      <JourneySection journey={journey} />
      <EventsSection events={events} />
      <TeamSection initialTeam={team} />
      <GallerySection initialGallery={gallery} />
      <ContactSection site={site} />
      <Footer site={site} logo={logo} />
    </main>
  );
}
