import { ExternalLink, Calendar, MapPin, Clock, CreditCard, CheckCircle, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useRef, useState } from 'react';

interface ParticipatePageSectionProps {
  language: Language;
}

export default function ParticipatePageSection({ language }: ParticipatePageSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setAnimationKey(prev => prev + 1);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const fr = language === 'fr';

  const steps = [
    {
      number: '01',
      title: fr ? 'Accéder à la page de l\'association' : 'Access the association page',
      description: fr
        ? "Cliquez sur le lien en bas de cette section pour accéder directement à la page du Geneva Sports Club sur Meetup."
        : "Click the link at the bottom of this section to go directly to the Geneva Sports Club page on Meetup.",
    },
    {
      number: '02',
      title: fr ? 'Parcourir les événements' : 'Browse the events',
      description: fr
        ? "Allez sur l'onglet « Événements » de cette page. Vous y trouverez tous les événements sportifs hebdomadaires publiés par l'association."
        : 'Go to the "Events" tab on that page. You will find all weekly sports events published by the association.',
    },
    {
      number: '03',
      title: fr ? 'Choisir votre session Pickleball' : 'Choose your Pickleball session',
      description: fr
        ? "Cliquez sur la session de Pickleball qui vous convient. Les sessions de Pickleball sont publiées de manière hebdomadaire. "
        : 'Click on the Pickleball session that suits you — Monday or Friday.',
    },
    {
      number: '04',
      title: fr ? 'Créer votre compte et finaliser l\'inscription' : 'Create your account and complete registration',
      description: fr
        ? "Appuyez sur le bouton « Rejoindre ». Meetup vous proposera de créer un compte — suivez les étapes et finalisez votre inscription. Prenez le temps de lire toutes les informations disponibles sur la session. C'est aussi simple que ça !"
        : 'Press the "Join" button. Meetup will prompt you to create an account — follow the steps and complete your registration. Take a moment to read all the information available about the session. It\'s that simple!',
    },
    {
      number: '05',
      title: fr ? 'À vos raquettes — on s\'occupe du reste !' : 'Grab your paddle — we handle the rest!',
      description: fr
        ? "Enregistrez la date et l'heure, et c'est parti ! Venez simplement avec des vêtements de sport et des chaussures adaptées : raquettes et balles sont fournis sur place. À très vite !"
        : "Save the date and time, and you're all set! Just come with sportswear and suitable shoes — paddles and balls are provided on site. See you soon!",
    },
  ];

  const infos = [
    {
      icon: Calendar,
      label: fr ? 'Jours' : 'Days',
      value: fr ? 'Lundi & Vendredi' : 'Monday & Friday',
    },
    {
      icon: MapPin,
      label: fr ? 'Lieu' : 'Location',
      value: 'La Jonction, Genève',
    },
    {
      icon: Clock,
      label: fr ? 'Niveaux' : 'Levels',
      value: fr ? 'Tous niveaux bienvenus' : 'All levels welcome',
    },
    {
      icon: CreditCard,
      label: fr ? 'Tarif' : 'Fee',
      value: fr ? '10 CHF / session — sans abonnement' : 'CHF 10 / session — no membership',
    },
  ];

  return (
    <section id="participate-page" className="py-20 px-4" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between mb-4">
          <div className="w-32 h-32 rotate-180">
            {isVisible && (
              <DotLottieReact
                key={`left-${animationKey}`}
                src="https://lottie.host/351c971b-23f8-419d-9f35-f44e03fe1e60/poVzdsh4zU.lottie"
                autoplay
                speed={0.5}
              />
            )}
          </div>
          <div className="w-32 h-32 rotate-180 scale-x-[-1]">
            {isVisible && (
              <DotLottieReact
                key={`right-${animationKey}`}
                src="https://lottie.host/351c971b-23f8-419d-9f35-f44e03fe1e60/poVzdsh4zU.lottie"
                autoplay
                speed={0.5}
              />
            )}
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            {fr ? 'Comment s\'inscrire ?' : 'How to participate?'}
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {fr
              ? "Pour jouer au Pickleball avec nous, c'est très simple : notre processus d'inscription est 100% en ligne via l'application Meetup. Tu ne connais pas Meetup ? Pas de souci, cette page t'explique comment t'inscrire à nos sessions ! Notre association sportive propose deux cours de Pickleball par semaine à Genève, ouvertes à tous les niveaux et à tout âge. Suis ces étapes simples pour rejoindre l'une de nos sessions."
              : 'Our sports association offers two Pickleball sessions per week in Geneva, open to all levels. Follow these simple steps to join one of our sessions.'}
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 overflow-hidden mb-12" style={{ borderColor: '#002b2b' }}>
          <div className="px-6 py-5" style={{ background: 'linear-gradient(to right, #003d3d, #005555)' }}>
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <CheckCircle size={22} />
              {fr ? "Comment s'inscrire — étape par étape" : 'How to register — step by step'}
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5 px-6 py-5 group hover:bg-teal-50/50 transition-colors">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                  style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
                >
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                    {step.title}
                    <ChevronRight size={16} className="text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center relative mb-12">
          <a
            href="https://www.meetup.com/genevasportsclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 relative z-10"
          >
            <Calendar size={24} />
            {fr ? 'Voir nos événements sur Meetup' : 'View our events on Meetup'}
            <ExternalLink size={20} />
          </a>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <DotLottieReact
              src="https://lottie.host/7214da79-8fa8-4cf5-9e96-52774d50fadb/jgzIfgVPpq.lottie"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {fr ? 'Informations' : 'Information'}
        </h3>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="flex flex-col gap-4">
            {infos.filter(info => info.label !== (fr ? 'Lieu' : 'Location')).map((info, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white/95 backdrop-blur-sm rounded-xl px-6 py-4 border-2 shadow-sm"
                style={{ borderColor: '#002b2b' }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <info.icon className="text-white" size={20} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-teal-600 mb-0.5">{info.label}</div>
                  <div className="font-semibold text-gray-900">{info.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="bg-white/95 backdrop-blur-sm rounded-xl border-2 shadow-sm overflow-hidden"
            style={{ borderColor: '#002b2b' }}
          >
            <div className="flex items-center gap-4 px-6 py-4 border-b-2" style={{ borderColor: '#002b2b' }}>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="text-white" size={20} />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-teal-600 mb-0.5">{fr ? 'Lieu' : 'Location'}</div>
                <div className="font-semibold text-gray-900">La Jonction, Genève</div>
              </div>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d972.9041837863234!2d6.131757773546468!3d46.19916515207607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c64d327cd68ab%3A0xd0f59537d67262eb!2s%C3%89cole%20de%20Cit%C3%A9-Jonction!5e0!3m2!1sfr!2sch!4v1773674166278!5m2!1sfr!2sch"
              width="100%"
              height="300"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
