import React, { useState } from 'react';
import { translations, Language } from '../../utils/translations';
import { StoriesModal } from '../ui/StoriesModal';
import { STORIES_DATA, Story } from '../../utils/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ArrowUpRight, Heart, Plus, Clock, Target, Gem, Shield, Award, Star } from 'lucide-react';

interface HomeScreenProps {
  lang: Language;
  onNavigate: (tab: string) => void;
  stories?: Story[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ lang, onNavigate, stories = STORIES_DATA }) => {
  const t = translations[lang].home;
  const [storyIndex, setStoryIndex] = useState<number | null>(null);

  return (
    <div className="pb-32 bg-[#F9F9F7] min-h-screen">
      <StoriesModal 
        isOpen={storyIndex !== null}
        initialIndex={storyIndex || 0}
        onClose={() => setStoryIndex(null)}
        stories={stories}
        lang={lang}
      />

      {/* Hero Title */}
      <div className="px-4 pt-2 pb-4">
        <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
          ДОБРО ПОЖАЛОВАТЬ
        </p>
        <h1 className="text-3xl font-bold text-slate-900 leading-tight">
          Ремонт вашей мечты
        </h1>
      </div>

      {/* Stories */}
      <div className="px-4 mb-8">
        <div className="flex overflow-x-auto scrollbar-hide gap-5 pb-2">
          {stories.map((s, idx) => (
            <button 
              key={s.id} 
              onClick={() => setStoryIndex(idx)}
              className="flex flex-col items-center space-y-2.5 flex-shrink-0 group"
            >
              {/* Story Circle */}
              <div className="relative">
                {/* Gradient Ring */}
                <div className="w-[72px] h-[72px] rounded-full p-[2.5px] bg-gradient-to-tr from-primary via-amber-400 to-yellow-200">
                  <div className="w-full h-full rounded-full border-[3px] border-[#F9F9F7] overflow-hidden bg-white">
                    <ImageWithFallback 
                      src={s.imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                </div>
              </div>
              
              {/* Story Label */}
              <span className="text-[11px] font-medium text-slate-600 text-center leading-tight max-w-[72px] line-clamp-2">
                {s.title[lang]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Promo Banner */}
      <div className="px-4 mb-8">
        <div className="relative h-[440px] rounded-[40px] overflow-hidden group">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
            alt="Promo"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-center items-center">
            <div className="mb-6">
              <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
                Ремонт,<br/>который вдохновляет
              </h2>
              <p className="text-white/90 font-medium text-base">
                Создаем уют в каждом метре
              </p>
            </div>
            
            <button 
              onClick={() => onNavigate('calc')}
              className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-primary/90 transition-all active:scale-95 shadow-2xl"
            >
              Рассчитать бюджет
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">
              ГОТОВЫЕ РЕШЕНИЯ
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              Популярные услуги
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('services')}
            className="bg-white px-4 py-2 rounded-full text-xs font-bold border border-slate-200 flex items-center hover:bg-slate-50 transition-colors"
          >
            Все услуги
            <ArrowUpRight size={14} className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ServiceCard 
            title="Косметический" 
            price="от 1.2 млн/м²"
            img="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400"
            tag="Популярно"
            onNavigate={onNavigate}
          />
          <ServiceCard 
            title="Капитальный" 
            price="от 2.5 млн/м²"
            img="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400"
            onNavigate={onNavigate}
          />
          <ServiceCard 
            title="Дизайн проект" 
            price="от 150 тыс/м²"
            img="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=400"
            onNavigate={onNavigate}
          />
          
          {/* More Card */}
          <div 
            className="aspect-[4/5] bg-white rounded-[32px] flex flex-col items-center justify-center border border-slate-200 text-slate-500 space-y-3 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95" 
            onClick={() => onNavigate('portfolio')}
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <Plus size={28} className="text-slate-600" />
            </div>
            <span className="font-bold text-sm">Смотреть все</span>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="px-4 mb-8">
        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">
            НАШИ ПРЕИМУЩЕСТВА
          </p>
          <h3 className="text-2xl font-bold text-slate-900">Почему мы?</h3>
        </div>
        
        {/* Main Feature Card */}
        <div className="mb-3 relative rounded-[32px] overflow-hidden group">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1668678437217-ad4bcac34f32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG9jayUyMHRpbWUlMjBtYW5hZ2VtZW50JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcxMDA1MDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Time guarantee"
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl mb-3 border border-white/20">
              <Clock size={28} className="text-primary" strokeWidth={2.5} />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Сроки по договору</h4>
            <p className="text-white/90 text-sm leading-relaxed">
              Гарантируем выполнение в срок или штраф. Каждый день просрочки = 1% от стоимости возвращаем.
            </p>
          </div>
        </div>

        {/* Secondary Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative rounded-[28px] overflow-hidden group bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 min-h-[220px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl mb-3 border border-white/10">
                <Target size={24} className="text-primary" strokeWidth={2.5} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Контроль 24/7</h4>
              <p className="text-white/90 text-xs leading-relaxed">
                Онлайн-камера на объекте и ежедневные отчёты в Telegram
              </p>
            </div>
          </div>

          <div className="relative rounded-[28px] overflow-hidden group">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1697124510314-fa9757e11670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbiUyMHF1YWxpdHl8ZW58MXx8fHwxNzcxMDA1MDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Premium materials"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl mb-3 border border-white/20">
                <Gem size={24} className="text-primary" strokeWidth={2.5} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Премиум материалы</h4>
              <p className="text-white/90 text-xs leading-relaxed">
                Работаем с ведущими брендами по оптовым ценам
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-3 bg-white rounded-[24px] p-5 border border-slate-100 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 mb-1">240+</div>
            <div className="text-xs text-slate-500">Проектов</div>
          </div>
          <div className="text-center border-l border-r border-slate-100">
            <div className="text-2xl font-bold text-slate-900 mb-1">4.9</div>
            <div className="text-xs text-slate-500">Рейтинг</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 mb-1">8 лет</div>
            <div className="text-xs text-slate-500">Опыт</div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="px-4">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">
              ПОРТФОЛИО
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              Последние работы
            </h3>
          </div>
          <button 
            onClick={() => onNavigate('portfolio')}
            className="text-sm font-bold text-slate-900 flex items-center hover:text-slate-600 transition-colors"
          >
            Все
            <ArrowUpRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="space-y-4">
          <ProjectPreviewCard 
            title="ЖК Tashkent City"
            location="Шайхантахур"
            img="https://images.unsplash.com/photo-1765767056681-9583b29007cf?auto=format&fit=crop&w=800&q=80"
            onNavigate={onNavigate}
          />
          <ProjectPreviewCard 
            title="ЖК Magic City"
            location="Юнусабад"
            img="https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?auto=format&fit=crop&w=800&q=80"
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ title, price, img, tag, onNavigate }: any) => (
  <div 
    className="relative aspect-[4/5] bg-white rounded-[32px] p-2 shadow-sm border border-slate-100 group cursor-pointer overflow-hidden"
    onClick={() => onNavigate('calc')}
  >
    <div className="w-full h-full rounded-[24px] overflow-hidden relative">
      <ImageWithFallback 
        src={img} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      {/* Top badges */}
      <div className="absolute top-3 right-3">
        <button className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-rose-500 transition-colors">
          <Heart size={16} />
        </button>
      </div>
      
      {tag && (
        <div className="absolute top-3 left-3">
          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1.5 rounded-full">
            {tag}
          </span>
        </div>
      )}

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="font-bold text-base leading-tight mb-1">{title}</h3>
        <p className="text-xs font-medium opacity-90">{price}</p>
      </div>
    </div>
  </div>
);

const ProjectPreviewCard = ({ title, location, img, onNavigate }: any) => (
  <div 
    className="relative h-56 rounded-[32px] overflow-hidden group cursor-pointer"
    onClick={() => onNavigate('portfolio')}
  >
    <ImageWithFallback 
      src={img} 
      alt={title} 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    <div className="absolute bottom-6 left-6 right-6 text-white">
      <h4 className="text-xl font-bold mb-1">{title}</h4>
      <p className="text-sm text-white/80">{location}</p>
    </div>
  </div>
);