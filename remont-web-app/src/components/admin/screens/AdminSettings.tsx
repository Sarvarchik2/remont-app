import React, { useState } from 'react';
import { translations, Language } from '../../../utils/translations';
import { INITIAL_CALCULATOR_PRICES } from '../../../utils/mockData';
import { Check, RotateCcw } from 'lucide-react';

interface CalculatorPrices {
  new: { economy: number; standard: number; premium: number };
  secondary: { economy: number; standard: number; premium: number };
}

interface AdminSettingsProps {
  lang: Language;
  prices: CalculatorPrices;
  onUpdatePrices: (prices: CalculatorPrices) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ lang, prices, onUpdatePrices }) => {
  const [localPrices, setLocalPrices] = useState(prices);
  const [isSaved, setIsSaved] = useState(false);

  const handlePriceChange = (type: 'new' | 'secondary', level: 'economy' | 'standard' | 'premium', value: string) => {
    // Remove non-numeric characters except for formatting
    const numericValue = value.replace(/\s/g, '');
    const numValue = Number(numericValue);

    if (!isNaN(numValue)) {
      setLocalPrices(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [level]: numValue
        }
      }));
    }
  };

  const savePrices = () => {
    onUpdatePrices(localPrices);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Helper to format for input display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getLabel = (lvl: string) => {
      if (lvl === 'economy') return 'Эконом';
      if (lvl === 'standard') return 'Стандарт';
      return 'Премиум';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            SETTINGS
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Цены калькулятора</h1>
        </div>
        <button 
          onClick={savePrices}
          className={`px-6 py-3 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${
             isSaved 
               ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
               : 'bg-black text-white shadow-lg shadow-black/20 hover:bg-slate-900 active:scale-95'
          }`}
        >
          {isSaved ? <Check size={18} className="mr-2" /> : null}
          {isSaved ? 'Сохранено' : 'Сохранить изменения'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Building */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
           <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-blue-500" />
             Новостройка (за м²)
           </h3>
           <div className="space-y-6">
              {(['economy', 'standard', 'premium'] as const).map((lvl) => (
                  <div key={lvl}>
                      <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                              {getLabel(lvl)}
                          </label>
                      </div>
                      <div className="relative group">
                          <input 
                              type="text"
                              value={formatPrice(localPrices.new[lvl])}
                              onChange={(e) => handlePriceChange('new', lvl, e.target.value)}
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 font-black text-lg text-slate-900 outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                          />
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">UZS</span>
                      </div>
                  </div>
              ))}
           </div>
        </div>

        {/* Secondary Housing */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
           <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-orange-500" />
             Вторичка (за м²)
           </h3>
           <div className="space-y-6">
              {(['economy', 'standard', 'premium'] as const).map((lvl) => (
                  <div key={lvl}>
                      <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                              {getLabel(lvl)}
                          </label>
                      </div>
                      <div className="relative group">
                          <input 
                              type="text"
                              value={formatPrice(localPrices.secondary[lvl])}
                              onChange={(e) => handlePriceChange('secondary', lvl, e.target.value)}
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 font-black text-lg text-slate-900 outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                          />
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">UZS</span>
                      </div>
                  </div>
              ))}
           </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-8 pt-4 border-t border-slate-100">
          <button 
            onClick={() => {
                setLocalPrices(INITIAL_CALCULATOR_PRICES);
                onUpdatePrices(INITIAL_CALCULATOR_PRICES);
                setIsSaved(false);
            }}
            className="flex items-center text-slate-400 hover:text-red-500 transition-colors text-sm font-bold px-4 py-2 rounded-xl hover:bg-red-50"
          >
            <RotateCcw size={14} className="mr-2" />
            Сбросить к значениям по умолчанию
          </button>
      </div>
    </div>
  );
};
