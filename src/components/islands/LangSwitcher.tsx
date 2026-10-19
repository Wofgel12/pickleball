import { routes, type Lang, type RouteKey } from '../../i18n/ui';

interface Props {
  lang: Lang;
  pageKey: RouteKey;
  /** Sub-page URLs (news article…), overriding the page key's routes. */
  paths?: Record<Lang, string>;
}

/**
 * Tiny client-side language switcher.
 * Renders both buttons as anchor links, so the switch is a real navigation
 * to the alternate-locale URL — preserving SEO and respecting browser back-nav.
 */
export default function LangSwitcher({ lang, pageKey, paths }: Props) {
  const frUrl = (paths ?? routes[pageKey]).fr;
  const enUrl = (paths ?? routes[pageKey]).en;
  return (
    <div className="flex bg-gray-100 rounded-lg p-1" role="group" aria-label="Language switcher">
      <a
        href={frUrl}
        hrefLang="fr"
        aria-current={lang === 'fr' ? 'true' : undefined}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          lang === 'fr' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        FR
      </a>
      <a
        href={enUrl}
        hrefLang="en"
        aria-current={lang === 'en' ? 'true' : undefined}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          lang === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        EN
      </a>
    </div>
  );
}
