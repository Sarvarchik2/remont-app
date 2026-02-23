import React, { useState, useEffect } from 'react';
import { translations, Language } from '../../utils/translations';
import { Project, Story, PortfolioItem, ServiceCategory } from '../../utils/types';
import {
  Lock,
  ChevronRight,
  Package,
  Phone,
  LogOut,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';

interface DashboardScreenProps {
  lang: Language;
  onNavigate?: (tab: string, projectId?: string) => void;
  projects?: Project[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ lang, onNavigate, projects = [] }) => {
  const t = translations[lang].dashboard;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contractId, setContractId] = useState('');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loginError, setLoginError] = useState('');
  const [tgUser, setTgUser] = useState<any>(null);

  useEffect(() => {
    // Check if running inside Telegram Web App
    const initDataUnsafe = (window as any)?.Telegram?.WebApp?.initDataUnsafe;

    if (initDataUnsafe && initDataUnsafe.user) {
      setTgUser(initDataUnsafe.user);
    } else {
      // Fallback for local testing in normal browser
      setTgUser({
        id: 123456789,
        first_name: lang === 'ru' ? 'Тестовый' : lang === 'en' ? 'Test' : 'Sinov',
        last_name: lang === 'ru' ? 'Пользователь' : lang === 'en' ? 'User' : 'Foydalanuvchi',
        username: 'test_user'
      });
    }
  }, []);

  const handleLogin = () => {
    const project = projects.find(p => p.contractNumber === contractId);
    if (project) {
      setCurrentProject(project);
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('NOT_FOUND');
    }
  };

  const handleProjectClick = () => {
    if (currentProject && onNavigate) {
      onNavigate('project_detail', currentProject.id);
    }
  };

  const handleCallManager = () => {
    window.location.href = 'tel:+998901234567';
  };

  // Login Screen (Minimalist B&W Style)
  if (!isAuthenticated || !currentProject) {
    return (
      <div className="flex flex-col min-h-[80vh] px-6 pt-12 bg-[#F9F9F7]">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-12">{lang === 'ru' ? 'профиль' : lang === 'en' ? 'profile' : 'profil'}</h1>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-900 mb-6 border border-slate-100">
            <Lock size={32} />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {tgUser ? (lang === 'ru' ? `Привет, ${tgUser.first_name}!` : lang === 'en' ? `Hello, ${tgUser.first_name}!` : `Salom, ${tgUser.first_name}!`) : (lang === 'ru' ? 'Вход в кабинет' : lang === 'en' ? 'Login' : 'Kabinetga kirish')}
          </h2>
          <p className="text-slate-400 text-sm mb-8">{lang === 'ru' ? 'Введите номер вашего договора для доступа к материалам проекта' : lang === 'en' ? 'Enter your contract number to access project materials' : 'Loyiha materiallariga kirish uchun shartnoma raqamingizni kiriting'}</p>

          <div className="w-full space-y-4">
            <input
              placeholder={lang === 'ru' ? 'Номер договора (145)' : lang === 'en' ? 'Contract Number (145)' : 'Shartnoma raqami (145)'}
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-center text-lg font-bold outline-none focus:ring-2 focus:ring-black/5 placeholder:text-slate-300"
            />
            {loginError && (
              <p className="text-red-500 text-xs font-bold">
                {loginError === 'NOT_FOUND'
                  ? (lang === 'ru' ? 'Договор не найден (попробуйте 145)' : lang === 'en' ? 'Contract not found (try 145)' : 'Shartnoma topilmadi (145 ni sinab ko\'ring)')
                  : loginError}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={contractId.length < 2}
              className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-lg active:scale-95 transition-transform disabled:opacity-50 hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              {lang === 'ru' ? 'Войти' : lang === 'en' ? 'Login' : 'Kirish'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile Screen (Authenticated)
  return (
    <div className="pb-32 px-4 pt-4 bg-[#F9F9F7] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">{lang === 'ru' ? 'профиль' : lang === 'en' ? 'profile' : 'profil'}</h1>
        <button onClick={() => setIsAuthenticated(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-900 hover:bg-slate-50 transition-colors border border-slate-100">
          <LogOut size={18} />
        </button>
      </div>

      {/* Avatar & Stats */}
      <div className="bg-white rounded-[40px] p-8 mb-6 text-center shadow-sm border border-slate-100">
        <div className="w-28 h-28 mx-auto bg-primary rounded-full flex items-center justify-center text-primary-foreground text-4xl font-bold mb-6 shadow-xl shadow-primary/20">
          {(typeof currentProject.clientName === 'string' ? currentProject.clientName : (currentProject.clientName as any)?.[lang] || (currentProject.clientName as any)?.ru || '').charAt(0)}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {typeof currentProject.clientName === 'string' ? currentProject.clientName : (currentProject.clientName as any)?.[lang] || (currentProject.clientName as any)?.ru}
        </h2>
        <p className="text-slate-400 font-medium text-sm">{lang === 'ru' ? 'Договор №' : lang === 'en' ? 'Contract #' : 'Shartnoma №'}{currentProject.contractNumber}</p>

        <div className="mt-8 flex items-center justify-center divide-x divide-slate-100">
          <div className="px-8">
            <div className="text-2xl font-bold text-slate-900">1</div>
            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">{lang === 'ru' ? 'Проект' : lang === 'en' ? 'Project' : 'Loyiha'}</div>
          </div>
          <div className="px-8">
            <div className="text-2xl font-bold text-slate-900">{currentProject.timeline.length}</div>
            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">{lang === 'ru' ? 'Событий' : lang === 'en' ? 'Events' : 'Hodisalar'}</div>
          </div>
        </div>
      </div>

      {/* My Project Card */}
      <div className="mb-3">
        <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-3 px-1">
          {lang === 'ru' ? 'Мой проект' : lang === 'en' ? 'My Project' : 'Mening loyiham'}
        </h3>
        <button
          onClick={handleProjectClick}
          className="w-full bg-white rounded-[28px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground">
                  <Package size={24} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 text-base">{lang === 'ru' ? 'мой проект' : lang === 'en' ? 'my project' : 'mening loyiham'}</h4>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mt-1">
                    {lang === 'ru' ? 'В РАБОТЕ' : lang === 'en' ? 'IN PROGRESS' : 'JARAYONDA'}
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center text-slate-600 text-sm">
                <MapPin size={16} className="mr-2 text-slate-400" />
                <span>{typeof currentProject.address === 'string' ? currentProject.address : (currentProject.address as any)?.[lang] || (currentProject.address as any)?.ru}</span>
              </div>
              <div className="flex items-center text-slate-600 text-sm">
                <Calendar size={16} className="mr-2 text-slate-400" />
                <span>{lang === 'ru' ? 'Этап:' : lang === 'en' ? 'Stage:' : 'Bosqich:'} {typeof currentProject.currentStage === 'string' ? currentProject.currentStage : (currentProject.currentStage as any)?.[lang] || (currentProject.currentStage as any)?.ru}</span>
              </div>
              <div className="flex items-center text-slate-600 text-sm">
                <DollarSign size={16} className="mr-2 text-slate-400" />
                <span className="font-bold">{lang === 'ru' ? 'Оплачено:' : lang === 'en' ? 'Paid:' : 'To\'langan:'} {(currentProject.finance?.paid || 0).toLocaleString('ru-RU')} {lang === 'ru' ? 'сум' : lang === 'en' ? 'sum' : 'so\'m'}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pb-6">
            <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${currentProject.finance ? Math.round((currentProject.finance.paid / currentProject.finance.total) * 100) : 0}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>{lang === 'ru' ? 'Прогресс оплаты' : lang === 'en' ? 'Payment progress' : 'To\'lov jarayoni'}</span>
              <span className="font-bold">{currentProject.finance ? Math.round((currentProject.finance.paid / currentProject.finance.total) * 100) : 0}%</span>
            </div>
          </div>
        </button>
      </div>

      {/* Contact Manager */}
      <div className="mb-6">
        <button
          onClick={handleCallManager}
          className="w-full bg-white p-6 rounded-[28px] flex items-center justify-between shadow-sm border border-slate-100 active:scale-[0.98] transition-transform hover:shadow-md"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground">
              <Phone size={22} />
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-900 text-base block">{lang === 'ru' ? 'связь с менеджером' : lang === 'en' ? 'contact manager' : 'menejer bilan aloqa'}</span>
              <span className="text-sm text-slate-500 font-medium">+998 90 123 45 67</span>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300" />
        </button>
      </div>
    </div>
  );
};
