import { useEffect, useState } from 'react';
import { tournamentCopy } from '../../i18n/tournament';
import type { Lang } from '../../i18n/ui';

interface Props {
  lang: Lang;
  startISO: string;
  endISO: string;
  /** Days remaining at build time, rendered before hydration (no layout shift, crawlable). */
  initialDays: number;
}

function remaining(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    ms,
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function Countdown({ lang, startISO, endISO, initialDays }: Props) {
  const t = tournamentCopy[lang];
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  const [now, setNow] = useState<ReturnType<typeof remaining> | null>(null);

  useEffect(() => {
    const tick = () => setNow(remaining(start));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [start]);

  if (now && now.ms === 0) {
    const message = Date.now() < end + 3_600_000 ? t.countdownToday : t.countdownOver;
    return <p className="text-xl md:text-2xl font-semibold text-white">{message}</p>;
  }

  const units = [
    { value: now ? String(now.days) : String(initialDays), label: t.countdownUnits.days, main: true },
    { value: now ? pad(now.hours) : '--', label: t.countdownUnits.hours },
    { value: now ? pad(now.minutes) : '--', label: t.countdownUnits.minutes },
    { value: now ? pad(now.seconds) : '--', label: t.countdownUnits.seconds },
  ];

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.2em] text-teal-200 mb-3">{t.countdownLabel}</p>
      <div className="flex items-stretch justify-center gap-2 sm:gap-3" role="timer" aria-live="off">
        {units.map((u) => (
          <div
            key={u.label}
            className={
              u.main
                ? 'min-w-[6.5rem] sm:min-w-[8rem] rounded-2xl bg-white text-[#002b2b] px-4 py-3 shadow-lg'
                : 'min-w-[4.25rem] sm:min-w-[5.5rem] rounded-2xl bg-white/10 border border-white/25 text-white px-2 sm:px-3 py-3'
            }
          >
            <div
              className={
                (u.main ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-4xl') +
                ' font-bold tabular-nums leading-none'
              }
            >
              {u.value}
            </div>
            <div className={'mt-2 text-xs sm:text-sm ' + (u.main ? 'font-semibold text-teal-700' : 'text-white/75')}>
              {u.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
