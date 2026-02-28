import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { CalculatorScreen } from './components/screens/CalculatorScreen';
import { PortfolioScreen } from './components/screens/PortfolioScreen';
import { ProjectDetailScreen } from './components/screens/ProjectDetailScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { BookingScreen } from './components/screens/BookingScreen';
import { ServicesScreen } from './components/screens/ServicesScreen';
import { CatalogScreen } from './components/screens/CatalogScreen';
import { ProductDetailScreen } from './components/screens/ProductDetailScreen';
import { PortfolioDetailScreen } from './components/screens/PortfolioDetailScreen';
import { translations, Language } from './utils/translations';
import { Lead, Story, Project, PortfolioItem, ServiceCategory, CatalogItem, AppUser } from './utils/types';
import { INITIAL_CALCULATOR_PRICES } from './utils/constants';
import { Toaster, toast } from 'sonner';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/screens/AdminDashboard';
import { AdminCRM } from './components/admin/screens/AdminCRM';
import { AdminProjects } from './components/admin/screens/AdminProjects';
import { AdminPortfolio } from './components/admin/screens/AdminPortfolio';
import { AdminServices } from './components/admin/screens/AdminServices';
import { AdminSettings } from './components/admin/screens/AdminSettings';
import { AdminStories } from './components/admin/screens/AdminStories';
import { AdminCatalog } from './components/admin/screens/AdminCatalog';
import { AdminUsers } from './components/admin/screens/AdminUsers';
import { Lock, ArrowLeft } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('ru');
  const initialViewMode = window.location.pathname === '/admin' || window.location.hash === '#admin' || window.location.search.includes('admin=true') ? 'admin_login' : 'client';
  const [viewMode, setViewMode] = useState<'client' | 'admin_login' | 'admin'>(initialViewMode);

  // Client State
  const [activeTab, setActiveTab] = useState('home');
  const [currentProjectId, setCurrentProjectId] = useState<number | undefined>(undefined);
  const [currentPortfolioId, setCurrentPortfolioId] = useState<number | undefined>(undefined);
  const [currentProductId, setCurrentProductId] = useState<string | undefined>(undefined);

  // Admin State
  const [adminTab, setAdminTab] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);

  // Calculator Prices State
  const [calculatorPrices, setCalculatorPrices] = useState(INITIAL_CALCULATOR_PRICES);

  // Stories State
  const [stories, setStories] = useState<Story[]>([]);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);

  // Portfolio State
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  // Services State
  const [services, setServices] = useState<ServiceCategory[]>([]);

  // Catalog State
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);

  // Users State
  const [users, setUsers] = useState<any[]>([]);

  // User State
  const [tgUser, setTgUser] = useState<any>(null);

  useEffect(() => {
    const initDataUnsafe = (window as any)?.Telegram?.WebApp?.initDataUnsafe;
    let user = null;

    if (initDataUnsafe && initDataUnsafe.user) {
      user = initDataUnsafe.user;
    } else {
      // Fallback for local testing
      user = {
        id: 123456789,
        first_name: lang === 'ru' ? 'Тестовый' : lang === 'en' ? 'Test' : 'Sinov',
        last_name: lang === 'ru' ? 'Пользователь' : lang === 'en' ? 'User' : 'Foydalanuvchi',
        username: 'test_user'
      };
    }
    setTgUser(user);
    if (user) {
      handleRegisterUser(user);
    }
  }, [lang]);

  const handleRegisterUser = async (user: any) => {
    try {
      await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id: String(user.id),
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name
        })
      });
    } catch (e) {
      console.error("User registration failed", e);
    }
  };

  // --- Backend Sync Logic ---
  useEffect(() => {
    const initData = async () => {
      try {
        const url = '/api/v1';

        const settingsRes = await fetch(`${url}/settings/`);
        const settingsData = await settingsRes.json();
        if (settingsData.length === 0 || !Array.isArray(settingsData[0]?.prices)) {
          await fetch(`${url}/settings/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: 1, prices: INITIAL_CALCULATOR_PRICES }) });
          setCalculatorPrices(INITIAL_CALCULATOR_PRICES);
        } else {
          setCalculatorPrices(settingsData[0].prices);
        }

        const fetchFeature = async (path: string, setState: React.Dispatch<any>) => {
          const res = await fetch(`${url}/${path}/`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setState(data);
            }
          }
        };

        await Promise.all([
          fetchFeature('leads', setLeads),
          fetchFeature('stories', setStories),
          fetchFeature('projects', setProjects),
          fetchFeature('portfolio', setPortfolio),
          fetchFeature('services', setServices),
          fetchFeature('catalog', setCatalog),
          fetchFeature('users', setUsers)
        ]);

      } catch (error) {
        console.error("Backend sync failed", error);
        toast.error('Ошибка соединения с сервером', {
          description: 'Не удалось загрузить данные',
          duration: 5000,
        });
      }
    };
    initData();
  }, []);

  // --- Client Navigation ---
  const handleClientNavigate = (tab: string, params?: any) => {
    if (tab === 'project_detail') {
      setCurrentProjectId(typeof params === 'string' ? params : params?.id);
    }
    if (tab === 'portfolio_detail') {
      setCurrentPortfolioId(params?.id);
    }
    if (tab === 'product_detail') {
      setCurrentProductId(params?.id);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const globalStyles = (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Manrope', sans-serif;
          background-color: #F9F9F7;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .pb-safe-bottom {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
  );

  // --- Lead Management ---
  const handleSubmitLead = async (lead: Lead) => {
    try {
      await fetch('/api/v1/leads/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
      setLeads((prev: Lead[]) => {
        // If lead already exists (by ID), update it, otherwise prepend
        const exists = prev.some(l => l.id === lead.id);
        if (exists) {
          return prev.map(l => l.id === lead.id ? lead : l);
        }
        return [lead, ...prev];
      });
    } catch (e) {
      console.error('Error posting lead:', e);
      // Fallback to local state if backend is down
      setLeads((prev: Lead[]) => [lead, ...prev]);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, status: Lead['status']) => {
    const lead = leads.find((l: Lead) => l.id === leadId);
    if (lead) {
      const updatedLead = { ...lead, status };
      await handleSubmitLead(updatedLead);
    }
  };

  // --- Admin Logic ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setViewMode('admin');
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Неверный логин или пароль');
    }
  };

  const handleAdminNavigate = (tab: string) => {
    setAdminTab(tab);
  };

  // Helper for proxying React state updates directly to the FastAPI backend
  // Replicates SetStateAction behavior (accepting values or updater functions)
  const createProxySetter = <T,>(
    originalSetter: React.Dispatch<React.SetStateAction<T>>,
    endpoint: string,
    isBatch: boolean = true
  ): React.Dispatch<React.SetStateAction<T>> => {
    return (action: React.SetStateAction<T>) => {
      originalSetter((prev) => {
        const newValue = typeof action === 'function' ? (action as any)(prev) : action;

        // Perform background sync to backend
        Promise.resolve().then(async () => {
          try {
            await fetch(`/api/v1/${endpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(isBatch ? newValue : newValue),
            });
          } catch (e) {
            console.error('Failed to sync state:', e);
          }
        });

        return newValue;
      });
    };
  };

  const proxySetProjects = createProxySetter(setProjects, 'projects/batch');
  const proxySetPortfolio = createProxySetter(setPortfolio, 'portfolio/batch');
  const proxySetStories = createProxySetter(setStories, 'stories/batch');
  const proxySetServices = createProxySetter(setServices, 'services/batch');
  const proxySetCatalog = createProxySetter(setCatalog, 'catalog/batch');
  const proxySetPrices = createProxySetter(setCalculatorPrices, 'settings/', false);

  const renderAdminScreen = () => {
    switch (adminTab) {
      case 'dashboard': return <AdminDashboard lang={lang} onNavigate={handleAdminNavigate} leads={leads} projects={projects} />;
      case 'crm': return <AdminCRM lang={lang} leads={leads} onUpdateLeadStatus={handleUpdateLeadStatus} prices={calculatorPrices} />;
      case 'users': return <AdminUsers lang={lang} users={users} />;
      case 'projects': return <AdminProjects lang={lang} projects={projects} onUpdateProjects={proxySetProjects} users={users} />;
      case 'portfolio': return <AdminPortfolio lang={lang} portfolio={portfolio} onUpdatePortfolio={proxySetPortfolio} />;
      case 'stories': return <AdminStories lang={lang} stories={stories} onUpdateStories={proxySetStories} />;
      case 'catalog': return <AdminCatalog lang={lang} catalog={catalog} onUpdateCatalog={proxySetCatalog} />;
      case 'services': return <AdminServices lang={lang} categories={services} onUpdateCategories={proxySetServices} />;
      case 'settings': return <AdminSettings lang={lang} prices={calculatorPrices} onUpdatePrices={proxySetPrices} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <div className="text-4xl mb-4">🚧</div>
          <p>Раздел {adminTab} в разработке</p>
        </div>
      );
    }
  };

  // --- Render ---

  // 1. Admin Login Screen
  if (viewMode === 'admin_login') {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center p-6 animate-fade-in">
        <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-xl border border-slate-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground mb-6 border border-slate-100">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-center text-slate-900 mb-2 leading-tight">Админ-панель</h2>
          <p className="text-slate-400 text-sm font-medium mb-8 text-center">Доступ только для сотрудников</p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-center text-lg font-bold outline-none focus:ring-2 focus:ring-black/5 placeholder:text-slate-300 placeholder:font-normal"
                autoFocus
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-center text-lg font-bold outline-none focus:ring-2 focus:ring-black/5 placeholder:text-slate-300 placeholder:font-normal"
              />
              {loginError && <p className="text-red-500 text-xs font-bold text-center mt-2">{loginError}</p>}
            </div>

            <button type="submit" className="w-full bg-[#FFB800] text-black rounded-2xl py-4 font-bold text-lg shadow-lg shadow-[#FFB800]/20 active:scale-95 transition-transform">
              Войти
            </button>

            <button
              type="button"
              onClick={() => setViewMode('client')}
              className="w-full flex items-center justify-center text-slate-400 text-sm font-bold hover:text-slate-900 py-2 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Вернуться назад
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Admin Panel
  if (viewMode === 'admin') {
    return (
      <>
        {globalStyles}
        <AdminLayout
          activeTab={adminTab}
          onNavigate={handleAdminNavigate}
          lang={lang}
          onLogout={() => setViewMode('client')}
        >
          {renderAdminScreen()}
        </AdminLayout>
        <Toaster position="top-center" richColors />
      </>
    );
  }

  // 3. Client App
  const showBottomNav = ['home', 'calc', 'portfolio', 'dashboard', 'services', 'catalog'].includes(activeTab);

  return (
    <>
      {globalStyles}
      <div className="min-h-screen text-slate-900 font-sans">
        {activeTab !== 'booking' && activeTab !== 'project_detail' && (
          <Header
            lang={lang}
            setLang={setLang}
          />
        )}

        <main className={`max-w-md mx-auto w-full ${activeTab === 'project_detail' ? '' : 'pt-4'}`}>
          {activeTab === 'home' && (
            <HomeScreen
              lang={lang}
              onNavigate={handleClientNavigate}
              stories={stories}
              portfolio={portfolio}
              services={services}
            />
          )}
          {activeTab === 'calc' && (
            <CalculatorScreen
              lang={lang}
              onNavigate={handleClientNavigate}
              onSubmitLead={handleSubmitLead}
              prices={calculatorPrices}
              tgUser={tgUser}
            />
          )}
          {activeTab === 'services' && (
            <ServicesScreen
              lang={lang}
              onNavigate={handleClientNavigate}
              categories={services}
            />
          )}
          {activeTab === 'catalog' && (
            <CatalogScreen
              lang={lang}
              onNavigate={handleClientNavigate}
              catalog={catalog}
            />
          )}
          {activeTab === 'product_detail' && (
            <ProductDetailScreen
              lang={lang}
              onNavigate={handleClientNavigate}
              productId={currentProductId || ''}
              catalog={catalog}
              tgUser={tgUser}
              onSubmitLead={handleSubmitLead}
            />
          )}
          {activeTab === 'portfolio' && (
            <PortfolioScreen
              lang={lang}
              onNavigate={handleClientNavigate}
              portfolio={portfolio}
            />
          )}
          {activeTab === 'portfolio_detail' && (
            <PortfolioDetailScreen
              lang={lang}
              onNavigate={handleClientNavigate}
              projectId={currentPortfolioId!}
              portfolio={portfolio}
            />
          )}
          {activeTab === 'project_detail' && (
            <ProjectDetailScreen
              lang={lang}
              onNavigate={handleClientNavigate}
              projectId={currentProjectId}
              projects={projects}
            />
          )}
          {activeTab === 'dashboard' && (
            <DashboardScreen
              lang={lang}
              onNavigate={handleClientNavigate}
              projects={projects}
              tgUser={tgUser}
            />
          )}
          {activeTab === 'booking' && (
            <BookingScreen
              lang={lang}
              onNavigate={handleClientNavigate}
              onSubmitLead={handleSubmitLead}
              tgUser={tgUser}
            />
          )}
          {!['home', 'calc', 'services', 'catalog', 'product_detail', 'portfolio', 'portfolio_detail', 'project_detail', 'dashboard', 'booking'].includes(activeTab) && (
            <HomeScreen
              lang={lang}
              onNavigate={handleClientNavigate}
              stories={stories}
              portfolio={portfolio}
              services={services}
            />
          )}
        </main>

        {showBottomNav && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={handleClientNavigate}
            lang={lang}
            labels={translations[lang].nav}
          />
        )}
      </div>
      <Toaster position="top-center" richColors />
    </>
  );
}
