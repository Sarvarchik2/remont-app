import React, { useState } from 'react';
import { translations, Language } from '../../utils/translations';
import { ChevronDown, Hammer, Zap, Paintbrush, Grid3x3, Droplet, Home as HomeIcon, Wrench, LucideIcon } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ServiceCategory as ServiceCategoryType } from '../../utils/mockData';

interface ServicesScreenProps {
  lang: Language;
  onNavigate: (tab: string) => void;
  categories: ServiceCategoryType[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  'Hammer': Hammer,
  'Zap': Zap,
  'Paintbrush': Paintbrush,
  'Grid3x3': Grid3x3,
  'Droplet': Droplet,
  'HomeIcon': HomeIcon,
  'Wrench': Wrench
};

export const ServicesScreen: React.FC<ServicesScreenProps> = ({ lang, onNavigate, categories = [] }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('demolition');

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <div className="pb-32 bg-[#F9F9F7] min-h-screen">
      {/* Hero Section */}
      <div className="px-4 pt-4 pb-6">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">
          {lang === 'ru' ? 'ПРАЙС-ЛИСТ' : lang === 'en' ? 'PRICE LIST' : 'PRICEY RO\'YXAT'}
        </p>
        <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-3">
          {lang === 'ru' ? 'Каталог работ' : lang === 'en' ? 'Works catalog' : 'Ishlar katalogi'}
        </h1>
        <p className="text-slate-600 leading-relaxed text-sm">
          {lang === 'ru' ? 'Прозрачное ценообразование на все виды ремонтных работ' : lang === 'en' ? 'Transparent pricing for all types of renovation works' : 'Barcha turdagi ta\'mirlash ishlari uchun shaffof narxlar'}
        </p>
      </div>

      {/* Featured Categories Grid */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-2 gap-3">
          <CategoryCard
            title={lang === 'ru' ? 'Электрика' : lang === 'en' ? 'Electrical' : 'Elektr'}
            image="https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=400"
            icon={Zap}
            onClick={() => {
              setExpandedCategory('electrical');
              setTimeout(() => {
                document.getElementById('electrical')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }}
          />
          <CategoryCard
            title={lang === 'ru' ? 'Отделка' : lang === 'en' ? 'Finishing' : 'Pardozlash'}
            image="https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=400"
            icon={Paintbrush}
            onClick={() => {
              setExpandedCategory('finishing');
              setTimeout(() => {
                document.getElementById('finishing')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }}
          />
          <CategoryCard
            title={lang === 'ru' ? 'Плитка' : lang === 'en' ? 'Tiles' : 'Kafel'}
            image="https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&q=80&w=400"
            icon={Grid3x3}
            onClick={() => {
              setExpandedCategory('tiles');
              setTimeout(() => {
                document.getElementById('tiles')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }}
          />
          <CategoryCard
            title={lang === 'ru' ? 'Сантехника' : lang === 'en' ? 'Plumbing' : 'Santexnika'}
            image="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400"
            icon={Droplet}
            onClick={() => {
              setExpandedCategory('plumbing');
              setTimeout(() => {
                document.getElementById('plumbing')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }}
          />
        </div>
      </div>

      {/* Services Catalog */}
      <div className="px-4">
        <h2 className="text-xl font-bold text-slate-900 mb-4">{lang === 'ru' ? 'Полный прайс-лист' : lang === 'en' ? 'Full price list' : 'To\'liq narxlar'}</h2>
        <div className="space-y-3">
          {categories.map((category) => (
            <ServiceCategory
              key={category.id}
              category={category}
              isExpanded={expandedCategory === category.id}
              onToggle={toggleCategory}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 mt-8">
        <div className="relative rounded-[32px] overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?auto=format&fit=crop&q=80&w=800"
            alt="CTA"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-center items-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              {lang === 'ru' ? 'Нужна консультация?' : lang === 'en' ? 'Need consultation?' : 'Maslahat kerakmi?'}
            </h3>
            <p className="text-white/80 mb-6 text-sm">
              {lang === 'ru' ? 'Поможем рассчитать точную стоимость ремонта' : lang === 'en' ? 'We will help you calculate the exact cost of renovation' : 'Ta\'mirlashning aniq narxini hisoblashga yordam beramiz'}
            </p>
            <button
              onClick={() => onNavigate('calc')}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-sm hover:bg-primary/90 transition-all active:scale-95"
            >
              {lang === 'ru' ? 'Рассчитать бюджет' : lang === 'en' ? 'Calculate budget' : 'Budjetni hisoblash'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CategoryCardProps {
  title: string;
  image: string;
  icon: React.ElementType;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, icon: Icon, onClick }) => (
  <div
    onClick={onClick}
    className="relative aspect-square rounded-[28px] overflow-hidden group cursor-pointer"
  >
    <ImageWithFallback
      src={image}
      alt={title}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3">
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
  </div>
);

interface ServiceCategoryProps {
  category: ServiceCategoryType;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  lang: Language;
}

const ServiceCategory: React.FC<ServiceCategoryProps> = ({
  category,
  isExpanded,
  onToggle,
  lang
}) => {
  const Icon = ICON_MAP[category.icon] || Hammer;

  return (
    <div id={category.id} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => onToggle(category.id)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <Icon size={20} className="text-slate-700" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{typeof category.title === 'string' ? category.title : (category.title as any)?.[lang] || (category.title as any)?.ru}</h3>
        </div>
        <ChevronDown
          className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
            }`}
          size={20}
        />
      </button>

      {/* Services List */}
      {isExpanded && (
        <div className="border-t border-slate-100">
          {category.services.map((service, idx) => (
            <div
              key={service.id || idx}
              className={`px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors ${idx !== category.services.length - 1 ? 'border-b border-slate-50' : ''
                }`}
            >
              <span className="text-slate-700 font-medium text-sm">{typeof service.name === 'string' ? service.name : (service.name as any)?.[lang] || (service.name as any)?.ru}</span>
              <div className="text-right">
                <div className="text-slate-900 font-bold text-sm">{service.price}</div>
                <div className="text-slate-400 text-xs">{service.unit}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
