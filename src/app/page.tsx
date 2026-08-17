import { getStore } from '@/lib/storage';

import Navbar         from '@/components/Navbar';
import HeroSection    from '@/components/HeroSection';
import AboutSection   from '@/components/AboutSection';
import JourneySection from '@/components/JourneySection';
import EventsSection  from '@/components/EventsSection';
import TeamSection    from '@/components/TeamSection';
import GallerySection from '@/components/GallerySection';
import ContactSection from '@/components/ContactSection';
import Footer         from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const hero    = (await getStore('hero'))    || {};
  const about   = (await getStore('about'))   || {};
  const journey = (await getStore('journey')) || [];
  const events  = (await getStore('events'))  || [];
  const site    = (await getStore('site'))    || {};
  const team    = (await getStore('team'))    || [];
  const gallery = (await getStore('gallery')) || [];

  const logo    = site?.logo || '/logo.png';

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
