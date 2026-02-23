import React from 'react';
import { translations, Language } from '../../utils/translations';
import { CatalogItem } from '../../utils/mockData';
import { ArrowLeft, Share2, MessageCircle, Check } from 'lucide-react';

interface ProductDetailScreenProps {
  lang: Language;
  onNavigate: (tab: string, params?: any) => void;
  productId: string;
  catalog: CatalogItem[];
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ lang, onNavigate, productId, catalog }) => {
  const t = translations[lang].catalog;
  const product = catalog.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F9F7]">
        <div className="text-slate-400 font-bold">Product not found</div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'uz-UZ').format(price);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] pb-32">
      {/* Immersive Image Header */}
      <div className="relative w-full aspect-[4/5] lg:aspect-video rounded-b-[48px] overflow-hidden shadow-2xl shadow-slate-200 z-0">
        <img
          src={product.image}
          alt={product.title[lang]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe-top flex justify-between items-center z-10">
          <button
            onClick={() => onNavigate('catalog')}
            className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform hover:bg-black/40"
          >
            <ArrowLeft size={24} />
          </button>

          <button className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform hover:bg-black/40">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      <div className="px-6 -mt-10 relative z-10 animate-fade-in">
        {/* Title Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="inline-flex px-3 py-1 rounded-full bg-[#FFB800]/10 text-[10px] font-bold uppercase tracking-widest text-[#FFB800]">
              {(t.categories as any)[product.category]}
            </div>
            <div className="flex items-center text-slate-900 text-xs font-bold">
              <Check size={14} className="mr-1 text-[#FFB800]" />
              {lang === 'ru' ? 'В наличии' : 'Mavjud'}
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 leading-tight mb-4">
            {product.title[lang]}
          </h1>

          <div className="flex items-baseline text-slate-900">
            <span className="text-3xl font-black mr-1">{formatPrice(product.price)}</span>
            <span className="text-lg font-bold text-slate-400">{lang === 'ru' ? 'сум' : "so'm"}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-3 px-2">{t.details.desc}</h3>
          <p className="text-slate-500 leading-relaxed font-medium px-2">
            {product.description[lang]}
          </p>
        </div>

        {/* Specs */}
        {product.specs && product.specs.length > 0 && (
          <div className="mb-24">
            <h3 className="text-lg font-bold text-slate-900 mb-4 px-2">{t.details.specs}</h3>
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100/50 space-y-4">
              {product.specs.map((spec: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 last:pb-0">
                  <span className="text-slate-400 font-medium text-sm">{spec.label[lang]}</span>
                  <span className="text-slate-900 font-bold text-right">{spec.value[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 right-6 z-20">
        <button className="w-full bg-[#FFB800] text-black rounded-[24px] py-4 shadow-xl shadow-[#FFB800]/20 flex items-center justify-center font-bold text-lg active:scale-[0.98] transition-transform hover:bg-[#E5A600]">
          <MessageCircle className="mr-2" size={24} />
          {lang === 'ru' ? 'Узнать подробнее' : "Batafsil ma'lumot"}
        </button>
      </div>
    </div>
  );
};
