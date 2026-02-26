import React from 'react';
import { Home, Calculator, Image, User, LayoutGrid, ClipboardList, BookOpen } from 'lucide-react';
import { Language } from '../../utils/translations';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
  labels: any;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, lang, labels }) => {
  const navItems = [
    { id: 'home', icon: Home, label: labels.home },
    { id: 'services', icon: ClipboardList, label: labels.services },
    { id: 'catalog', icon: LayoutGrid, label: labels.catalog },
    { id: 'calc', icon: Calculator, label: labels.calc },
    { id: 'portfolio', icon: Image, label: labels.portfolio },
    { id: 'dashboard', icon: User, label: labels.dashboard },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-white rounded-[32px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] px-1 py-2 flex justify-between items-center border border-slate-100">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300 ${isActive
                    ? 'text-primary scale-105'
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <div className={`flex items-center justify-center w-10 h-8 rounded-full mb-0.5 transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-lg' : ''}`}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {/* <span className={`text-[9px] font-bold ${isActive ? 'text-primary' : 'text-transparent scale-0'} transition-all duration-300 absolute -bottom-5`}>
                   {item.label}
                </span> */}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
