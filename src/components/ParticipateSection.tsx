import { ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface ParticipateSectionProps {
  language: Language;
  onNavigate: (section: string) => void;
}

export default function ParticipateSection({ language, onNavigate }: ParticipateSectionProps) {
  return (
    <section id="participate" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t('participate.title', language)}
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-10">
            {t('participate.description', language)}
          </p>
          <button
            onClick={() => onNavigate('participate')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {language === 'fr' ? 'Comment participer ?' : 'How to participate?'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
