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
import { MOCK_LEADS, Lead, INITIAL_CALCULATOR_PRICES, STORIES_DATA, Story, MOCK_PROJECTS, Project, MOCK_PORTFOLIO, PortfolioItem, MOCK_SERVICES, ServiceCategory, MOCK_CATALOG, CatalogItem } from './utils/mockData';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/screens/AdminDashboard';
import { AdminCRM } from './components/admin/screens/AdminCRM';
import { AdminProjects } from './components/admin/screens/AdminProjects';
import { AdminPortfolio } from './components/admin/screens/AdminPortfolio';
import { AdminServices } from './components/admin/screens/AdminServices';
import { AdminSettings } from './components/admin/screens/AdminSettings';
import { AdminStories } from './components/admin/screens/AdminStories';
import { Lock, ArrowLeft } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('ru');
  const [viewMode, setViewMode] = useState<'client' | 'admin_login' | 'admin'>('client');

  // Client State
  const [activeTab, setActiveTab] = useState('home');
  const [currentProjectId, setCurrentProjectId] = useState<number | undefined>(undefined);
  const [currentPortfolioId, setCurrentPortfolioId] = useState<number | undefined>(undefined);
  const [currentProductId, setCurrentProductId] = useState<string | undefined>(undefined);

  // Admin State
  const [adminTab, setAdminTab] = useState('dashboard');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Leads State
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  // Calculator Prices State
  const [calculatorPrices, setCalculatorPrices] = useState(INITIAL_CALCULATOR_PRICES);

  // Stories State
  const [stories, setStories] = useState<Story[]>(STORIES_DATA);

  // Projects State
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  // Portfolio State
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(MOCK_PORTFOLIO);

  // Services State
  const [services, setServices] = useState<ServiceCategory[]>(MOCK_SERVICES);

  // Catalog State
  const [catalog, setCatalog] = useState<CatalogItem[]>(MOCK_CATALOG);

  // --- Backend Sync Logic ---
  useEffect(() => {
    const initData = async () => {
      try {
        const url = 'http://localhost:8000/api/v1';

        // Settings Sync
        const settingsRes = await fetch(`${url}/settings/`);
        const settingsData = await settingsRes.json();
        if (settingsData.length === 0) {
          await fetch(`${url}/settings/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: 1, prices: INITIAL_CALCULATOR_PRICES }) });
        } else {
          setCalculatorPrices(settingsData[0].prices);
        }

        const syncFeature = async (path: string, mockData: any[], setState: React.Dispatch<any>) => {
          const res = await fetch(`${url}/${path}/`);
          const data = await res.json();
          if (data.length === 0) {
            await fetch(`${url}/${path}/batch`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(mockData)
            });
            setState(mockData);
          } else {
            setState(data);
          }
        };

        await Promise.all([
          syncFeature('leads', MOCK_LEADS, setLeads),
          syncFeature('stories', STORIES_DATA, setStories),
          syncFeature('projects', MOCK_PROJECTS, setProjects),
          syncFeature('portfolio', MOCK_PORTFOLIO, setPortfolio),
          syncFeature('services', MOCK_SERVICES, setServices),
          syncFeature('catalog', MOCK_CATALOG, setCatalog)
        ]);

      } catch (error) {
        console.error("Backend sync failed. Using offline mocks.", error);
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

  // --- Lead Management ---
  const handleSubmitLead = (data: {
    area: number;
    type: 'new' | 'secondary';
    level: 'economy' | 'standard' | 'premium';
    estimatedCost: number;
    name?: string;
    phone?: string;
  }) => {
    const now = new Date();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      source: 'calculator',
      status: 'new',
      date: now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      calculatorData: {
        area: data.area,
        type: data.type,
        level: data.level,
        estimatedCost: data.estimatedCost
      }
    };

    try {
      fetch('http://localhost:8000/api/v1/leads/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
    } catch (e) { console.error('Error posting lead:', e); }

    setLeads(prev => [newLead, ...prev]);
  };

  const handleUpdateLeadStatus = async (leadId: string, status: Lead['status']) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      try {
        fetch('http://localhost:8000/api/v1/leads/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...lead, status })
        });
      } catch (e) { }
    }
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
  };

  // --- Admin Logic ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setViewMode('admin');
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('Неверный пароль');
    }
  };

  const handleAdminNavigate = (tab: string) => {
    setAdminTab(tab);
  };

  const renderAdminScreen = () => {
    switch (adminTab) {
      case 'dashboard': return <AdminDashboard lang={lang} onNavigate={handleAdminNavigate} leads={leads} />;
      case 'crm': return <AdminCRM lang={lang} leads={leads} onUpdateLeadStatus={handleUpdateLeadStatus} />;
      case 'projects': return <AdminProjects lang={lang} projects={projects} onUpdateProjects={setProjects} />;
      case 'portfolio': return <AdminPortfolio lang={lang} portfolio={portfolio} onUpdatePortfolio={setPortfolio} />;
      case 'stories': return <AdminStories lang={lang} stories={stories} onUpdateStories={setStories} />;
      case 'services': return <AdminServices lang={lang} categories={services} onUpdateCategories={setServices} />;
      case 'settings': return <AdminSettings lang={lang} prices={calculatorPrices} onUpdatePrices={setCalculatorPrices} />;
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
            <div>
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-center text-lg font-bold outline-none focus:ring-2 focus:ring-black/5 placeholder:text-slate-300 placeholder:font-normal"
                autoFocus
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
      <AdminLayout
        activeTab={adminTab}
        onNavigate={handleAdminNavigate}
        lang={lang}
        onLogout={() => setViewMode('client')}
      >
        {renderAdminScreen()}
      </AdminLayout>
    );
  }

  // 3. Client App
  const renderClientScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen lang={lang} onNavigate={handleClientNavigate} stories={stories} />;
      case 'calc': return <CalculatorScreen lang={lang} onNavigate={handleClientNavigate} onSubmitLead={handleSubmitLead} prices={calculatorPrices} />;
      case 'services': return <ServicesScreen lang={lang} onNavigate={handleClientNavigate} categories={services} />;
      case 'catalog': return <CatalogScreen lang={lang} onNavigate={handleClientNavigate} catalog={catalog} />;
      case 'product_detail': return <ProductDetailScreen lang={lang} onNavigate={handleClientNavigate} productId={currentProductId || ''} catalog={catalog} />;
      case 'portfolio': return <PortfolioScreen lang={lang} onNavigate={handleClientNavigate} portfolio={portfolio} />;
      case 'portfolio_detail': return <PortfolioDetailScreen lang={lang} onNavigate={handleClientNavigate} projectId={currentPortfolioId!} portfolio={portfolio} />;
      case 'project_detail': return <ProjectDetailScreen lang={lang} onNavigate={handleClientNavigate} projectId={currentProjectId} projects={projects} />;
      case 'dashboard': return <DashboardScreen lang={lang} onNavigate={handleClientNavigate} />;
      case 'booking': return <BookingScreen lang={lang} onNavigate={handleClientNavigate} />;
      default: return <HomeScreen lang={lang} onNavigate={handleClientNavigate} />;
    }
  };

  const showBottomNav = ['home', 'calc', 'portfolio', 'dashboard', 'services', 'catalog'].includes(activeTab);

  return (
    <>
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
      <div className="min-h-screen text-slate-900 font-sans">
        {activeTab !== 'booking' && activeTab !== 'project_detail' && (
          <Header
            lang={lang}
            setLang={setLang}
            onAdminClick={() => setViewMode('admin_login')}
          />
        )}

        <main className={`max-w-md mx-auto w-full ${activeTab === 'project_detail' ? '' : 'pt-4'}`}>
          {renderClientScreen()}
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
    </>
  );
}
