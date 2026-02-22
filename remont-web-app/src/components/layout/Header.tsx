import React from 'react';
import { Search, Bell, Lock } from 'lucide-react';
import { Language } from '../../utils/translations';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onAdminClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, onAdminClick }) => {
  return (
    <header className="px-4 py-4 bg-[#F9F9F7] sticky top-0 z-40 border-b border-slate-100">
      <div className="flex justify-between items-center">
        {/* Admin Lock - Hidden mostly or subtle */}
        <button 
          onClick={onAdminClick}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors border border-slate-100"
        >
          <Lock size={16} />
        </button>

        {/* Logo / Brand */}
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Remont<span className="text-primary">Uz</span>
          </span>
        </div>

        {/* Lang Switcher */}
        <button 
          onClick={() => setLang(lang === 'ru' ? 'uz' : 'ru')}
          className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm active:scale-95 transition-transform"
        >
          {lang === 'ru' ? 'RU' : 'UZ'}
        </button>
      </div>
    </header>
  );
};