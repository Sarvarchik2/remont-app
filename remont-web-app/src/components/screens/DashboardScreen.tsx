import React, { useState } from 'react';
import { translations, Language } from '../../utils/translations';
import { MOCK_PROJECTS, Project } from '../../utils/mockData';
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
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ lang, onNavigate }) => {
  const t = translations[lang].dashboard;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contractId, setContractId] = useState('');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loginError, setLoginError] = useState('');

  const handleLogin = () => {
    const project = MOCK_PROJECTS.find(p => p.contractNumber === contractId);
    if (project) {
      setCurrentProject(project);
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Договор не найден (попробуйте 145)');
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
        <h1 className="text-3xl font-extrabold text-slate-900 mb-12">профиль</h1>
        
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-900 mb-6 border border-slate-100">
            <Lock size={32} />
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 mb-2">Вход в кабинет</h2>
          <p className="text-slate-400 text-sm mb-8">Введите номер вашего договора для доступа к материалам проекта</p>
          
          <div className="w-full space-y-4">
            <input 
              placeholder="Номер договора (145)"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-center text-lg font-bold outline-none focus:ring-2 focus:ring-black/5 placeholder:text-slate-300"
            />
            {loginError && <p className="text-red-500 text-xs font-bold">{loginError}</p>}
            
            <button 
              onClick={handleLogin}
              disabled={contractId.length < 2}
              className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-lg active:scale-95 transition-transform disabled:opacity-50 hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              Войти
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
         <h1 className="text-3xl font-extrabold text-slate-900">профиль</h1>
         <button onClick={() => setIsAuthenticated(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-900 hover:bg-slate-50 transition-colors border border-slate-100">
           <LogOut size={18} />
         </button>
      </div>

      {/* Avatar & Stats */}
      <div className="bg-white rounded-[40px] p-8 mb-6 text-center shadow-sm border border-slate-100">
        <div className="w-28 h-28 mx-auto bg-primary rounded-full flex items-center justify-center text-primary-foreground text-4xl font-bold mb-6 shadow-xl shadow-primary/20">
          {currentProject.clientName.charAt(0)}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentProject.clientName}</h2>
        <p className="text-slate-400 font-medium text-sm">Договор №{currentProject.contractNumber}</p>

        <div className="mt-8 flex items-center justify-center divide-x divide-slate-100">
          <div className="px-8">
            <div className="text-2xl font-bold text-slate-900">1</div>
            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Проект</div>
          </div>
          <div className="px-8">
            <div className="text-2xl font-bold text-slate-900">{currentProject.timeline.length}</div>
            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Событий</div>
          </div>
        </div>
      </div>

      {/* My Project Card */}
      <div className="mb-3">
        <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-3 px-1">
          Мой проект
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
                  <h4 className="font-bold text-slate-900 text-base">мой проект</h4>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mt-1">
                    В РАБОТЕ
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center text-slate-600 text-sm">
                <MapPin size={16} className="mr-2 text-slate-400" />
                <span>{currentProject.address}</span>
              </div>
              <div className="flex items-center text-slate-600 text-sm">
                <Calendar size={16} className="mr-2 text-slate-400" />
                <span>Этап: {currentProject.stage || currentProject.currentStage}</span>
              </div>
              <div className="flex items-center text-slate-600 text-sm">
                <DollarSign size={16} className="mr-2 text-slate-400" />
                <span className="font-bold">Оплачено: {(currentProject.finance?.paid || 0).toLocaleString('ru-RU')} сум</span>
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
              <span>Прогресс оплаты</span>
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
              <span className="font-bold text-slate-900 text-base block">связь с менеджером</span>
              <span className="text-sm text-slate-500 font-medium">+998 90 123 45 67</span>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300" />
        </button>
      </div>
    </div>
  );
};
