import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Academics from '@/components/Academics';
import Projects from '@/components/Projects';
import BlogSection from '@/components/BlogSection';
import Resume from '@/components/Resume';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <Academics />
      <Resume />
      <BlogSection />
      <Contact />
      <Footer />
    </main>
  );
}
