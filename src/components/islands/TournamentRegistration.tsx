import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import {
  tournament,
  tournamentCopy,
  formatCHF,
  isValidPhone,
  normalizeSelection,
  priceSelection,
  type CategoryId,
} from '../../i18n/tournament';
import { routes, type Lang } from '../../i18n/ui';

interface Props {
  lang: Lang;
  contactEmail: string;
}

type Remaining = Partial<Record<CategoryId, number>>;
type Partner = { name: string; find: boolean };
type ErrorKey = 'category' | 'firstName' | 'lastName' | 'email' | 'phone' | 'paddle' | 'age' | 'noRefund' | `partner-${CategoryId}`;
type Errors = Partial<Record<ErrorKey, string>>;

const POLL_MS = 20_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function TournamentRegistration({ lang, contactEmail }: Props) {
  const t = tournamentCopy[lang];
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [selected, setSelected] = useState<CategoryId[]>([]);
  const [partners, setPartners] = useState<Partial<Record<CategoryId, Partner>>>({});
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [age, setAge] = useState(false);
  const [noRefund, setNoRefund] = useState(false);
  const [needsPaddle, setNeedsPaddle] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [banner, setBanner] = useState<'ok' | 'cancelled' | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/tournoi/places', { headers: { Accept: 'application/json' } });
      if (!res.ok) return;
      const data = await res.json();
      if (!data.available) return;
      const next: Remaining = {};
      for (const c of data.categories as { id: CategoryId; remaining: number }[]) next[c.id] = c.remaining;
      setRemaining(next);
      setTestMode(data.testMode === true);
    } catch {
      // Network hiccup: keep the last known values.
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, POLL_MS);
    const onVisible = () => document.visibilityState === 'visible' && refresh();
    document.addEventListener('visibilitychange', onVisible);

    const status = new URLSearchParams(window.location.search).get('inscription');
    if (status === 'ok') setBanner('ok');
    if (status === 'annulee') setBanner('cancelled');

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  // Back from Stripe: bring the confirmation (or cancellation) message into view.
  useEffect(() => {
    if (banner) bannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [banner]);

  // A draw that fills up while selected is dropped from the selection.
  useEffect(() => {
    if (!remaining) return;
    setSelected((sel) => sel.filter((id) => remaining[id] !== 0));
  }, [remaining]);

  const isFull = (id: CategoryId) => remaining?.[id] === 0;
  const draws = normalizeSelection(selected) ?? [];
  const price = draws.length ? priceSelection(draws) : null;
  const isCombo = Boolean(price?.discounted);
  // Draws that would complete the current single choice into a combo:
  // men/women → mixed, mixed → men or women. Full draws aren't suggested.
  const comboSuggestions =
    draws.length === 1
      ? tournament.categories.filter(
          (c) => c.id !== draws[0].id && !isFull(c.id) && normalizeSelection([draws[0].id, c.id]) !== null,
        )
      : [];

  /**
   * Toggle a draw. Adding one keeps the current choice only if the pair is an
   * allowed combo (men/women + mixed); otherwise the new draw replaces it.
   */
  function toggle(id: CategoryId, scroll = false) {
    if (isFull(id)) return;
    setSelected((sel) => {
      if (sel.includes(id)) return sel.filter((s) => s !== id);
      const withNew = [...sel, id];
      if (normalizeSelection(withNew)) return withNew;
      const kept = sel.filter((s) => normalizeSelection([s, id]));
      return kept.length ? [kept[0], id] : [id];
    });
    setErrors((e) => ({ ...e, category: undefined }));
    setServerError(null);
    if (scroll) formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const partnerOf = (id: CategoryId): Partner => partners[id] ?? { name: '', find: false };
  function setPartner(id: CategoryId, patch: Partial<Partner>) {
    setPartners((p) => ({ ...p, [id]: { ...partnerOf(id), ...patch } }));
    setErrors((e) => ({ ...e, [`partner-${id}`]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (draws.length === 0) e.category = t.errors.category;
    if (!form.firstName.trim()) e.firstName = t.errors.required;
    if (!form.lastName.trim()) e.lastName = t.errors.required;
    if (!form.email.trim()) e.email = t.errors.required;
    else if (!EMAIL_RE.test(form.email.trim())) e.email = t.errors.email;
    if (!form.phone.trim()) e.phone = t.errors.required;
    else if (!isValidPhone(form.phone)) e.phone = t.errors.phone;
    for (const d of draws.filter((d) => d.double)) {
      const p = partnerOf(d.id);
      if (!p.find && !p.name.trim()) e[`partner-${d.id}`] = t.errors.partner;
    }
    if (!age) e.age = t.errors.checkbox;
    if (needsPaddle === null) e.paddle = t.errors.choice;
    if (!noRefund) e.noRefund = t.errors.checkbox;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/tournoi/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draws: draws.map((d) => ({
            category: d.id,
            findPartner: d.double && partnerOf(d.id).find,
            partnerName: d.double ? partnerOf(d.id).name : '',
          })),
          ...form,
          age,
          noRefund,
          needsPaddle,
          lang,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.error === 'full') {
        setServerError(t.errors.full);
        refresh();
      } else if (data.error === 'unavailable') {
        setServerError(t.errors.unavailable);
      } else {
        setServerError(t.errors.generic);
      }
    } catch {
      setServerError(t.errors.generic);
    }
    setSubmitting(false);
  }

  const inputCls = (err?: string) =>
    'w-full px-4 py-3 rounded-xl border-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ' +
    (err ? 'border-red-400' : 'border-gray-200 focus:border-teal-500');

  const textField = (
    id: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
    err?: string,
    type = 'text',
    autoComplete?: string,
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800 mb-1.5">{label}</label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(err)}
        aria-describedby={err ? `${id}-err` : undefined}
        className={inputCls(err)}
      />
      {err && <p id={`${id}-err`} className="mt-1 text-sm text-red-600">{err}</p>}
    </div>
  );

  const field = (key: keyof typeof form, label: string, type = 'text', autoComplete?: string) =>
    textField(`t-${key}`, label, form[key], (v) => setForm((f) => ({ ...f, [key]: v })), errors[key], type, autoComplete);

  return (
    <div>
      {testMode && (
        <div role="note" className="mb-6 rounded-2xl bg-amber-50 text-amber-900 p-4 text-center font-semibold">
          {t.testModeBanner}
        </div>
      )}
      {banner && (
        <div
          ref={bannerRef}
          role="status"
          className={
            'mb-8 rounded-2xl p-5 md:p-6 ' +
            (banner === 'ok' ? 'bg-green-50 text-green-900' : 'bg-amber-50 text-amber-900')
          }
        >
          {banner === 'ok' ? (
            <>
              <p className="text-lg font-bold mb-1">{t.successTitle}</p>
              <p>{t.successText}</p>
            </>
          ) : (
            <p className="font-medium">{t.cancelledText}</p>
          )}
        </div>
      )}

      {/* Combo offer */}
      <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl bg-[#002b2b] text-white px-5 py-4 text-center">
        <span className="rounded-full bg-teal-400 text-[#002b2b] text-xs font-bold uppercase tracking-wider px-2.5 py-1">
          {t.comboSaving}
        </span>
        <p className="font-semibold">{t.comboBanner}</p>
      </div>

      {/* Draws with live counters */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {tournament.categories.map((c) => {
          const left = remaining?.[c.id];
          const full = left === 0;
          const pct = left === undefined ? 0 : Math.round(((c.capacity - left) / c.capacity) * 100);
          const active = selected.includes(c.id);
          return (
            <div
              key={c.id}
              className={
                'relative flex flex-col rounded-2xl border-2 p-5 transition-all ' +
                (full
                  ? 'bg-gray-100/95 border-gray-300'
                  : active
                    ? 'bg-white border-teal-500 shadow-lg ring-4 ring-teal-500/15'
                    : 'bg-white/95 border-[#002b2b] hover:shadow-md')
              }
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">
                {c.slot === 'morning' ? '☀️ ' : '🌇 '}{t.slots[c.slot]}
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{c.name[lang]}</h3>
              <p className="text-gray-700 mb-4">
                <span className="text-2xl font-bold text-gray-900">{formatCHF(c.priceCents, lang)}</span>{' '}
                <span className="text-sm">{t.perPerson}</span>
              </p>

              <div className="mt-auto">
                {full ? (
                  <div>
                    <p className="inline-block rounded-full bg-gray-800 text-white text-sm font-bold px-3 py-1 mb-2">{t.full}</p>
                    <p className="text-sm text-gray-700">
                      {t.fullNote}{' '}
                      <a className="text-teal-700 underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline justify-between text-sm mb-1.5" aria-live="polite">
                      <span className="font-semibold text-gray-900">
                        {left === undefined ? t.placesLoading : t.placesLeft(left)}
                      </span>
                      <span className="text-gray-500">{left === undefined ? `${c.capacity} places` : t.placesOf(c.capacity)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 overflow-hidden mb-4" aria-hidden="true">
                      <div
                        className={'h-full rounded-full transition-all duration-700 ' + (left !== undefined && left <= 5 ? 'bg-orange-500' : 'bg-teal-500')}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(c.id, !active)}
                      aria-pressed={active}
                      className={
                        'btn-press w-full rounded-xl py-2.5 font-semibold ' +
                        (active ? 'bg-teal-600 text-white' : 'bg-[#002b2b] text-white hover:bg-[#003d3d]')
                      }
                    >
                      {active ? `✓ ${t.chosen}` : t.choose}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">{t.conflictHint}</p>

      {/* Registration form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="mt-10 scroll-mt-24 bg-white/95 rounded-2xl border-2 border-[#002b2b] p-6 md:p-10 max-w-3xl mx-auto"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t.formTitle}</h3>
        <p className="text-gray-700 mb-8">{t.formLead}</p>

        <fieldset className="mb-6">
          <legend className="block text-sm font-semibold text-gray-800 mb-2">{t.fields.category}</legend>
          <div className="grid sm:grid-cols-2 gap-2">
            {tournament.categories.map((c) => {
              const checked = selected.includes(c.id);
              const full = isFull(c.id);
              return (
                <label
                  key={c.id}
                  className={
                    'flex items-start gap-2.5 rounded-xl border-2 px-3.5 py-3 ' +
                    (full
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : checked
                        ? 'border-teal-500 bg-teal-50/60 cursor-pointer'
                        : 'border-gray-200 bg-white cursor-pointer hover:border-teal-300')
                  }
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={full}
                    onChange={() => toggle(c.id)}
                    className="mt-0.5 h-5 w-5 accent-teal-600"
                  />
                  <span>
                    <span className="block font-semibold text-gray-900">{c.name[lang]}</span>
                    <span className="block text-sm text-gray-600">
                      {full ? t.full : t.slots[c.slot]}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
          {comboSuggestions.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              className="mt-3 w-full rounded-xl border-2 border-dashed border-teal-400 bg-teal-50/60 px-4 py-3 text-left text-teal-900 font-medium hover:bg-teal-50"
            >
              ➕ {t.comboHint(c.name[lang], t.slots[c.slot], formatCHF(priceSelection([draws[0], c]).totalCents, lang))}
            </button>
          ))}
        </fieldset>

        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {field('firstName', t.fields.firstName, 'text', 'given-name')}
          {field('lastName', t.fields.lastName, 'text', 'family-name')}
          {field('email', t.fields.email, 'email', 'email')}
          <div>
            {field('phone', t.fields.phone, 'tel', 'tel')}
            {!errors.phone && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.01c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43m8.03-17.46A11.3 11.3 0 0 0 12.05.7C5.8.7.7 5.79.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.4l5.81-1.52a11.3 11.3 0 0 0 5.63 1.44h.01c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02"/></svg>
                {t.fields.phoneHint}
              </p>
            )}
          </div>
        </div>

        {draws.filter((d) => d.double).map((d) => {
          const p = partnerOf(d.id);
          const err = errors[`partner-${d.id}`];
          return (
            <fieldset key={d.id} className="mb-5 rounded-xl bg-teal-50/70 p-5">
              <legend className="text-sm font-semibold text-gray-800 px-1">{t.fields.partner(d.name[lang])}</legend>
              <div className="flex flex-col sm:flex-row gap-3 mb-4 mt-1">
                {[
                  { value: false, label: t.fields.withPartner },
                  { value: true, label: t.fields.findPartner },
                ].map((opt) => (
                  <label
                    key={String(opt.value)}
                    className={
                      'flex-1 flex items-center gap-2 cursor-pointer rounded-xl border-2 px-4 py-3 bg-white ' +
                      (p.find === opt.value ? 'border-teal-500' : 'border-gray-200')
                    }
                  >
                    <input
                      type="radio"
                      name={`partner-mode-${d.id}`}
                      checked={p.find === opt.value}
                      onChange={() => setPartner(d.id, { find: opt.value })}
                      className="accent-teal-600"
                    />
                    <span className="font-medium text-gray-900">{opt.label}</span>
                  </label>
                ))}
              </div>
              {!p.find && (
                <>
                  {textField(
                    `t-partner-${d.id}`,
                    t.fields.partnerName,
                    p.name,
                    (v) => setPartner(d.id, { name: v }),
                    err,
                    'text',
                    'off',
                  )}
                  <p className="mt-1.5 text-sm text-gray-600">{t.fields.partnerHint}</p>
                </>
              )}
              {p.find && err && <p className="text-sm text-red-600">{err}</p>}
            </fieldset>
          );
        })}

        <fieldset className="mb-6">
          <legend className="block text-sm font-semibold text-gray-800 mb-2">{t.fields.paddle}</legend>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { value: true, label: t.fields.paddleYes },
              { value: false, label: t.fields.paddleNo },
            ].map((opt) => (
              <label
                key={String(opt.value)}
                className={
                  'flex-1 flex items-center gap-2 cursor-pointer rounded-xl border-2 px-4 py-3 bg-white ' +
                  (needsPaddle === opt.value ? 'border-teal-500' : errors.paddle ? 'border-red-400' : 'border-gray-200')
                }
              >
                <input
                  type="radio"
                  name="needs-paddle"
                  checked={needsPaddle === opt.value}
                  onChange={() => {
                    setNeedsPaddle(opt.value);
                    setErrors((er) => ({ ...er, paddle: undefined }));
                  }}
                  className="accent-teal-600"
                />
                <span className="font-medium text-gray-900">{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.paddle && <p className="mt-1 text-sm text-red-600">{errors.paddle}</p>}
        </fieldset>

        {price && (
          <div className="mb-6 rounded-xl border-2 border-gray-200 px-5 py-4">
            {draws.map((d) => (
              <div key={d.id} className="flex justify-between text-gray-700 py-0.5">
                <span>{d.name[lang]} <span className="text-gray-500 text-sm">· {t.slots[d.slot]}</span></span>
                <span className={isCombo ? 'line-through text-gray-400' : ''}>{formatCHF(d.priceCents, lang)}</span>
              </div>
            ))}
            <div className="flex justify-between items-baseline border-t border-gray-200 mt-2 pt-2">
              <span className="font-bold text-gray-900">
                {t.total}
                {isCombo && (
                  <span className="ml-2 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider px-2 py-0.5">
                    {t.comboSaving}
                  </span>
                )}
              </span>
              <span className="text-xl font-bold text-gray-900">{formatCHF(price.totalCents, lang)}</span>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-8">
          {[
            { key: 'age' as const, checked: age, set: setAge, label: t.fields.age },
            { key: 'noRefund' as const, checked: noRefund, set: setNoRefund, label: t.fields.noRefund },
          ].map((cb) => (
            <div key={cb.key}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cb.checked}
                  onChange={(e) => {
                    cb.set(e.target.checked);
                    setErrors((er) => ({ ...er, [cb.key]: undefined }));
                  }}
                  className="mt-1 h-5 w-5 accent-teal-600"
                />
                <span className="text-gray-800">{cb.label}</span>
              </label>
              {errors[cb.key] && <p className="mt-1 ml-8 text-sm text-red-600">{errors[cb.key]}</p>}
            </div>
          ))}
        </div>

        {serverError && (
          <div role="alert" className="mb-6 rounded-xl bg-red-50 text-red-800 p-4">
            {serverError}{' '}
            <a className="underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-press w-full rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-lg font-bold py-4 shadow-md"
        >
          {submitting ? t.submitting : price ? t.submit(formatCHF(price.totalCents, lang)) : t.ctaRegister}
        </button>
        <p className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          {t.secure}
        </p>
        <p className="mt-1 text-center text-xs text-gray-500">{t.holdNotice}</p>
        <p className="mt-1 text-center text-xs text-gray-500">
          {t.privacyNotice}{' '}
          <a href={routes.privacy[lang]} className="underline hover:text-teal-700">{t.privacyLink}</a>
        </p>
      </form>
    </div>
  );
}
