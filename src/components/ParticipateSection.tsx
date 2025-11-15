import { ExternalLink, Calendar } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useRef, useState } from 'react';

interface ParticipateSectionProps {
  language: Language;
}

export default function ParticipateSection({ language }: ParticipateSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setAnimationKey(prev => prev + 1);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      id="participate"
      className="pb-20 px-4"
      ref={sectionRef}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between mb-4">
          <div className="w-32 h-32 rotate-180">
            {isVisible && (
              <DotLottieReact
                key={`left-${animationKey}`}
                src="https://lottie.host/351c971b-23f8-419d-9f35-f44e03fe1e60/poVzdsh4zU.lottie"
                autoplay
                speed={0.5}
              />
            )}
          </div>
          <div className="w-32 h-32 rotate-180 scale-x-[-1]">
            {isVisible && (
              <DotLottieReact
                key={`right-${animationKey}`}
                src="https://lottie.host/351c971b-23f8-419d-9f35-f44e03fe1e60/poVzdsh4zU.lottie"
                autoplay
                speed={0.5}
              />
            )}
          </div>
        </div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            {t('participate.title', language)}
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t('participate.description', language)}
          </p>
        </div>

        <div className="flex justify-center mb-12 relative">
          <a
            href="https://www.meetup.com/genevasportsclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 relative"
          >
            <Calendar size={24} />
            {t('participate.button', language)}
            <ExternalLink size={20} />
          </a>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
  <div className="flex justify-center">
    {/* Taille normale sur mobile, légèrement agrandie sur desktop */}
    <div className="origin-center scale-100 lg:scale-[1.15]">
      <DotLottieReact
        src="https://lottie.host/7214da79-8fa8-4cf5-9e96-52774d50fadb/jgzIfgVPpq.lottie"
        loop
        autoplay
        style={{ width: "160%", height: "130%" }}
      />
    </div>
  </div>
</div>





    
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2" style={{ borderColor: '#002b2b' }}>
          <div className="px-6 py-4" style={{ background: 'linear-gradient(to right, #003d3d, #005555)' }}>
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar size={24} />
              {t('participate.meetupTitle', language)}
            </h3>
          </div>
          <div className="relative">
            <iframe src='https://widgets.sociablekit.com/meetup-group-events/iframe/25622080' frameborder='0' width='100%' height='500'></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
