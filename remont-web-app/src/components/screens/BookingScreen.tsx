import React, { useState } from 'react';
import { translations, Language } from '../../utils/translations';
import { Check, ArrowLeft, Send } from 'lucide-react';

interface BookingScreenProps {
  lang: Language;
  onNavigate: (tab: string) => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({ lang, onNavigate }) => {
  const t = translations[lang].booking;
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#F9F9F7] animate-fade-in">
        <div className="bg-white p-8 rounded-[40px] w-full max-w-sm flex flex-col items-center shadow-lg border border-slate-100">
          <div className="w-20 h-20 bg-[#FFB800] rounded-full flex items-center justify-center text-white mb-6 animate-scale-in shadow-xl shadow-[#FFB800]/20">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black mb-2 text-slate-900 leading-tight">{t.success.title}</h2>
          <p className="text-slate-400 mb-8 font-medium text-sm px-4">{t.success.text}</p>

          <button
            onClick={() => { setSubmitted(false); onNavigate('home'); }}
            className="w-full bg-slate-100 text-slate-900 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-colors"
          >
            {t.success.home}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen bg-[#F9F9F7]">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={() => onNavigate('home')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-900 mr-4">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-2xl font-extrabold text-slate-900">{t.title}</h2>
      </div>

      {/* Telegram Button */}
      <button
        className="w-full bg-[#24A1DE] text-white py-5 rounded-[24px] shadow-lg shadow-blue-400/20 mb-8 flex items-center justify-center font-bold active:scale-[0.98] transition-transform"
      >
        <Send size={20} className="mr-3" />
        {t.share_contact}
      </button>

      <div className="relative flex py-2 items-center mb-8">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">{t.or}</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide ml-2">{t.name}</label>
          <input
            placeholder={lang === 'ru' ? 'Алишер' : lang === 'en' ? 'Alisher' : 'Alisher'}
            required
            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-[#FFB800]/20"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide ml-2">{t.phone}</label>
          <input
            placeholder="+998 90 123 45 67"
            required
            type="tel"
            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-[#FFB800]/20"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FFB800] text-black rounded-2xl py-4 font-bold text-lg shadow-lg shadow-[#FFB800]/20 active:scale-[0.98] transition-transform disabled:opacity-70 flex items-center justify-center hover:bg-[#E5A600]"
          >
            {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t.submit}
          </button>
        </div>
      </form>
    </div>
  );
};
