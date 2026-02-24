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
  onNavigate?: (tab: string, params?: any) => void;
  projects?: Project[];
  tgUser: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ lang, onNavigate, projects = [], tgUser }) => {
  const t = translations[lang].dashboard;
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Auto-login logic
  useEffect(() => {
    if (tgUser && projects.length > 0) {
      // Find project by telegramId
      const matchedProject = projects.find(p => p.telegramId === String(tgUser.id));
      if (matchedProject) {
        setCurrentProject(matchedProject);
      }
    }
  }, [tgUser, projects]);

  const handleProjectClick = () => {
    if (currentProject && onNavigate) {
      onNavigate('project_detail', { id: currentProject.id });
    }
  };

  const handleCallManager = () => {
    window.location.href = 'tel:+998901234567';
  };

  return (
    <div className="pb-32 px-4 pt-4 bg-[#F9F9F7] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">{lang === 'ru' ? 'профиль' : lang === 'en' ? 'profile' : 'profil'}</h1>
        <div className="w-10 h-10"></div> {/* Empty space for alignment */}
      </div>

      {/* Avatar & Stats */}
      <div className="bg-white rounded-[40px] p-8 mb-6 text-center shadow-sm border border-slate-100">
        <div className="w-28 h-28 mx-auto bg-primary rounded-full flex items-center justify-center text-primary-foreground text-4xl font-bold mb-6 shadow-xl shadow-primary/20 uppercase">
          {tgUser?.first_name ? tgUser.first_name.charAt(0) : 'U'}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {tgUser ? `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim() : (lang === 'ru' ? 'Загрузка...' : lang === 'en' ? 'Loading...' : 'Yuklanmoqda...')}
        </h2>

        {currentProject ? (
          <p className="text-slate-400 font-medium text-sm">{lang === 'ru' ? 'Договор №' : lang === 'en' ? 'Contract #' : 'Shartnoma №'}{currentProject.contractNumber}</p>
        ) : (
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full inline-block mt-1">
            Ваш ID: {tgUser?.id || '-'}
          </p>
        )}

        <div className="mt-8 flex items-center justify-center divide-x divide-slate-100">
          <div className="px-8 flex-1">
            <div className="text-2xl font-bold text-slate-900">{currentProject ? '1' : '0'}</div>
            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">{lang === 'ru' ? 'Проект' : lang === 'en' ? 'Project' : 'Loyiha'}</div>
          </div>
          <div className="px-8 flex-1">
            <div className="text-2xl font-bold text-slate-900">{currentProject?.timeline?.length || 0}</div>
            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">{lang === 'ru' ? 'Событий' : lang === 'en' ? 'Events' : 'Hodisalar'}</div>
          </div>
        </div>
      </div>

      {currentProject ? (
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
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mt-1 uppercase">
                      {typeof currentProject.status === 'string' ? (currentProject.status === 'process' ? 'В работе' : currentProject.status === 'finished' ? 'Завершен' : 'Новый') : 'В работе'}
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
      ) : (
        <div className="mb-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center text-slate-400 mb-6 transition-transform hover:scale-105">
              <Package size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
              {lang === 'ru' ? 'Нет активных проектов' : lang === 'en' ? 'No active projects' : 'Faol loyihalar yo\'q'}
            </h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              {lang === 'ru' ? 'Начните свой идеальный ремонт вместе с нами. Рассчитайте стоимость или запишитесь на бесплатный замер.' :
                lang === 'en' ? 'Start your perfect renovation with us. Calculate the cost or book a free measurement.' :
                  'Mukammal ta\'miringizni biz bilan boshlang. Narxni hisoblang yoki bepul o\'lchovga yoziling.'}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => onNavigate && onNavigate('calculator')}
                className="w-full bg-primary text-black rounded-2xl py-4 font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
              >
                {lang === 'ru' ? 'Рассчитать стоимость ремонта' : lang === 'en' ? 'Calculate Renovation Cost' : 'Ta\'mirlash narxini hisoblash'}
              </button>
              <button
                onClick={() => onNavigate && onNavigate('booking')}
                className="w-full bg-slate-100 text-slate-900 rounded-2xl py-4 font-bold text-sm hover:bg-slate-200 active:scale-[0.98] transition-all"
              >
                {lang === 'ru' ? 'Заказать бесплатный замер' : lang === 'en' ? 'Book Free Measurement' : 'Bepul o\'lchovni buyurtma qilish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Manager */}
      <div className="mb-6">
        <button
          onClick={handleCallManager}
          className="w-full bg-white p-6 rounded-[28px] flex items-center justify-between shadow-sm border border-slate-100 active:scale-[0.98] transition-transform hover:shadow-md group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Phone size={22} />
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-900 text-base block">{lang === 'ru' ? 'Связаться с менеджером' : lang === 'en' ? 'Contact manager' : 'Menejer bilan aloqa'}</span>
              <span className="text-sm text-slate-500 font-medium">+998 90 123 45 67</span>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
