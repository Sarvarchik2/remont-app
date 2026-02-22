import React from 'react';
import { translations, Language } from '../../../utils/translations';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Clock, 
  ChevronRight,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Package,
  Star,
  Activity
} from 'lucide-react';
import { Lead } from '../../../utils/mockData';

interface AdminDashboardProps {
  lang: Language;
  onNavigate?: (tab: string) => void;
  leads?: Lead[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang, onNavigate, leads = [] }) => {
  const t = translations[lang].admin.dashboard;

  const mainStats = [
    { 
      label: 'Активных проектов', 
      value: '8', 
      icon: Briefcase, 
      color: 'bg-primary text-primary-foreground',
      trend: '+2',
      subtitle: 'на этой неделе'
    },
    { 
      label: 'Новых лидов', 
      value: String(leads.filter(l => l.status === 'new').length), 
      icon: Users, 
      color: 'bg-white text-slate-900 border border-slate-200',
      trend: `+${leads.filter(l => l.status === 'new').length}`,
      subtitle: 'требуют обработки',
      isDark: false
    },
    { 
      label: 'Общая выручка', 
      value: '1.2B', 
      icon: DollarSign, 
      color: 'bg-white text-slate-900 border border-slate-200',
      trend: '+15%',
      subtitle: 'в этом месяце',
      isDark: false
    },
  ];

  const quickStats = [
    { label: 'Завершено проектов', value: '24', icon: CheckCircle2, color: 'text-slate-900', bg: 'bg-slate-100' },
    { label: 'В работе', value: '8', icon: Package, color: 'text-slate-900', bg: 'bg-slate-100' },
    { label: 'Ожидают оплату', value: '3', icon: AlertCircle, color: 'text-slate-900', bg: 'bg-slate-100' },
    { label: 'Средний рейтинг', value: '4.8', icon: Star, color: 'text-slate-900', bg: 'bg-slate-100' },
  ];

  const recentActivity = [
    { 
      time: '10:30', 
      user: 'Менеджер Азиз', 
      action: 'Обновил статус проекта ЖК Parkent',
      type: 'update',
      icon: Package
    },
    { 
      time: '09:45', 
      user: 'Прораб Рустам', 
      action: 'Загрузил 5 фото (ЖК City)',
      type: 'upload',
      icon: Activity
    },
    { 
      time: '09:15', 
      user: 'Система', 
      action: 'Новая заявка на замер #482',
      type: 'lead',
      icon: Users
    },
    { 
      time: 'Вчера', 
      user: 'Админ', 
      action: 'Изменил базовую цену за м2',
      type: 'settings',
      icon: DollarSign
    },
  ];

  const upcomingTasks = [
    { title: 'Встреча с клиентом ЖК Parkent', time: 'Сегодня, 14:00', priority: 'high' },
    { title: 'Проверка отчета по ЖК City', time: 'Сегодня, 16:30', priority: 'medium' },
    { title: 'Звонок новому лиду', time: 'Завтра, 10:00', priority: 'low' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            DASHBOARD
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Обзор</h1>
        </div>
        <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 w-fit">
          <Calendar size={18} className="text-slate-400" />
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Сегодня</p>
            <p className="text-sm font-bold text-slate-900">13 Фев 2026</p>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mainStats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`${stat.color} rounded-[32px] p-8 relative overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group`}
            onClick={() => onNavigate && onNavigate(idx === 0 ? 'projects' : idx === 1 ? 'crm' : 'projects')}
          >
            {/* Decoration for dark card */}
            {idx === 0 && (
               <>
                 <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10" />
                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10" />
               </>
            )}
            
            <div className="relative z-10 flex items-start justify-between h-full flex-col">
              <div className="w-full flex justify-between items-start mb-6">
                <div className={`w-12 h-12 ${idx === 0 ? 'bg-black/10 text-primary-foreground' : 'bg-slate-100 text-slate-900'} backdrop-blur-sm rounded-2xl flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <div className={`${idx === 0 ? 'bg-black/10 text-primary-foreground border-black/5' : 'bg-slate-100 text-slate-900 border-slate-200'} backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full border`}>
                  {stat.trend}
                </div>
              </div>
              
              <div>
                <div className="text-5xl font-black mb-2 tracking-tight">{stat.value}</div>
                <div className={`${idx === 0 ? 'text-primary-foreground/90' : 'text-slate-500'} font-bold text-sm mb-1`}>{stat.label}</div>
                <div className={`${idx === 0 ? 'text-primary-foreground/60' : 'text-slate-400'} text-xs font-medium`}>{stat.subtitle}</div>
              </div>
            </div>
            
            <div className={`absolute bottom-6 right-6 p-2 rounded-full ${idx === 0 ? 'bg-black/10 text-primary-foreground' : 'bg-slate-100 text-slate-400'} opacity-0 group-hover:opacity-100 transition-opacity`}>
              <ChevronRight size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} mb-4`}>
              <stat.icon size={22} />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tasks & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Calendar size={24} className="mr-3 text-slate-900" />
              Предстоящие задачи
            </h2>
            <button className="text-xs font-bold text-slate-400 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-full transition-colors">
              Все задачи
            </button>
          </div>
          
          <div className="space-y-3">
            {upcomingTasks.map((task, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group border border-transparent hover:border-slate-200">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  task.priority === 'high' ? 'bg-slate-900' : 
                  task.priority === 'medium' ? 'bg-slate-400' : 
                  'bg-slate-200'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 mb-1 group-hover:text-black transition-colors">{task.title}</p>
                  <p className="text-xs text-slate-500 font-medium">{task.time}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-slate-900 transition-colors shadow-sm">
                   <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Clock size={24} className="mr-3 text-slate-900" />
              {t.recent_activity}
            </h2>
            <button className="text-xs font-bold text-slate-400 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-full transition-colors">
              История
            </button>
          </div>
          
          <div className="space-y-6">
            {recentActivity.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground flex-shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    <log.icon size={18} />
                  </div>
                  {idx < recentActivity.length - 1 && (
                    <div className="w-0.5 h-full bg-slate-100 mt-2 min-h-[20px]" />
                  )}
                </div>
                <div className="flex-1 pt-1 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-slate-900">{log.user}</p>
                    <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">{log.time}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{log.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate && onNavigate('crm')}
          className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all active:scale-[0.99] text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Новый лид</p>
              <p className="text-sm text-slate-500 mt-1">Добавить клиента в базу</p>
            </div>
            <div className="ml-auto bg-slate-50 p-2 rounded-full text-slate-300 group-hover:text-black transition-colors">
               <ChevronRight size={20} />
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => onNavigate && onNavigate('projects')}
          className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all active:scale-[0.99] text-left group"
        >
          <div className="flex items-center space-x-4">
             <div className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 group-hover:border-primary transition-colors">
               <Briefcase size={24} />
             </div>
             <div>
               <p className="text-lg font-bold text-slate-900">Проекты</p>
               <p className="text-sm text-slate-500 mt-1">Управление текущими</p>
             </div>
             <div className="ml-auto bg-slate-50 p-2 rounded-full text-slate-300 group-hover:text-black transition-colors">
                <ChevronRight size={20} />
             </div>
          </div>
        </button>
      </div>
    </div>
  );
};
