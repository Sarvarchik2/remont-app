import React, { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, Plus, Upload, CheckCircle, Clock, FileText, X, ChevronRight, MapPin, Play, Video, User, Edit2, Check } from 'lucide-react';
import { Language, translations } from '../../../utils/translations';
import { Project } from '../../../utils/types';
import { AdminModal } from '../AdminModal';
import { MediaUpload } from '../MediaUpload';
import { FullscreenMedia } from '../../ui/FullscreenMedia';

interface AdminProjectDetailProps {
  projectId: string;
  lang: Language;
  projects?: Project[];
  onBack: () => void;
  onUpdateProject?: (project: Project) => void;
}

export const AdminProjectDetail: React.FC<AdminProjectDetailProps> = ({ projectId, lang, projects = [], onBack, onUpdateProject }) => {
  const t = translations[lang].admin.project;
  const initialProject = projects?.find(p => p.id === projectId) || projects?.[0];

  if (!initialProject) {
    return <div className="p-8 text-center text-slate-500">Загрузка данных проекта...</div>;
  }

  const [project, setProject] = useState<Project>(initialProject);

  React.useEffect(() => {
    if (initialProject) {
      setProject(initialProject);
    }
  }, [initialProject]);

  // Form States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentComment, setPaymentComment] = useState('');

  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventMediaUrls, setEventMediaUrls] = useState<string[]>([]);
  const [eventType, setEventType] = useState<'photo' | 'doc' | 'info' | 'video'>('info');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [eventInputLang, setEventInputLang] = useState<Language>(lang);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [newRate, setNewRate] = useState(project.foremanSalary?.monthlyRate || 0);

  const handleUpdateMonthlyRate = () => {
    const updatedSalary = {
      monthlyRate: Number(newRate),
      records: project.foremanSalary?.records || []
    };
    const updatedProject = { ...project, foremanSalary: updatedSalary };
    setProject(updatedProject);
    if (onUpdateProject) onUpdateProject(updatedProject);
    setIsEditingRate(false);
  };

  const handleAddSalaryMonth = () => {
    const monthsRu = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const now = new Date();
    const monthName = monthsRu[now.getMonth()] + ' ' + now.getFullYear();

    const newRecord = {
      id: Date.now().toString(),
      month: monthName,
      amount: project.foremanSalary?.monthlyRate || 0,
      isPaid: false,
      date: now.toISOString().split('T')[0]
    };

    const updatedSalary = {
      monthlyRate: project.foremanSalary?.monthlyRate || 0,
      records: [newRecord, ...(project.foremanSalary?.records || [])]
    };

    const updatedProject = { ...project, foremanSalary: updatedSalary };
    setProject(updatedProject);
    if (onUpdateProject) onUpdateProject(updatedProject);
  };

  const toggleSalaryPaid = (recordId: string) => {
    const updatedRecords = project.foremanSalary?.records.map(r =>
      r.id === recordId ? { ...r, isPaid: !r.isPaid } : r
    ) || [];

    const updatedProject = {
      ...project,
      foremanSalary: {
        ...project.foremanSalary!,
        records: updatedRecords
      }
    };
    setProject(updatedProject);
    if (onUpdateProject) onUpdateProject(updatedProject);
  };

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

    const updatedPaid = (project.finance?.paid || 0) + Number(paymentAmount);
    const updatedProject: Project = {
      ...project,
      payments: [newPayment, ...project.payments],
      finance: project.finance ? { ...project.finance, paid: updatedPaid, remaining: (project.finance.total - updatedPaid) } : undefined
    };

    setProject(updatedProject);
    if (onUpdateProject) {
      onUpdateProject(updatedProject);
    }

    setPaymentAmount('');
    setPaymentComment('');
    setIsPaymentModalOpen(false);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: typeof eventTitle === 'string' ? { ru: eventTitle, uz: eventTitle, en: eventTitle } : eventTitle,
      description: typeof eventDesc === 'string' ? { ru: eventDesc, uz: eventDesc, en: eventDesc } : eventDesc,
      type: eventType,
      mediaUrls: eventMediaUrls.length > 0 ? eventMediaUrls : undefined
    };

    const updatedProject = { ...project, timeline: [newEvent, ...project.timeline] };
    setProject(updatedProject);

    if (onUpdateProject) {
      onUpdateProject(updatedProject);
    }

    setEventTitle('');
    setEventDesc('');
    setEventMediaUrls([]);
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
              {typeof project.clientName === 'string' ? project.clientName : project.clientName?.[lang] || (project.clientName as any)?.ru}
            </h1>
            <p className="text-slate-500 font-medium flex items-center">
              <MapPin size={16} className="mr-2 text-primary" />
              {typeof project.address === 'string' ? project.address : project.address?.[lang] || (project.address as any)?.ru}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(['new', 'process', 'finished'] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                const updated = { ...project, status: s };
                setProject(updated);
                if (onUpdateProject) onUpdateProject(updated);
              }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all ${project.status === s
                ? s === 'process' ? 'bg-primary text-black border-primary shadow-lg shadow-primary/10 scale-105' :
                  s === 'finished' ? 'bg-black text-white border-black scale-105' :
                    'bg-slate-200 text-slate-900 border-slate-300 scale-105'
                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                }`}
            >
              {s === 'process' ? translations[lang].admin.project.status.in_progress :
                s === 'finished' ? translations[lang].admin.project.status.finished : translations[lang].admin.project.status.new}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Finance */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-extrabold flex items-center gap-3 text-slate-900">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
                  <DollarSign size={20} />
                </div>
                {t.finance_title}
              </h2>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="bg-primary text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
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
                  <div className="h-full bg-primary transition-all duration-700 ease-out rounded-full shadow-[0_0_10px_rgba(255,193,7,0.3)]" style={{ width: `${progressPercent}%` }} />
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

          {/* Foreman Salary Card */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-extrabold flex items-center gap-3 text-slate-900">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
                  <User size={20} />
                </div>
                {translations[lang].admin.project.foreman_salary}
              </h2>
              <button
                onClick={handleAddSalaryMonth}
                className="bg-primary text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Monthly Rate Display/Edit */}
            <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{translations[lang].admin.project.monthly_rate}</p>
                {isEditingRate ? (
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">$</span>
                    <input
                      type="number"
                      value={newRate}
                      onChange={(e) => setNewRate(Number(e.target.value))}
                      className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-900 outline-none focus:border-primary"
                      autoFocus
                    />
                  </div>
                ) : (
                  <p className="text-xl font-black text-slate-900">${project.foremanSalary?.monthlyRate || 0}</p>
                )}
              </div>
              <button
                onClick={() => isEditingRate ? handleUpdateMonthlyRate() : setIsEditingRate(true)}
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                {isEditingRate ? <Check size={18} className="text-emerald-500" /> : <Edit2 size={18} />}
              </button>
            </div>

            <div className="space-y-4">
              {project.foremanSalary?.records.map(record => (
                <div key={record.id} className="flex justify-between items-center group bg-white border border-slate-100 p-4 rounded-2xl hover:border-slate-300 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${record.isPaid ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                      {record.isPaid ? <CheckCircle size={14} /> : <Clock size={14} />}
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-sm tracking-tight">{record.month}</h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${record.isPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {record.isPaid ? translations[lang].admin.project.paid_label : translations[lang].admin.project.not_paid_label}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900 text-base">${record.amount}</span>
                    <button
                      onClick={() => toggleSalaryPaid(record.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${record.isPaid ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}
                    >
                      {record.isPaid ? <Check size={14} /> : <Plus size={14} />}
                    </button>
                  </div>
                </div>
              ))}
              {(!project.foremanSalary?.records || project.foremanSalary.records.length === 0) && (
                <p className="text-center text-slate-400 text-xs font-medium py-4 italic">Нет записей о зарплате</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 min-h-[500px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-extrabold flex items-center gap-3 text-slate-900">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
                  <Calendar size={20} />
                </div>
                {t.timeline_title}
              </h2>
              <button
                onClick={() => setIsEventModalOpen(true)}
                className="bg-primary text-black px-5 py-2.5 rounded-full text-xs font-bold active:scale-95 transition-transform flex items-center shadow-lg shadow-primary/20 hover:bg-primary/90"
              >
                <Plus size={16} className="mr-2" /> {t.add_event}
              </button>
            </div>

            <div className="relative border-l-2 border-slate-100 ml-4 space-y-10 pl-8 pb-4">
              {project.timeline.map((event) => (
                <div key={event.id} className="relative group">
                  <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-[3px] border-white shadow-sm flex items-center justify-center bg-slate-100 z-10 group-hover:scale-125 transition-transform duration-300`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${event.type === 'photo' ? 'bg-primary' :
                      event.type === 'doc' ? 'bg-slate-400' : 'bg-primary'
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

                  {((event.mediaUrls && event.mediaUrls.length > 0) || (event.fileUrl || event.mediaUrl)) && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                      {(event.mediaUrls || [event.fileUrl || event.mediaUrl]).filter(Boolean).map((url, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                          onClick={() => setSelectedImage(url as string)}
                        >
                          {url?.toString().match(/\.(mp4|webm|ogg|mov)$/) ? (
                            <div className="w-full h-full relative group-hover:bg-black transition-colors">
                              <video src={url as string} className="w-full h-full object-cover opacity-80" muted playsInline />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                  <Play className="text-white fill-white ml-1" size={18} />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <img src={url as string} alt="Event" className="w-full h-full object-cover transition-all duration-500" />
                          )}
                        </div>
                      ))}
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
      <AdminModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Внести платеж"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddPayment} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Сумма (UZS)</label>
            <input
              type="number"
              placeholder="10 000 000"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
              className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none focus:ring-2 focus:ring-black/5 placeholder:text-slate-300 shadow-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Дата</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Комментарий</label>
            <input
              placeholder="Например: Аванс"
              value={paymentComment}
              onChange={(e) => setPaymentComment(e.target.value)}
              required
              className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none focus:ring-2 focus:ring-black/5 placeholder:text-slate-300 shadow-sm"
            />
          </div>
          <button type="submit" className="w-full bg-primary text-black rounded-2xl py-5 font-bold text-xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-colors active:scale-[0.98]">Сохранить</button>
        </form>
      </AdminModal>

      <AdminModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title={t.add_event}
        maxWidth="max-w-md"
      >
        <div className="flex items-center gap-2 mb-6 bg-slate-50 p-1.5 rounded-[22px] w-fit border border-slate-100/50">
          {(['ru', 'uz', 'en'] as const).map(l => (
            <button
              type="button"
              key={l}
              onClick={() => setEventInputLang(l)}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-[11px] uppercase transition-all ${eventInputLang === l ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-110' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
            >
              {l}
            </button>
          ))}
        </div>
        <form onSubmit={handleAddEvent} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Тип события</label>
            <div className="flex gap-3">
              {['info', 'photo', 'video', 'doc'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEventType(t as any)}
                  className={`flex-1 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border ${eventType === t
                    ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20'
                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                >
                  {t === 'info' ? 'Инфо' : t === 'photo' ? 'Фото' : t === 'video' ? 'Видео' : 'Док'}
                </button>
              ))}
            </div>
          </div>

          {(eventType === 'photo' || eventType === 'video') && (
            <MediaUpload
              label={eventType === 'photo' ? "Фото объекта" : "Видео объекта"}
              values={eventMediaUrls}
              onUpload={(urls) => setEventMediaUrls(urls)}
              accept={eventType === 'photo' ? "image/*" : "video/*"}
              multiple={true}
            />
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block leading-none flex items-center justify-between">
                <span>Заголовок</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-[8px]">{eventInputLang.toUpperCase()}</span>
              </label>
              <input
                placeholder="Стяжка пола завершена"
                value={typeof eventTitle === 'string' ? eventTitle : (eventTitle as any)?.[eventInputLang] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setEventTitle(prev => {
                    const current = typeof prev === 'string' ? { ru: prev, uz: prev, en: prev } : (prev || { ru: '', uz: '', en: '' });
                    return { ...current, [eventInputLang]: val } as any;
                  });
                }}
                required
                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] py-4 px-6 font-bold text-lg outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block leading-none flex items-center justify-between">
                <span>Описание / Сообщение</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-[8px]">{eventInputLang.toUpperCase()}</span>
              </label>
              <textarea
                placeholder="Работы выполнены в полном объеме..."
                value={typeof eventDesc === 'string' ? eventDesc : (eventDesc as any)?.[eventInputLang] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setEventDesc(prev => {
                    const current = typeof prev === 'string' ? { ru: prev, uz: prev, en: prev } : (prev || { ru: '', uz: '', en: '' });
                    return { ...current, [eventInputLang]: val } as any;
                  });
                }}
                className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-5 px-6 font-medium text-base outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm placeholder:text-slate-300 min-h-[120px] resize-none"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-black rounded-[24px] py-5 font-black text-xl shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] uppercase tracking-widest">Добавить в ленту</button>
        </form>
      </AdminModal>

      <FullscreenMedia
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        currentUrl={selectedImage || ''}
      />
    </div >
  );
};
