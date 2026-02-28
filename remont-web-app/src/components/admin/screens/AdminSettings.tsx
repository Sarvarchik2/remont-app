import React, { useState } from 'react';
import { translations, Language } from '../../../utils/translations';
import { INITIAL_CALCULATOR_PRICES, CalculatorPriceType } from '../../../utils/constants';
import { Check, RotateCcw, Plus, Trash2 } from 'lucide-react';

interface AdminSettingsProps {
  lang: Language;
  prices: CalculatorPriceType[];
  onUpdatePrices: (prices: CalculatorPriceType[]) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ lang, prices, onUpdatePrices }) => {
  const [localPrices, setLocalPrices] = useState<CalculatorPriceType[]>(prices);
  const [isSaved, setIsSaved] = useState(false);

  const handlePriceChange = (id: string, level: 'economy' | 'standard' | 'premium', value: string) => {
    const numericValue = value.replace(/\s/g, '');
    const numValue = Number(numericValue);

    if (!isNaN(numValue)) {
      setLocalPrices(prev => prev.map(p => p.id === id ? { ...p, [level]: numValue } : p));
    }
  };

  const handleLabelChange = (id: string, label: string) => {
    setLocalPrices(prev => prev.map(p => p.id === id ? { ...p, label } : p));
  };

  const handleAddType = () => {
    const newId = `type-${Date.now()}`;
    setLocalPrices(prev => [...prev, {
      id: newId,
      label: 'Новый тип',
      economy: 1000000,
      standard: 1500000,
      premium: 2500000
    }]);
  };

  const handleRemoveType = (id: string) => {
    setLocalPrices(prev => prev.filter(p => p.id !== id));
  };

  const savePrices = () => {
    onUpdatePrices(localPrices);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getLabel = (lvl: string) => {
    if (lvl === 'economy') return 'Эконом';
    if (lvl === 'standard') return 'Стандарт';
    return 'Премиум';
  };

  const colors = ['bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            SETTINGS
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Цены калькулятора</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddType}
            className="px-6 py-3 rounded-2xl flex items-center justify-center font-bold text-sm bg-slate-100 text-slate-900 hover:bg-slate-200 transition-all"
          >
            <Plus size={18} className="mr-2" />
            Добавить тип
          </button>
          <button
            onClick={savePrices}
            className={`px-6 py-3 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${isSaved
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
              : 'bg-black text-white shadow-lg shadow-black/20 hover:bg-slate-900 active:scale-95'
              }`}
          >
            {isSaved ? <Check size={18} className="mr-2" /> : null}
            {isSaved ? 'Сохранено' : 'Сохранить изменения'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localPrices.map((typeObj, index) => (
          <div key={typeObj.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative group">
            <button
              onClick={() => handleRemoveType(typeObj.id)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
              <input
                type="text"
                value={typeObj.label}
                onChange={(e) => handleLabelChange(typeObj.id, e.target.value)}
                className="bg-transparent outline-none border-b border-dashed border-slate-300 focus:border-slate-800 transition-colors w-full pb-1"
                placeholder="Название типа"
              />
            </h3>
            <div className="space-y-6">
              {(['economy', 'standard', 'premium'] as const).map((lvl) => (
                <div key={lvl}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      {getLabel(lvl)}
                    </label>
                  </div>
                  <div className="relative group/input">
                    <input
                      type="text"
                      value={formatPrice(typeObj[lvl])}
                      onChange={(e) => handlePriceChange(typeObj.id, lvl, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 font-black text-lg text-slate-900 outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">UZS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
