import { Language } from '../types';
import { t } from '../translations';

interface HeroProps {
  language: Language;
}

export default function Hero({ language }: HeroProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center">


      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>



      <div className="relative z-10 text-center px-4 max-w-8xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
          <span className="font-light text-white/90">{language === 'fr' ? 'Venez ' : 'Come '}</span>
          {language === 'fr' ? 'jouer au Pickleball à Genève' : 'play Pickleball in Geneva'}
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl text-white/95 font-medium mb-8">
          {language === 'fr' ? (
            <>
              La seule association sportive pratiquant activement le Pickleball dans le <span className="font-bold">canton de Genève</span>.
            </>
          ) : (
            <>
              The only sports association actively playing Pickleball in the <span className="font-bold">canton of Geneva</span>.
            </>
          )}
        </h2>

        <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-8 py-6 text-center animate-[slideDown_0.8s_ease-out]">
          <div className="text-4xl font-bold text-white mb-1">
            + 8000 <a href="https://www.meetup.com/genevasportsclub/members/?op=all" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80 transition-colors">membres</a>
          </div>
          <div className="text-sm text-white/80">tout sport confondu</div>
        </div>

      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
