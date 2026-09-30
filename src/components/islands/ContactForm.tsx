import { useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { routes, type Lang } from '../../i18n/ui';

interface Props {
  lang: Lang;
  contactEmail: string;
}

/**
 * Contact form with progressive enhancement:
 *  - No backend wired; form is captured client-side and a mailto:
 *    fallback opens the user's mail client with a pre-filled body.
 *  - Validation is local; success/error states are user-visible.
 *  - The form is also discoverable as plain HTML for crawlers.
 */
export default function ContactForm({ lang, contactEmail }: Props) {
  const fr = lang === 'fr';
  const [data, setData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  function validate() {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = fr ? 'Le nom est requis' : 'Name is required';
    if (!data.email.trim()) e.email = fr ? "L'email est requis" : 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = fr ? 'Email invalide' : 'Invalid email';
    if (!data.message.trim()) e.message = fr ? 'Le message est requis' : 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    if (!validate()) return;
    try {
      const subject = encodeURIComponent(fr ? 'Contact via le site GSC Pickleball' : 'Contact via the GSC Pickleball site');
      const body = encodeURIComponent(
        `${fr ? 'Nom' : 'Name'}: ${data.name}\n` +
        `${fr ? 'Email' : 'Email'}: ${data.email}\n\n` +
        `${data.message}`
      );
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
      setStatus('success');
      setData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  }

  const labelName = fr ? 'Nom' : 'Name';
  const labelEmail = 'Email';
  const labelMessage = fr ? 'Message' : 'Message';
  const labelSubmit = fr ? 'Envoyer le message' : 'Send message';

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">{labelName}</label>
        <input
          type="text" id="name" name="name" autoComplete="name" required
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">{labelEmail}</label>
        <input
          type="email" id="email" name="email" autoComplete="email" required
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">{labelMessage}</label>
        <textarea
          id="message" name="message" rows={6} required
          value={data.message}
          onChange={(e) => setData({ ...data, message: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none`}
        />
        {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
      </div>
      <button
        type="submit"
        className="btn-press w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl"
      >
        {labelSubmit}
      </button>
      <p className="text-xs text-gray-500 text-center">
        {fr ? 'Vos données servent uniquement à vous répondre. ' : 'Your data is only used to reply to you. '}
        <a href={routes.privacy[lang]} className="underline hover:text-teal-700">
          {fr ? 'Politique de confidentialité' : 'Privacy policy'}
        </a>
      </p>
      {status === 'success' && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border-2 rounded-lg text-green-800" style={{ borderColor: '#002b2b' }}>
          <CheckCircle size={20} />
          <span>{fr ? 'Votre client e-mail va s\'ouvrir pour finaliser l\'envoi.' : 'Your e-mail client will open to send the message.'}</span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border-2 rounded-lg text-red-800" style={{ borderColor: '#002b2b' }}>
          <AlertCircle size={20} />
          <span>{fr ? "Erreur lors de l'envoi. Écrivez-nous directement à " : 'Error. Please write to us directly at '}<a className="underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</span>
        </div>
      )}
    </form>
  );
}
