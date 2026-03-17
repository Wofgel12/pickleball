import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import HomeSection from './components/HomeSection';
import ParticipateSection from './components/ParticipateSection';
import ParticipatePageSection from './components/ParticipatePageSection';
import LearnSection from './components/LearnSection';
import GearSection from './components/GearSection';
import ContactSection from './components/ContactSection';
import { Language } from './types';
import bgVideo from './assets/bg-video.mp4';
import bgImage from './assets/download copy copy.webp';
import logoImg from "./assets/logo-img.png";

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [currentPage, setCurrentPage] = useState<'main' | 'gear' | 'participate'>('main');
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'participate', 'faq', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'gear') {
      setCurrentPage('gear');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'participate') {
      setCurrentPage('participate');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentPage !== 'main') {
      setCurrentPage('main');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80;
          const elementPosition = element.offsetTop - offset;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  const bgTileStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: 'repeat',
    backgroundSize: '180px 180px',
    backgroundAttachment: 'scroll',
  };

  return (
    <div className="min-h-screen relative">
      <Navigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
        language={language}
        onLanguageChange={setLanguage}
        currentPage={currentPage}
      />

      <main>
        {currentPage === 'main' ? (
          <>
            <div className="relative">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
              >
                <source src={bgVideo} type="video/mp4" />
              </video>
              <div className="relative z-10">
                <Hero language={language} />
              </div>
            </div>

            <div className="min-h-screen" style={bgTileStyle}>
              <HomeSection language={language} onNavigate={handleNavigate} />
              <ParticipateSection language={language} onNavigate={handleNavigate} />
              <LearnSection language={language} />
              <ContactSection language={language} />
            </div>
          </>
        ) : currentPage === 'participate' ? (
          <div className="min-h-screen pt-20" style={bgTileStyle}>
            <ParticipatePageSection language={language} />
          </div>
        ) : (
          <div className="min-h-screen pt-20" style={bgTileStyle}>
            <GearSection language={language} />
          </div>
        )}
      </main>

      <footer className="relative z-10 bg-gray-900 text-white py-8 px-4" style={{ backgroundImage: `url(${bgImage})` }} aria-label={language === 'fr' ? 'Pied de page - Geneva Pickleball' : 'Footer - Geneva Pickleball'}>
        <div className="max-w-6xl mx-auto text-center" itemScope itemType="https://schema.org/SportsClub">
          <div className="text-gray-400 text-sm mb-3 flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:hello@genevasportsclub.ch" className="hover:text-teal-400 transition-colors" itemProp="email">hello@genevasportsclub.ch</a>
            <span className="hidden sm:inline text-gray-600">|</span>
            <a href="tel:+41762141203" className="hover:text-teal-400 transition-colors" itemProp="telephone">+41 76.214.12.03</a>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Geneva Sports Club. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
          <meta itemProp="url" content="https://pickleballgeneva.netlify.app/" />
          <meta itemProp="sport" content="Pickleball" />
        </div>
      </footer>
    </div>
  );
}

export default App;
