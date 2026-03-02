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
  User,
  ClipboardList,
  MessageSquare,
  Ruler,
  FileText,
  TrendingUp,
  LayoutGrid
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
      case 'new': return { bg: 'bg-primary', text: 'text-black', label: t.status.new };
      case 'contacted': return { bg: 'bg-indigo-50', text: 'text-indigo-600', label: t.status.contacted };
      case 'measuring': return { bg: 'bg-purple-50', text: 'text-purple-600', label: t.status.measure };
      case 'contract': return { bg: 'bg-emerald-50', text: 'text-emerald-600 border border-emerald-100', label: t.status.contract };
      case 'declined': return { bg: 'bg-white', text: 'text-slate-400 border border-slate-200', label: t.status.reject };
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
      case 'calculator': return t.sources.calculator;
      case 'booking': return t.sources.booking;
      case 'phone': return t.sources.phone;
      default: return t.sources.other;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const stats = [
    { label: t.stats.total, value: leads.length, color: 'text-slate-900', bg: 'bg-white', icon: LayoutGrid, accent: 'bg-blue-50 text-blue-600' },
    { label: t.stats.new, value: leads.filter((l: Lead) => l.status === 'new').length, color: 'text-slate-900', bg: 'bg-white', icon: TrendingUp, accent: 'bg-amber-50 text-amber-600' },
    { label: t.status.contacted, value: leads.filter((l: Lead) => l.status === 'contacted').length, color: 'text-slate-900', bg: 'bg-white', icon: MessageSquare, accent: 'bg-indigo-50 text-indigo-600' },
    { label: t.status.measure, value: leads.filter((l: Lead) => l.status === 'measuring').length, color: 'text-slate-900', bg: 'bg-white', icon: Ruler, accent: 'bg-purple-50 text-purple-600' },
    { label: t.status.contract, value: leads.filter((l: Lead) => l.status === 'contract').length, color: 'text-slate-900', bg: 'bg-white', icon: FileText, accent: 'bg-emerald-50 text-emerald-600' },
    { label: t.status.reject, value: leads.filter((l: Lead) => l.status === 'declined').length, color: 'text-slate-900', bg: 'bg-white', icon: X, accent: 'bg-red-50 text-red-600' },
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
            placeholder={t.search_placeholder}
            className="w-full pl-14 pr-4 py-4 rounded-[24px] border border-slate-200 bg-white font-bold text-slate-900 outline-none focus:border-primary transition-colors placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <div className="flex items-center space-x-2 bg-white p-1 rounded-[24px] border border-slate-200 overflow-x-auto hide-scrollbar">
          {['all', 'new', 'contacted', 'measuring', 'contract', 'declined'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${filter === f
                ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-105'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
            >
              {f === 'all' ? t.status.all :
                f === 'new' ? t.status.new :
                  f === 'contacted' ? t.status.contacted :
                    f === 'measuring' ? t.status.measure :
                      f === 'contract' ? t.status.contract : t.status.reject}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.bg} rounded-[24px] p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${stat.accent} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                <stat.icon size={20} />
              </div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            </div>
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Leads List Grid */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-[32px] p-12 border border-slate-200 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-slate-50 rounded-full mb-6 flex items-center justify-center">
            <Filter size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t.no_leads_title}</h3>
          <p className="text-slate-500 font-medium max-w-xs">{t.no_leads_desc}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => {
            const statusInfo = getStatusColor(lead.status);
            const SourceIcon = getSourceIcon(lead.source);

            return (
              <div key={lead.id} className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1.5 duration-500 group flex flex-col h-full relative overflow-hidden">
                {/* Status Background Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 -mr-16 -mt-16 transition-colors duration-500 ${lead.status === 'new' ? 'bg-amber-500' :
                  lead.status === 'contacted' ? 'bg-indigo-500' :
                    lead.status === 'measuring' ? 'bg-purple-500' :
                      lead.status === 'contract' ? 'bg-emerald-500' : 'bg-slate-500'
                  }`} />

                {/* Header */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-black transition-all duration-500 transform group-hover:rotate-6 border border-slate-100 shadow-sm">
                      <SourceIcon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{getSourceLabel(lead.source)}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5 opacity-80">{lead.date}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${statusInfo.bg} ${statusInfo.text} shadow-sm border border-black/10`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="mb-6 relative z-10">
                  {lead.name ? (
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-black transition-colors tracking-tight">
                        {typeof lead.name === 'string' ? lead.name : lead.name?.[lang] || (lead.name as any)?.ru}
                      </h3>
                    </div>
                  ) : (
                    <div className="text-slate-300 font-bold italic mb-1">{t.no_name}</div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center space-x-2 text-slate-400 font-bold text-sm">
                      <Phone size={14} className="opacity-50" />
                      <span className="font-mono">{lead.phone}</span>
                    </div>
                  )}
                </div>

                {/* Data Section */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 flex-grow space-y-4">
                  {lead.calculatorData && (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm border-b border-slate-200 pb-3">
                        <span className="text-slate-500 font-bold">{t.fields.area}</span>
                        <span className="font-black text-slate-900">{lead.calculatorData.area} м²</span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-slate-200 pb-3">
                        <span className="text-slate-500 font-bold">{t.fields.type}</span>
                        <span className="font-black text-slate-900">
                          {translations[lang].calc.types[lead.calculatorData?.type as keyof typeof translations.ru.calc.types] || lead.calculatorData?.type || '-'}
                        </span>
                      </div>
                      <div className="pt-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block mb-2">{t.fields.budget}</span>
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                          {formatPrice(lead.calculatorData.estimatedCost)} <span className="text-xs font-bold text-slate-400 uppercase">
                            {translations[lang].calc.result.range.split(' ').pop()}
                          </span>
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
                      className="flex-1 bg-white border border-slate-200 text-slate-900 py-3 rounded-full flex items-center justify-center font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                      <Phone size={16} className="mr-2" />
                      {t.actions.call}
                    </a>
                  )}
                  {lead.status === 'new' && onUpdateLeadStatus && (
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, 'contacted')}
                      className="flex-1 bg-primary text-black py-4 rounded-full flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                    >
                      {t.status.contacted}
                      <ArrowRight size={14} className="ml-2" />
                    </button>
                  )}
                  {lead.status === 'contacted' && onUpdateLeadStatus && (
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, 'measuring')}
                      className="flex-1 bg-primary text-black py-4 rounded-full flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                    >
                      {t.status.measure}
                      <ArrowRight size={14} className="ml-2" />
                    </button>
                  )}
                  {lead.status === 'measuring' && onUpdateLeadStatus && (
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, 'contract')}
                      className="flex-1 bg-primary text-black py-4 rounded-full flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                    >
                      {t.status.contract}
                      <ArrowRight size={14} className="ml-2" />
                    </button>
                  )}
                  {lead.status !== 'declined' && lead.status !== 'contract' && onUpdateLeadStatus && (
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, 'declined')}
                      className="w-12 h-12 bg-white border border-slate-200 text-slate-400 rounded-full flex items-center justify-center hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                      title={t.status.reject}
                    >
                      <X size={20} />
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
