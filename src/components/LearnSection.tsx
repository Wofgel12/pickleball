import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import courtImage from '../assets/court.jpg';

interface LearnSectionProps {
  language: Language;
}

export default function LearnSection({ language }: LearnSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section
      id="learn"
      className="py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            {t('learn.title', language)}
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed text-justify">
            {t('learn.intro', language)}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border-2" style={{ borderColor: '#002b2b' }}>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">
              {t('learn.courtTitle', language)}
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {t('learn.courtDesc', language)}
            </p>
            <div className="bg-white p-6 rounded-xl shadow-sm border-2" style={{ borderColor: '#002b2b' }}>
              <img src={courtImage} alt="Pickleball Court" className="w-full h-auto rounded-lg" />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border-2" style={{ borderColor: '#002b2b' }}>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">
              {t('learn.scoringTitle', language)}
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {t('learn.scoringDesc', language)}
            </p>
            <div className="bg-white p-6 rounded-xl shadow-sm border-2" style={{ borderColor: '#002b2b' }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-transparent rounded-lg">
                  <span className="font-semibold text-gray-900">
                    {language === 'fr' ? 'Service' : 'Serve'}
                  </span>
                  <span className="text-teal-600 font-bold text-lg">→</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg">
                  <span className="font-semibold text-gray-900">
                    {language === 'fr' ? 'Point gagné' : 'Point Won'}
                  </span>
                  <span className="text-blue-600 font-bold text-lg">+1</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-lg">
                  <span className="font-semibold text-gray-900">
                    {language === 'fr' ? 'Objectif' : 'Goal'}
                  </span>
                  <span className="text-gray-600 font-bold text-lg">11</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border-2" style={{ borderColor: '#002b2b' }}>
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">
            {t('learn.videoTitle', language)}
          </h3>
          <div className="relative" style={{ paddingTop: '56.25%' }}>
            <iframe
              src="https://www.youtube.com/embed/fTvPYdKZqO0"
              className="absolute inset-0 w-full h-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="What is Pickleball"
            />
          </div>
        </div>

        <div id="faq" className="mt-12 bg-white/95 backdrop-blur-sm p-8 rounded-2xl border-2" style={{ borderColor: '#002b2b' }}>
          <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">
            {t('faq.title', language)}
          </h3>

          <div className="space-y-4 max-w-4xl mx-auto">
            {[1, 2, 3, 4, 5, 6, 7 ].map((num) => (
              <div
                key={num}
                className="bg-white/90 backdrop-blur-sm rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-md"
                style={{ borderColor: '#002b2b' }}
              >
                <button
                  onClick={() => toggleFaq(num)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors hover:bg-teal-50/50"
                >
                  <h4 className="font-semibold text-lg text-gray-900 pr-4">
                    {t(`faq.q${num}.question`, language)}
                  </h4>
                  <ChevronDown
                    className={`flex-shrink-0 text-teal-600 transition-transform duration-300 ${
                      openFaq === num ? 'rotate-180' : ''
                    }`}
                    size={24}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openFaq === num ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <p className="px-6 pb-4 text-gray-700 leading-relaxed">
                    {t(`faq.q${num}.answer`, language)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
