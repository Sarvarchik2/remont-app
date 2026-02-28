import React, { useState } from 'react';
import { translations, Language } from '../../../utils/translations';
import {
  Phone,
  ArrowRight,
  Calculator,
  Calendar,
  Home,
  Filter,
  CheckCircle2,
  X,
  Search,
  User
} from 'lucide-react';
import { Lead } from '../../../utils/types';
import { CalculatorPriceType } from '../../../utils/constants';

interface AdminCRMProps {
  lang: Language;
  leads?: Lead[];
  onUpdateLeadStatus?: (leadId: string, status: Lead['status']) => void;
  prices?: CalculatorPriceType[];
}

export const AdminCRM: React.FC<AdminCRMProps> = ({ lang, leads = [], onUpdateLeadStatus, prices = [] }) => {
  const t = translations[lang].admin.crm;
  const [filter, setFilter] = useState<'all' | Lead['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'all' || lead.status === filter;
    const name = typeof lead.name === 'string' ? lead.name : lead.name?.[lang] || (lead.name as any)?.ru || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.phone || '').includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return { bg: 'bg-black', text: 'text-white', label: 'Новая' };
      case 'contacted': return { bg: 'bg-slate-200', text: 'text-slate-700', label: 'Связались' };
      case 'measuring': return { bg: 'bg-slate-800', text: 'text-white', label: 'Замер' };
      case 'contract': return { bg: 'bg-slate-100', text: 'text-slate-900 border border-slate-300', label: 'Договор' };
      case 'declined': return { bg: 'bg-white', text: 'text-slate-400 border border-slate-200', label: 'Отказ' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', label: status };
    }
  };

  const getSourceIcon = (source: Lead['source']) => {
    switch (source) {
      case 'calculator': return Calculator;
      case 'booking': return Calendar;
      case 'phone': return Phone;
      default: return Home;
    }
  };

  const getSourceLabel = (source: Lead['source']) => {
    switch (source) {
      case 'calculator': return 'Калькулятор';
      case 'booking': return 'Запись на замер';
      case 'phone': return 'Телефон';
      default: return 'Другое';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const stats = [
    { label: 'Всего заявок', value: leads.length, color: 'text-slate-900', bg: 'bg-white' },
    { label: 'Новых', value: leads.filter(l => l.status === 'new').length, color: 'text-slate-900', bg: 'bg-white' },
    { label: 'В работе', value: leads.filter(l => l.status === 'contacted' || l.status === 'measuring').length, color: 'text-slate-900', bg: 'bg-white' },
    { label: 'Договоров', value: leads.filter(l => l.status === 'contract').length, color: 'text-slate-900', bg: 'bg-white' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            CRM
          </p>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={20} />
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени или телефону..."
            className="w-full pl-14 pr-4 py-4 rounded-[24px] border border-slate-200 bg-white font-bold text-slate-900 outline-none focus:border-primary transition-colors placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <div className="flex items-center space-x-2 bg-white p-1 rounded-[24px] border border-slate-200 overflow-x-auto hide-scrollbar">
          {['all', 'new', 'contacted', 'measuring'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-3 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === f
                ? 'bg-black text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              {f === 'all' ? 'Все' :
                f === 'new' ? 'Новые' :
                  f === 'contacted' ? 'Связались' : 'Замер'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.bg} rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32`}>
            <div className={`text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Leads List Grid */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-[32px] p-12 border border-slate-100 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-slate-50 rounded-full mb-6 flex items-center justify-center">
            <Filter size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Заявок пока нет</h3>
          <p className="text-slate-500 font-medium max-w-xs">Новые заявки появятся здесь, когда клиенты заполнят форму</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => {
            const statusInfo = getStatusColor(lead.status);
            const SourceIcon = getSourceIcon(lead.source);

            return (
              <div key={lead.id} className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300 group flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-black group-hover:text-white transition-colors">
                      <SourceIcon size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{getSourceLabel(lead.source)}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">{lead.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold ${statusInfo.bg} ${statusInfo.text}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="mb-6">
                  {lead.name ? (
                    <div className="flex items-center space-x-2 mb-1">
                      <User size={16} className="text-slate-400" />
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-black transition-colors">
                        {typeof lead.name === 'string' ? lead.name : lead.name?.[lang] || (lead.name as any)?.ru}
                      </h3>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic mb-1">Имя не указано</div>
                  )}
                  {lead.phone && (
                    <p className="text-sm text-slate-500 font-mono ml-6">{lead.phone}</p>
                  )}
                </div>

                {/* Data Section */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex-grow">
                  {lead.calculatorData && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Площадь</span>
                        <span className="font-bold text-slate-900">{lead.calculatorData.area} м²</span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Тип</span>
                        <span className="font-bold text-slate-900">
                          {prices.find(p => p.id === lead.calculatorData?.type)?.label || lead.calculatorData?.type || '-'}
                        </span>
                      </div>
                      <div className="pt-1">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block mb-1">Бюджет</span>
                        <span className="text-xl font-black text-slate-900">
                          {formatPrice(lead.calculatorData.estimatedCost)} сум
                        </span>
                      </div>
                    </div>
                  )}

                  {lead.bookingData && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-slate-900 font-bold">
                        <Calendar size={16} />
                        <span>{lead.bookingData.date}, {lead.bookingData.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-snug">{lead.bookingData.address}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-auto">
                  {lead.phone && (
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex-1 bg-white border border-slate-200 text-slate-900 py-3 rounded-xl flex items-center justify-center font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                      <Phone size={16} className="mr-2" />
                      Позвонить
                    </a>
                  )}
                  {lead.status === 'new' && onUpdateLeadStatus && (
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, 'contacted')}
                      className="flex-1 bg-black text-white py-3 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg hover:bg-slate-800 transition-colors"
                    >
                      Принять
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
