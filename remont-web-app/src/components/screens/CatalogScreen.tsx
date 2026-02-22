import React, { useState } from 'react';
import { translations, Language } from '../../utils/translations';
import { CatalogItem } from '../../utils/mockData';
import { Search, ArrowRight } from 'lucide-react';

interface CatalogScreenProps {
  lang: Language;
  onNavigate: (tab: string, params?: any) => void;
  catalog: CatalogItem[];
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({ lang, onNavigate, catalog = [] }) => {
  const t = translations[lang].catalog;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: t.categories.all },
    { id: 'materials', label: t.categories.materials },
    { id: 'furniture', label: t.categories.furniture },
    { id: 'lighting', label: t.categories.lighting },
    { id: 'plumbing', label: t.categories.plumbing },
    { id: 'decor', label: t.categories.decor },
  ];

  const filteredItems = catalog.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title[lang].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'uz-UZ').format(price);
  };

  return (
    <div className="pb-32 pt-2 px-4 min-h-screen bg-[#F9F9F7]">
      {/* Header */}
      <div className="mb-8 mt-2">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">{t.title}</h1>
        
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-0 bg-white rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-shadow duration-300 group-focus-within:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]" />
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative w-full bg-transparent rounded-3xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 font-bold border-none outline-none z-10"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 group-focus-within:text-slate-900 transition-colors" size={22} strokeWidth={2.5} />
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 mb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                : 'bg-white text-slate-500 shadow-sm hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onNavigate('product_detail', { id: item.id })}
            className="group bg-white rounded-[32px] overflow-hidden relative cursor-pointer active:scale-[0.96] transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
            style={{ 
              animation: 'fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              opacity: 0,
              animationDelay: `${index * 0.05}s` 
            }}
          >
            {/* Image Container */}
            <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.title[lang]}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
              
              {/* Price Tag on Image */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1 text-white">
                  {t.categories[item.category] || item.category}
                </div>
                <div className="text-lg font-bold leading-tight line-clamp-2 mb-2">
                  {item.title[lang]}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-90">
                    {formatPrice(item.price)} <span className="text-[10px]">{lang === 'ru' ? 'сум' : "so'm"}</span>
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center scale-90 group-hover:scale-100 transition-transform shadow-lg">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
             <Search size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Ничего не найдено</h3>
          <p className="text-slate-400 text-sm max-w-[200px]">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
};
