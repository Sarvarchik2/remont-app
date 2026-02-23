import React, { useState } from 'react';
import { translations, Language } from '../../utils/translations';
import { PortfolioItem } from '../../utils/mockData';

interface PortfolioScreenProps {
  lang: Language;
  onNavigate: (tab: string, params?: any) => void;
  portfolio?: PortfolioItem[];
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ lang, onNavigate, portfolio = [] }) => {
  const t = translations[lang].portfolio;
  const [filter, setFilter] = useState<'all' | 'newbuilding'>('all');

  const filteredProjects = filter === 'all'
    ? portfolio
    : portfolio.filter(p => p.isNewBuilding);


  return (
    <div className="pb-32 pt-4 px-4 min-h-screen bg-[#F9F9F7]">
      {/* Header */}
      <div className="mb-2">
        <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
          {lang === 'ru' ? 'ПОРТФОЛИО' : lang === 'en' ? 'PORTFOLIO' : 'PORTFOLIO'}
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          {lang === 'ru' ? 'Наши работы' : lang === 'en' ? 'Our works' : 'Bizning ishlar'}
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-3 mb-6 mt-6 relative">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${filter === 'all'
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
        >
          {lang === 'ru' ? 'Все проекты' : lang === 'en' ? 'All projects' : 'Barcha loyihalar'}
        </button>
        <button
          onClick={() => setFilter('newbuilding')}
          className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${filter === 'newbuilding'
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
        >
          {lang === 'ru' ? 'Новостройки' : lang === 'en' ? 'New buildings' : 'Yangi binolar'}
        </button>

        {/* Active indicator line */}
        <div className="absolute -bottom-2 left-0 h-0.5 bg-primary transition-all duration-300"
          style={{
            width: filter === 'all' ? '122px' : '128px',
            transform: filter === 'all' ? 'translateX(0)' : 'translateX(134px)'
          }}
        />
      </div>

      {/* Projects Grid */}
      <div className="space-y-6">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            onClick={() => onNavigate('portfolio_detail', { id: project.id })}
            className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 cursor-pointer active:scale-[0.98] transition-transform animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Project Image */}
            <div className="relative h-[280px] overflow-hidden">
              <img
                src={project.imgAfter}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Project Info */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {typeof project.title === 'string' ? project.title : (project.title as any)?.[lang] || (project.title as any)?.ru}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {lang === 'ru' ? 'Полный ремонт под ключ' : lang === 'en' ? 'Full turnkey renovation' : 'To\'liq kalit taslim ta\'mirlash'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};