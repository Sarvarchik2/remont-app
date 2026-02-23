import React, { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, Plus, Upload, CheckCircle, Clock, FileText, X, ChevronRight, MapPin } from 'lucide-react';
import { Language, translations } from '../../../utils/translations';
import { Project } from '../../../utils/types';

interface AdminProjectDetailProps {
  projectId: string;
  lang: Language;
  projects?: Project[];
  onBack: () => void;
}

export const AdminProjectDetail: React.FC<AdminProjectDetailProps> = ({ projectId, lang, projects = [], onBack }) => {
  const t = translations[lang].admin.project;
  const initialProject = projects?.find(p => p.id === projectId) || projects?.[0];

  if (!initialProject) {
    return <div className="p-8 text-center text-slate-500">Загрузка данных проекта...</div>;
  }

  const [project, setProject] = useState<Project>(initialProject);

  // Form States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentComment, setPaymentComment] = useState('');

  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventType, setEventType] = useState<'photo' | 'doc' | 'info'>('info');

  const totalPaid = project.finance?.paid || project.payments.reduce((sum, p) => sum + p.amount, 0);
  const totalEstimate = project.finance?.total || project.totalEstimate;
  const leftToPay = totalEstimate - totalPaid;
  const progressPercent = Math.min(100, Math.round((totalPaid / totalEstimate) * 100));

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment = {
      id: Date.now().toString(),
      date: paymentDate,
      amount: Number(paymentAmount),
      comment: paymentComment
    };

    setProject(prev => {
      const updatedPaid = (prev.finance?.paid || 0) + Number(paymentAmount);
      return {
        ...prev,
        payments: [newPayment, ...prev.payments],
        finance: prev.finance ? { ...prev.finance, paid: updatedPaid, remaining: (prev.finance.total - updatedPaid) } : undefined
      };
    });

    setPaymentAmount('');
    setPaymentComment('');
    setIsPaymentModalOpen(false);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: eventTitle,
      description: eventDesc,
      type: eventType,
      fileUrl: eventType === 'photo' ? 'https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?auto=format&fit=crop&q=80&w=600' : undefined
    };
    setProject(prev => ({ ...prev, timeline: [newEvent, ...prev.timeline] }));
    setEventTitle('');
    setEventDesc('');
    setIsEventModalOpen(false);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' UZS';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-2">
              {typeof initialProject.clientName === 'string' ? initialProject.clientName : initialProject.clientName?.[lang] || (initialProject.clientName as any)?.ru}
            </h1>
            <p className="text-slate-500 font-medium flex items-center">
              <MapPin size={16} className="mr-2 text-primary" />
              {typeof initialProject.address === 'string' ? initialProject.address : initialProject.address?.[lang] || (initialProject.address as any)?.ru}
            </p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border w-fit ${project.status === 'process' ? 'bg-black text-white border-black' :
          project.status === 'finished' ? 'bg-white text-slate-900 border-slate-200' :
            'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
          {project.status === 'process' ? 'В работе' :
            project.status === 'finished' ? 'Завершен' : 'Новый'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Finance */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-extrabold flex items-center gap-3 text-slate-900">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
                  <DollarSign size={20} />
                </div>
                {t.finance_title}
              </h2>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-black/20 hover:scale-105 transition-transform"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t.total_estimate}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{formatMoney(totalEstimate)}</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-500">Оплачено {progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-black transition-all duration-700 ease-out rounded-full" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{t.paid_amount}</p>
                  <p className="font-extrabold text-slate-900 text-lg">{formatMoney(totalPaid)}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Остаток</p>
                  <p className="font-extrabold text-slate-900 text-lg">{formatMoney(leftToPay)}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Последние платежи</h3>
                <button className="text-xs font-bold text-slate-400 hover:text-slate-900">Все</button>
              </div>
              <div className="space-y-4">
                {project.payments.slice(0, 3).map(payment => (
                  <div key={payment.id} className="flex justify-between items-center group">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-colors">
                        <DollarSign size={14} />
                      </div>
                      <div>
                        <h3 className="text-slate-900 font-bold mb-1">
                          {typeof payment.description === 'string' ? payment.description : payment.description?.[lang] || (payment.description as any)?.ru || (payment as any).comment}
                        </h3>
                        <p className="text-slate-500 text-xs font-medium">{payment.date}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">+{payment.amount.toLocaleString()}</span>
                  </div>
                ))}
                {project.payments.length === 0 && (
                  <p className="text-sm text-slate-400 italic">Платежей пока нет</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-extrabold flex items-center gap-3 text-slate-900">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
                  <Calendar size={20} />
                </div>
                {t.timeline_title}
              </h2>
              <button
                onClick={() => setIsEventModalOpen(true)}
                className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold active:scale-95 transition-transform flex items-center shadow-lg shadow-black/20 hover:bg-slate-900"
              >
                <Plus size={16} className="mr-2" /> {t.add_event}
              </button>
            </div>

            <div className="relative border-l-2 border-slate-100 ml-4 space-y-10 pl-8 pb-4">
              {project.timeline.map((event) => (
                <div key={event.id} className="relative group">
                  <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-[3px] border-white shadow-sm flex items-center justify-center bg-slate-200 z-10 group-hover:scale-125 transition-transform duration-300`}>
                    <div className={`w-2 h-2 rounded-full ${event.type === 'photo' ? 'bg-slate-900' :
                      event.type === 'doc' ? 'bg-slate-500' : 'bg-black'
                      }`} />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className="font-extrabold text-slate-900 text-lg">
                      {typeof event.title === 'string' ? event.title : event.title?.[lang] || (event.title as any)?.ru || 'Обновление'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{event.date}</span>
                  </div>

                  {event.message && (
                    <p className="text-slate-600 text-sm font-medium mb-3 leading-relaxed max-w-2xl bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {typeof event.message === 'string' ? event.message : (event.message as any)?.[lang] || (event.message as any)?.ru}
                    </p>
                  )}

                  {event.description && (
                    <p className="text-slate-500 text-sm font-medium mb-3 leading-relaxed max-w-2xl">
                      {typeof event.description === 'string' ? event.description : (event.description as any)?.[lang] || (event.description as any)?.ru}
                    </p>
                  )}

                  {event.fileUrl && event.type === 'photo' && (
                    <div className="w-full sm:w-64 h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-sm mt-3 hover:shadow-md transition-shadow cursor-pointer">
                      <img src={event.fileUrl} alt="Event" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                    </div>
                  )}

                  {event.mediaUrl && event.type === 'photo' && (
                    <div className="w-full sm:w-64 h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-sm mt-3 hover:shadow-md transition-shadow cursor-pointer">
                      <img src={event.mediaUrl} alt="Event" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                    </div>
                  )}

                  {event.type === 'doc' && (
                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl w-fit border border-slate-200 shadow-sm hover:border-slate-400 transition-colors cursor-pointer group/doc">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover/doc:bg-black group-hover/doc:text-white transition-colors">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Документ.pdf</p>
                        <p className="text-xs text-slate-400">1.2 MB</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-[#F9F9F7] rounded-t-[40px] sm:rounded-[40px] w-full max-w-md p-8 animate-slide-up shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Внести платеж</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddPayment} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Сумма (UZS)</label>
                <input
                  type="number"
                  placeholder="10 000 000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                  className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm focus:ring-2 focus:ring-black/5 placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Дата</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Комментарий</label>
                <input
                  placeholder="Например: Аванс"
                  value={paymentComment}
                  onChange={(e) => setPaymentComment(e.target.value)}
                  required
                  className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm focus:ring-2 focus:ring-black/5 placeholder:text-slate-300"
                />
              </div>
              <button type="submit" className="w-full bg-black text-white rounded-2xl py-5 font-bold text-xl shadow-xl shadow-black/20 hover:bg-slate-900 transition-colors active:scale-[0.98]">Сохранить</button>
            </form>
          </div>
        </div>
      )}

      {isEventModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-[#F9F9F7] rounded-t-[40px] sm:rounded-[40px] w-full max-w-md p-8 animate-slide-up shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Новое событие</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Тип события</label>
                <div className="flex gap-3">
                  {['info', 'photo', 'doc'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEventType(t as any)}
                      className={`flex-1 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border ${eventType === t
                        ? 'bg-black text-white border-black shadow-lg shadow-black/20'
                        : 'bg-white text-slate-400 border-transparent hover:border-slate-200'
                        }`}
                    >
                      {t === 'info' ? 'Инфо' : t === 'photo' ? 'Фото' : 'Док'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Заголовок</label>
                <input
                  placeholder="Стяжка пола завершена"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                  className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm focus:ring-2 focus:ring-black/5 placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Описание</label>
                <textarea
                  placeholder="Детали..."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm focus:ring-2 focus:ring-black/5 placeholder:text-slate-300 min-h-[100px] resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-black text-white rounded-2xl py-5 font-bold text-xl shadow-xl shadow-black/20 hover:bg-slate-900 transition-colors active:scale-[0.98]">Добавить</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
