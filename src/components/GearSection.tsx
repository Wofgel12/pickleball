import { ShoppingBag } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface GearSectionProps {
  language: Language;
}

export default function GearSection({ language }: GearSectionProps) {
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
              <div className="grid md:grid-cols-2 gap-8 items-center">
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
              <div className="grid md:grid-cols-2 gap-8 items-center">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
