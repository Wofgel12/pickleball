import { ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useRef, useState } from 'react';
import pickleballImg from '../assets/istockphoto-1301500044-612x612.jpg';
import socialImg from '../assets/682770c0db016bc645a094a4_happy-pickleball-community.webp';
import learnImg from '../assets/61450694ce316326cd9bf4ec_DSC08698.jpg';

interface HomeSectionProps {
  language: Language;
  onNavigate: (section: string) => void;
}

export default function HomeSection({ language, onNavigate }: HomeSectionProps) {
  const [shouldPlay, setShouldPlay] = useState(false);
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShouldPlay(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    if (animationRef.current) {
      observer.observe(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        observer.unobserve(animationRef.current);
      }
    };
  }, []);

  const features: Array<{
    icon?: typeof Users;
    image?: string;
    title: string;
    description: string | JSX.Element;
  }> = [
    {
      image: pickleballImg,
      title: language === 'fr' ? 'Santé & Bien-être' : 'Health & Wellness',
      description: language === 'fr'
        ? (
            <>
              Améliorez votre santé globale en pratiquant un sport de raquette. C'est{' '}
              <a
                href="https://www.menshealth.com/health/a63754502/racquet-sports-health-longevity-benefits/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 underline font-semibold"
              >
                scientifiquement prouvé
              </a>
              {' '}!
            </>
          )
        : (
            <>
              Improve your overall health by playing a racket sport. It's{' '}
              <a
                href="https://www.menshealth.com/health/a63754502/racquet-sports-health-longevity-benefits/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 underline font-semibold"
              >
                scientifically proven
              </a>
              {' '}!
            </>
          ),
    },
    {
      image: socialImg,
      title: language === 'fr' ? 'Social & Convivial' : 'Social & Friendly',
      description: language === 'fr'
        ? (
            <>
              Rencontrez de nouvelles personnes dans une atmosphère détendue et amusante.{' '}
              <a
                href="#participate"
                className="text-teal-600 hover:text-teal-700 underline font-semibold"
              >
                Nos sessions
              </a>
              {' '}sont ouvertes à tous !
            </>
          )
        : (
            <>
              Meet new people in a relaxed and fun atmosphere.{' '}
              <a
                href="#participate"
                className="text-teal-600 hover:text-teal-700 underline font-semibold"
              >
                Our sessions
              </a>
              {' '}are open to everyone!
            </>
          ),
    },
    {
      image: learnImg,
      title: language === 'fr' ? 'Facile à Apprendre' : 'Easy to Learn',
      description: language === 'fr'
        ? 'Accessible à tous les âges et niveaux, progressez rapidement !'
        : 'Accessible to all ages and levels, progress quickly!',
    },
  ];

  return (
    <section
      id="home"
      className="pt-4 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-[5px]">
            {t('home.title', language)}
          </h2>
          <div ref={animationRef} className="flex items-center justify-center pointer-events-none mb-[15px] -mt-10">
            <div className="w-full max-w-[200px] md:max-w-none md:w-auto md:h-24">
              <DotLottieReact
                key={shouldPlay ? 'play' : 'stop'}
                src="https://lottie.host/dab2586b-7573-4db2-87d6-ee21f91968d3/kRfJvlcr1i.lottie"
                loop={false}
                autoplay={shouldPlay}
              />
            </div>
          </div>
          <p className="text-lg leading-relaxed text-gray-700">
            {t('home.intro', language)}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center rounded-2xl bg-white/90 backdrop-blur-sm border-2 hover:shadow-lg transition-shadow overflow-hidden"
              style={{ borderColor: '#002b2b' }}
            >
              {feature.image ? (
                <div className="w-full h-48 overflow-hidden">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover object-center" />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                  {feature.icon && <feature.icon className="text-white" size={48} />}
                </div>
              )}
              <div className="p-8 pt-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => onNavigate('participate')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {language === 'fr' ? 'Rejoindre l\'une de nos sessions de Pickleball' : 'Join one of our Pickleball sessions'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
