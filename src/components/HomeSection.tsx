import { Heart, Users, TrendingUp } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useRef, useState } from 'react';

interface HomeSectionProps {
  language: Language;
}

export default function HomeSection({ language }: HomeSectionProps) {
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
    icon: typeof Heart;
    title: string;
    description: string | JSX.Element;
  }> = [
    {
      icon: Heart,
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
        : 'Improve your cardio, coordination and agility with a low-impact sport',
    },
    {
      icon: Users,
      title: language === 'fr' ? 'Social & Convivial' : 'Social & Friendly',
      description: language === 'fr'
        ? 'Rencontrez de nouvelles personnes dans une atmosphère détendue et amusante. Nos sessions sont ouvertes à tous !'
        : 'Meet new people in a relaxed and fun atmosphere',
    },
    {
      icon: TrendingUp,
      title: language === 'fr' ? 'Facile à Apprendre' : 'Easy to Learn',
      description: language === 'fr'
        ? 'Accessible à tous les âges et niveaux, progressez rapidement'
        : 'Accessible to all ages and levels, progress quickly',
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

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-white/90 backdrop-blur-sm border-2 hover:shadow-lg transition-shadow"
              style={{ borderColor: '#002b2b' }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
