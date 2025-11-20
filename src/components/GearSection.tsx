import { ShoppingBag, Check, X, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import { raquette } from '../assets/raquette.png';

interface GearSectionProps {
  language: Language;
}

export default function GearSection({ language }: GearSectionProps) {
  const paddleData = {
    pros: language === 'fr'
      ? ['Excellent contrôle', 'Bon rapport qualité-prix', 'Durable']
      : ['Excellent control', 'Good value for money', 'Durable'],
    cons: language === 'fr'
      ? ['Un peu lourd pour certains', 'Moins de puissance']
      : ['Slightly heavy for some', 'Less power'],
    why: language === 'fr'
      ? 'Parfait équilibre entre contrôle et prix, idéal pour débuter et progresser.'
      : 'Perfect balance between control and price, ideal for beginners and improving players.',
    url: 'https://www.amazon.com/s?k=pickleball+paddle'
  };

  const ballData = {
    pros: language === 'fr'
      ? ['Très résistantes', 'Bon rebond', 'Polyvalentes indoor/outdoor']
      : ['Very durable', 'Good bounce', 'Versatile indoor/outdoor'],
    cons: language === 'fr'
      ? ['Prix légèrement élevé']
      : ['Slightly higher price'],
    why: language === 'fr'
      ? 'Qualité professionnelle à un prix accessible pour tous les niveaux.'
      : 'Professional quality at an affordable price for all levels.',
    url: 'https://www.amazon.com/s?k=pickleball+balls'
  };

  return (
    <section id="gear" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            {t('gear.title', language)}
          </h2>
        </div>

        <div className="space-y-12">
          {/* Paddle Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2" style={{ borderColor: '#002b2b' }}>
            <div className="px-6 py-4" style={{ background: 'linear-gradient(to right, #003d3d, #005555)' }}>
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <ShoppingBag size={28} />
                {t('gear.paddleTitle', language)}
              </h3>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center mb-6">
                <div className="flex justify-center">
                  <img
                    src="https://images.pexels.com/photos/6253908/pexels-photo-6253908.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Pickleball Paddle"
                    className="rounded-xl shadow-lg max-w-full h-auto"
                  />
                </div>
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {t('gear.paddleDesc', language)}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Check size={20} />
                    {t('gear.pros', language)}
                  </h4>
                  <ul className="space-y-2">
                    {paddleData.pros.map((pro, i) => (
                      <li key={i} className="text-green-700 flex items-start gap-2">
                        <Check size={16} className="mt-1 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <X size={20} />
                    {t('gear.cons', language)}
                  </h4>
                  <ul className="space-y-2">
                    {paddleData.cons.map((con, i) => (
                      <li key={i} className="text-red-700 flex items-start gap-2">
                        <X size={16} className="mt-1 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-teal-50 p-4 rounded-lg border-2 border-teal-200 mb-6">
                <h4 className="font-semibold text-teal-800 mb-2">{t('gear.why', language)}</h4>
                <p className="text-teal-700">{paddleData.why}</p>
              </div>

              <a
                href={paddleData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all"
              >
                {t('gear.buyButton', language)}
                <ExternalLink size={20} />
              </a>
            </div>
          </div>

          {/* Ball Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2" style={{ borderColor: '#002b2b' }}>
            <div className="px-6 py-4" style={{ background: 'linear-gradient(to right, #003d3d, #005555)' }}>
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <ShoppingBag size={28} />
                {t('gear.ballTitle', language)}
              </h3>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center mb-6">
                <div className="flex justify-center">
                  <img
                    src="https://images.pexels.com/photos/6253914/pexels-photo-6253914.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Pickleball Balls"
                    className="rounded-xl shadow-lg max-w-full h-auto"
                  />
                </div>
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {t('gear.ballDesc', language)}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Check size={20} />
                    {t('gear.pros', language)}
                  </h4>
                  <ul className="space-y-2">
                    {ballData.pros.map((pro, i) => (
                      <li key={i} className="text-green-700 flex items-start gap-2">
                        <Check size={16} className="mt-1 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <X size={20} />
                    {t('gear.cons', language)}
                  </h4>
                  <ul className="space-y-2">
                    {ballData.cons.map((con, i) => (
                      <li key={i} className="text-red-700 flex items-start gap-2">
                        <X size={16} className="mt-1 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-teal-50 p-4 rounded-lg border-2 border-teal-200 mb-6">
                <h4 className="font-semibold text-teal-800 mb-2">{t('gear.why', language)}</h4>
                <p className="text-teal-700">{ballData.why}</p>
              </div>

              <a
                href={ballData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all"
              >
                {t('gear.buyButton', language)}
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
