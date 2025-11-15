import { Mail, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { Language } from '../types';
import { t } from '../translations';

interface ContactSectionProps {
  language: Language;
}


export default function ContactSection({ language }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = language === 'fr' ? 'Le nom est requis' : 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = language === 'fr' ? "L'email est requis" : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'fr' ? 'Email invalide' : 'Invalid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = language === 'fr' ? 'Le message est requis' : 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            {t('contact.title', language)}
          </h2>
          <p className="text-lg text-gray-700">
            {t('contact.intro', language)}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('contact.form.name', language)}
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('contact.form.email', language)}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('contact.form.message', language)}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.message ? 'border-red-300' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none`}
                />
                {errors.message && (
                  <p className="text-red-600 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {t('contact.form.submit', language)}
              </button>

              {status === 'success' && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border-2 rounded-lg text-green-800" style={{ borderColor: '#002b2b' }}>
                  <CheckCircle size={20} />
                  <span>{t('contact.form.success', language)}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border-2 rounded-lg text-red-800" style={{ borderColor: '#002b2b' }}>
                  <AlertCircle size={20} />
                  <span>{t('contact.form.error', language)}</span>
                </div>
              )}
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-sm border-2" style={{ borderColor: '#002b2b' }}>
              <h3 className="text-xl font-semibold mb-6 text-gray-900">
                {t('contact.info.title', language)}
              </h3>


              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {t('contact.info.email', language)}
                    </p>
                    <a
                      href="mailto:hello@genevasportsclub.ch"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      hello@genevasportsclub.ch
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {t('contact.info.phone', language)}
                    </p>
                    <a
                      href="tel:+41762141203"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      +41 76.214.12.03
                    </a>
                  </div>
                </div>
              <h3 className="text-xl font-semibold mb-6 text-gray-900">
                {t('contact.info.titlesession', language)}
              </h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {language === 'fr' ? 'Téléphone' : 'Phone'}
                    </p>
                    <a
                      href="tel:+41762141203"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      +41 78.882.68.10
                    </a>
                  </div>
                </div>


              </div>
            </div>

            <div className="bg-amber-50/90 backdrop-blur-sm p-6 rounded-2xl border-2" style={{ borderColor: '#002b2b' }}>
              <div className="flex gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t('contact.info.note', language)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
