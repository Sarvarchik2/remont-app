import React, { useState } from 'react';
import { translations, Language } from '../../utils/translations';
import {
  LayoutDashboard,
  Users,
  User,
  Briefcase,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  Ruler,
  Hammer,
  LayoutTemplate,
  ShoppingCart
} from 'lucide-react';
import logo from '../../assets/logo.png';
import logofull from '../../assets/logofull.png';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  onNavigate,
  lang,
  setLang,
  onLogout
}) => {
  const t = translations[lang].admin.nav;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'crm', label: t.crm, icon: Users },
    { id: 'users', label: t.users, icon: User },
    { id: 'projects', label: t.projects, icon: Briefcase },
    { id: 'portfolio', label: t.portfolio, icon: Image },
    { id: 'stories', label: t.stories, icon: LayoutTemplate },
    { id: 'catalog', label: t.catalog, icon: ShoppingCart },
    { id: 'services', label: t.services, icon: Hammer },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-white text-slate-900 p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Vicasa" className="h-8 w-8 object-contain" />
          <span className="font-extrabold text-lg">Admin<span className="text-slate-400">Panel</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors z-[110]">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <div className={`
        fixed inset-y-0 left-0 z-[100] w-72 bg-white text-slate-900 transform transition-transform duration-300 ease-in-out border-r border-slate-100 shadow-2xl
        md:relative md:translate-x-0 md:shadow-none md:z-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 hidden md:flex items-center mb-4">
          <img src={logofull} alt="Vicasa" className="h-10 object-contain" />
        </div>

        <nav className="p-4 pt-24 md:pt-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[24px] transition-all duration-200 ${activeTab === item.id
                ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 font-bold scale-[1.02]'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-50">
          <div className="flex bg-slate-100 p-1 rounded-full mb-4">
            {(['ru', 'uz', 'en'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex-1 text-center text-xs font-bold py-2 rounded-full transition-colors ${lang === l ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-6 py-4 rounded-[24px] text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors font-bold text-sm"
          >
            <LogOut size={20} />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-screen pb-20 md:pb-0 bg-[#F9F9F7]">
        <main className="max-w-7xl mx-auto w-full p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
