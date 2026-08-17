import Navbar         from '@/components/Navbar';
import HeroSection    from '@/components/HeroSection';
import AboutSection   from '@/components/AboutSection';
import JourneySection from '@/components/JourneySection';
import EventsSection  from '@/components/EventsSection';
import TeamSection    from '@/components/TeamSection';
import GallerySection from '@/components/GallerySection';
import ContactSection from '@/components/ContactSection';
import Footer         from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <JourneySection />
      <EventsSection />
      <TeamSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </main>
  );
}
