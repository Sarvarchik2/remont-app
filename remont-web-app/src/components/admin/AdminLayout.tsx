import React, { useState } from 'react';
import { translations, Language } from '../../utils/translations';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Image, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Ruler,
  Hammer,
  LayoutTemplate
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  lang: Language;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  activeTab, 
  onNavigate, 
  lang,
  onLogout
}) => {
  const t = translations[lang].admin.nav;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'crm', label: t.crm, icon: Users },
    { id: 'projects', label: t.projects, icon: Briefcase },
    { id: 'portfolio', label: t.portfolio, icon: Image },
    { id: 'stories', label: t.stories, icon: LayoutTemplate },
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
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
             <span className="font-bold text-sm">R</span>
           </div>
           <span className="font-extrabold text-lg">Admin<span className="text-slate-400">Panel</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white text-slate-900 transform transition-transform duration-300 ease-in-out border-r border-slate-100
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 hidden md:flex items-center space-x-3 mb-4">
           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
             <Ruler size={20} />
           </div>
           <span className="font-black text-2xl tracking-tight">Remont<span className="text-slate-300">Uz</span></span>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[24px] transition-all duration-200 ${
                activeTab === item.id 
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
