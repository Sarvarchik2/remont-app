import React, { useState, useEffect } from 'react';
import { translations, Language } from '../../utils/translations';
import { ArrowRight, Calculator as CalcIcon, X, CheckCircle2 } from 'lucide-react';
import { INITIAL_CALCULATOR_PRICES } from '../../utils/mockData';

interface CalculatorPrices {
  new: { economy: number; standard: number; premium: number };
  secondary: { economy: number; standard: number; premium: number };
}

interface CalculatorScreenProps {
  lang: Language;
  onSubmitLead?: (data: {
    area: number;
    type: 'new' | 'secondary';
    level: 'economy' | 'standard' | 'premium';
    estimatedCost: number;
    name?: string;
    phone?: string;
  }) => void;
  prices?: CalculatorPrices;
  onNavigate: (tab: string, params?: any) => void;
}

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({ lang, onSubmitLead, prices = INITIAL_CALCULATOR_PRICES, onNavigate }) => {
  const t = translations[lang].calc;

  const [area, setArea] = useState<number>(60);
  const [type, setType] = useState<'new' | 'secondary'>('new');
  const [level, setLevel] = useState<'economy' | 'standard' | 'premium'>('standard');
  const [total, setTotal] = useState<number>(0);

  // Modal states
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const basePrice = prices[type][level];
    setTotal(basePrice * area);
  }, [area, type, level, prices]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'uz-UZ').format(price);
  };

  const handleOrderClick = () => {
    setShowContactModal(true);
  };

  const handleSubmit = () => {
    if (onSubmitLead) {
      onSubmitLead({
        area,
        type,
        level,
        estimatedCost: total,
        name: name || undefined,
        phone: phone || undefined
      });
    }
    setShowContactModal(false);
    setShowSuccessModal(true);
    // Reset form
    setName('');
    setPhone('');
  };

  return (
    <>
      <div className="pb-32 pt-4 px-4 min-h-screen bg-[#F9F9F7]">
        <div className="mb-2">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            КАЛЬКУЛЯТОР
          </p>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
        </div>

        <div className="bg-white rounded-[40px] p-6 shadow-sm border border-slate-100 mb-6 mt-6">
          {/* Total Display */}
          <div className="text-center py-6">
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">Примерная стоимость</p>
            <div className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              {formatPrice(total)}
              <span className="text-lg text-slate-400 ml-1 font-bold">UZS</span>
            </div>
          </div>

          {/* Sliders / Inputs */}
          <div className="space-y-8 mt-4">

            {/* Area */}
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-sm font-bold text-slate-900">Площадь квартиры</label>
                <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{area} м²</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#FFB800]"
              />
              <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-300">
                <span>20 м²</span>
                <span>200 м²</span>
              </div>
            </div>

            {/* Type Selector */}
            <div>
              <label className="text-sm font-bold text-slate-900 mb-3 block">Тип помещения</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setType('new')}
                  className={`py-4 rounded-2xl font-bold text-sm transition-all border ${type === 'new'
                      ? 'bg-[#FFB800] text-black border-[#FFB800] shadow-lg shadow-[#FFB800]/20'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                >
                  Новостройка
                </button>
                <button
                  onClick={() => setType('secondary')}
                  className={`py-4 rounded-2xl font-bold text-sm transition-all border ${type === 'secondary'
                      ? 'bg-[#FFB800] text-black border-[#FFB800] shadow-lg shadow-[#FFB800]/20'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                >
                  Вторичка
                </button>
              </div>
            </div>

            {/* Level Selector */}
            <div>
              <label className="text-sm font-bold text-slate-900 mb-3 block">Уровень ремонта</label>
              <div className="space-y-3">
                {[
                  { id: 'economy', label: 'Эконом', desc: 'Базовые материалы' },
                  { id: 'standard', label: 'Стандарт', desc: 'Оптимальное качество' },
                  { id: 'premium', label: 'Премиум', desc: 'Дизайн и сложные работы' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setLevel(lvl.id as any)}
                    className={`w-full p-4 rounded-3xl flex items-center justify-between border transition-all ${level === lvl.id
                        ? 'border-[#FFB800] bg-slate-50'
                        : 'border-slate-100 bg-white hover:border-slate-300'
                      }`}
                  >
                    <div className="text-left">
                      <div className={`font-bold ${level === lvl.id ? 'text-slate-900' : 'text-slate-500'}`}>{lvl.label}</div>
                      <div className="text-xs text-slate-400 font-medium">{lvl.desc}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${level === lvl.id ? 'border-[#FFB800]' : 'border-slate-200'
                      }`}>
                      {level === lvl.id && <div className="w-2.5 h-2.5 bg-[#FFB800] rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleOrderClick}
          className="w-full bg-[#FFB800] text-black rounded-[24px] py-5 font-bold text-lg shadow-xl shadow-[#FFB800]/20 flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform hover:bg-[#E5A600]"
        >
          <span>Заказать расчет</span>
          <ArrowRight size={20} />
        </button>

        <div className="text-center mt-6 px-8">
          <p className="text-xs text-slate-400 leading-relaxed">
            Расчет является предварительным. Точная стоимость определяется после замера и составления детальной сметы.
          </p>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-t-[40px] max-w-md w-full p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Оставьте контакты</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Ваше имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите имя"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-900 outline-none focus:ring-2 focus:ring-[#FFB800]/20 placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Телефон</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 XX XXX XX XX"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-900 outline-none focus:ring-2 focus:ring-[#FFB800]/20 placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Calculation Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-6">
              <p className="text-xs text-slate-500 font-medium mb-2">Расчет:</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">Площадь:</span>
                <span className="text-sm font-bold text-slate-900">{area} м²</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">Тип:</span>
                <span className="text-sm font-bold text-slate-900">{type === 'new' ? 'Новостройка' : 'Вторичка'}</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">Уровень:</span>
                <span className="text-sm font-bold text-slate-900">
                  {level === 'economy' ? 'Эконом' : level === 'standard' ? 'Стандарт' : 'Премиум'}
                </span>
              </div>
              <div className="border-t border-slate-200 mt-3 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Примерная стоимость:</span>
                  <span className="text-lg font-bold text-slate-900">{formatPrice(total)} сум</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#FFB800] text-black rounded-2xl py-4 font-bold text-lg shadow-lg shadow-[#FFB800]/20 active:scale-95 transition-transform hover:bg-[#E5A600]"
            >
              Отправить заявку
            </button>
            <p className="text-xs text-slate-400 text-center mt-3">
              Менеджер свяжется с вами в течение 15 минут
            </p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-8 text-center">
            <div className="w-16 h-16 bg-[#00C896] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Заявка отправлена!</h3>
            <p className="text-slate-600 mb-6">
              Наш менеджер свяжется с вами в ближайшее время для уточнения деталей
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#FFB800] text-black rounded-2xl py-4 font-bold shadow-lg shadow-[#FFB800]/20 active:scale-95 transition-transform hover:bg-[#E5A600]"
            >
              Отлично
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
};
