import React, { useState } from 'react';
import { translations, Language } from '../../utils/translations';
import { PortfolioItem } from '../../utils/types';
import { ArrowLeft, Clock, MapPin, CheckCircle2, User, Share2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PortfolioDetailScreenProps {
  lang: Language;
  onNavigate: (tab: string, params?: any) => void;
  projectId: number;
  portfolio?: PortfolioItem[];
}

export const PortfolioDetailScreen: React.FC<PortfolioDetailScreenProps> = ({
  lang,
  onNavigate,
  projectId,
  portfolio = []
}) => {
  const t = translations[lang].portfolio; // We might need to add specific translations for details if missing, but using existing ones for now.

  const project = portfolio.find(p => p.id === projectId);
  const [activeImage, setActiveImage] = useState(project?.imgAfter);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">
        <p className="text-slate-400 font-bold">Project not found</p>
      </div>
    );
  }

  const galleryImages = [project.imgAfter, project.imgBefore, ...(project.gallery || [])];

  return (
    <div className="pb-32 bg-[#F9F9F7] min-h-screen animate-fade-in">
      {/* Immersive Header */}
      <div className="relative w-full aspect-[4/5] lg:aspect-video rounded-b-[40px] overflow-hidden shadow-2xl shadow-slate-200">
        <ImageWithFallback
          src={activeImage || project.imgAfter}
          alt={typeof project.title === 'string' ? project.title : project.title?.[lang] || (project.title as any)?.ru}
          className="w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe-top flex justify-between items-center z-10">
          <button
            onClick={() => onNavigate('portfolio')}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
            <Share2 size={20} />
          </button>
        </div>

        {/* Title & Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags?.map((tag, idx) => (
              <span key={idx} className="bg-[#FFB800] text-black border border-[#FFB800] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-extrabold mb-2 leading-tight">
            {typeof project.title === 'string' ? project.title : project.title?.[lang] || (project.title as any)?.ru}
          </h1>
          <div className="flex items-center text-white/80 text-sm font-medium">
            <MapPin size={16} className="mr-1.5 text-[#FFB800]" />
            {project.location}
          </div>
        </div>
      </div>

      {/* Gallery Thumbs (Floating) */}
      <div className="px-4 -mt-6 mb-6 relative z-10">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#FFB800] shadow-lg scale-105' : 'border-white opacity-70'
                }`}
            >
              <ImageWithFallback src={img} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-4">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Бюджет</div>
            <div className="text-slate-900 font-extrabold text-lg">{project.cost || project.budget}</div>
          </div>
          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Срок</div>
            <div className="text-slate-900 font-extrabold text-lg">{project.term || project.duration}</div>
          </div>
          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Площадь</div>
            <div className="text-slate-900 font-extrabold text-lg">{project.area} м²</div>
          </div>
          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Тип</div>
            <div className="text-slate-900 font-bold text-sm">
              {project.isNewBuilding ? 'Новостройка' : 'Вторичка'}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg mb-3">О проекте</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            {typeof project.description === 'string' ? project.description : project.description?.[lang] || (project.description as any)?.ru}
          </p>
        </div>

        {/* Works Completed */}
        {project.worksCompleted && (
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Выполненные работы</h3>
            <div className="space-y-6">
              {project.worksCompleted.map((section, idx) => (
                <div key={idx}>
                  <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#FFB800] mr-2" />
                    {section.category}
                  </h4>
                  <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-start text-sm text-slate-500">
                        <CheckCircle2 size={16} className="mr-2 text-[#FFB800] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team */}
        {project.team && (
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-3 px-2">Команда проекта</h3>
            <div className="grid grid-cols-2 gap-3">
              {project.team.map((member, idx) => (
                <div key={idx} className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                    <ImageWithFallback src={member.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{member.name}</div>
                    <div className="text-xs text-slate-400">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Materials Used */}
        {project.materials && (
          <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-lg shadow-slate-900/20">
            <h3 className="font-bold text-lg mb-4">Материалы</h3>
            <div className="flex flex-wrap gap-2">
              {project.materials.map((mat, idx) => (
                <span key={idx} className="bg-white/10 px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10">
                  {mat}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CTA */}
      <div className="fixed bottom-6 left-6 right-6 z-20">
        <button
          onClick={() => onNavigate('calc')}
          className="w-full bg-[#FFB800] text-black rounded-[24px] py-4 shadow-xl shadow-[#FFB800]/20 flex items-center justify-center font-bold text-lg active:scale-[0.98] transition-transform hover:bg-[#E5A600]"
        >
          Хочу такой же ремонт
        </button>
      </div>
    </div>
  );
};
