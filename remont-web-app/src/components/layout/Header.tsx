import React from 'react';
import { Search, Bell, Lock } from 'lucide-react';
import { Language } from '../../utils/translations';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  return (
    <header className="px-4 py-4 bg-[#F9F9F7] sticky top-0 z-40 border-b border-slate-100">
      <div className="flex justify-between items-center">
        {/* Left Spacer for centering */}
        <div className="w-10 h-10" />

        {/* Logo / Brand */}
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Remont<span className="text-primary">Uz</span>
          </span>
        </div>

        {/* Lang Switcher - Cycle through ru -> uz -> en -> ru */}
        <button
          onClick={() => {
            const nextLang = lang === 'ru' ? 'uz' : lang === 'uz' ? 'en' : 'ru';
            setLang(nextLang);
          }}
          className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm active:scale-95 transition-transform uppercase"
        >
          {lang}
        </button>
      </div>
    </header>
  );
};