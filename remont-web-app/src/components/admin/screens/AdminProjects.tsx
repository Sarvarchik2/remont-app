import React, { useState } from 'react';
import { translations, Language } from '../../../utils/translations';
import { Project, AppUser } from '../../../utils/types';
import { AdminProjectDetail } from './AdminProjectDetail';
import { AdminModal } from '../AdminModal';
import { MediaUpload } from '../MediaUpload';
import { Search, Plus, MapPin, Calendar, X, DollarSign, User, Phone, FileText, Clock } from 'lucide-react';

interface AdminProjectsProps {
  lang: Language;
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
  users: AppUser[];
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({ lang, projects, onUpdateProjects, users }) => {
  const t = translations[lang].admin.project || { title: 'Проекты' };
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputLang, setInputLang] = useState<Language>('ru');

  // Client Search State
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    clientName: '',
    address: '',
    phone: '+998 ',
    contractNumber: '',
    telegramId: '',
    totalEstimate: 0,
    startDate: '',
    deadline: '',
    status: 'new',
    currentStage: 'Подготовка',
    imageUrl: ''
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();

    const newProject: Project = {
      id: Date.now().toString(),
      clientName: formData.clientName || 'Новый клиент',
      address: formData.address || '',
      phone: formData.phone || '',
      contractNumber: formData.contractNumber || '',
      telegramId: formData.telegramId || '',
      totalEstimate: formData.totalEstimate || 0,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      deadline: formData.deadline || '',
      status: 'new',
      currentStage: formData.currentStage || 'Подготовка',
      stage: formData.currentStage || 'Подготовка', // Alias
      forecast: typeof formData.deadline === 'string' ? formData.deadline : formData.deadline?.[lang] || (formData.deadline as any)?.ru || '', // Initially forecast = deadline
      finance: {
        total: formData.totalEstimate || 0,
        paid: 0,
        remaining: formData.totalEstimate || 0
      },
      payments: [],
      timeline: [
        {
          id: `t-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          title: 'Проект создан',
          description: 'Карточка проекта заведена в систему',
          type: 'info',
          status: 'completed'
        }
      ],
      imageUrl: formData.imageUrl || ''
    };

    onUpdateProjects([newProject, ...projects]);
    setIsModalOpen(false);
    setFormData({
      clientName: '',
      address: '',
      phone: '+998 ',
      contractNumber: '',
      telegramId: '',
      totalEstimate: 0,
      startDate: '',
      deadline: '',
      status: 'new',
      currentStage: 'Подготовка',
      imageUrl: ''
    });
  };

  if (selectedProjectId) {
    return (
      <AdminProjectDetail
        projectId={selectedProjectId}
        lang={lang}
        projects={projects}
        onBack={() => setSelectedProjectId(null)}
        onUpdateProject={(updatedProject) => {
          const newProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
          onUpdateProjects(newProjects);
        }}
      />
    );
  }

  const filteredProjects = projects.filter(p => {
    const clientName = typeof p.clientName === 'string' ? p.clientName : p.clientName?.[lang] || (p.clientName as any)?.ru || '';
    const address = typeof p.address === 'string' ? p.address : p.address?.[lang] || (p.address as any)?.ru || '';
    return clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contractNumber.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            PROJECTS
          </p>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 bg-primary text-black px-6 py-3 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors font-bold text-sm active:scale-95"
        >
          <Plus size={18} className="mr-2" />
          {t.add_project}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="relative mb-8">
        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={22} style={{ marginLeft: '1rem' }} />
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.search_placeholder}
          style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
          className="w-full pl-20 pr-6 py-5 rounded-[32px] border border-slate-200 bg-white font-bold text-slate-900 outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/5 transition-all placeholder:text-slate-400 shadow-sm"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => {
          // Calculate progress dynamically
          const totalPaid = p.finance?.paid || 0;
          const total = p.finance?.total || 1;
          const progress = total > 0 ? Math.min(100, Math.round((totalPaid / total) * 100)) : 0;

          const displayClientName = typeof p.clientName === 'string' ? p.clientName : p.clientName?.[lang] || (p.clientName as any)?.ru || '';
          const displayAddress = typeof p.address === 'string' ? p.address : p.address?.[lang] || (p.address as any)?.ru || '';

          return (
            <div
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-slate-900 text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors border border-slate-100 uppercase">
                  {displayClientName.charAt(0)}
                </div>
                <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${p.status === 'process' ? 'bg-primary text-black border-primary shadow-sm shadow-primary/10' :
                  p.status === 'finished' ? 'bg-white text-slate-900 border-slate-200' :
                    'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                  {p.status === 'process' ? t.status.in_progress :
                    p.status === 'finished' ? t.status.finished : t.status.new}
                </div>
              </div>

              <div className="mb-6 flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-black transition-colors line-clamp-1">
                  {displayClientName}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center text-slate-500 text-sm font-medium">
                    <MapPin size={16} className="mr-2 text-slate-300 flex-shrink-0" />
                    <span className="truncate">{displayAddress}</span>
                  </div>
                  <div className="flex items-center text-slate-500 text-sm font-medium">
                    <Calendar size={16} className="mr-2 text-slate-300 flex-shrink-0" />
                    <span>{p.startDate} - {p.deadline}</span>
                  </div>
                  <div className="flex items-center text-slate-500 text-sm font-medium">
                    <FileText size={16} className="mr-2 text-slate-300 flex-shrink-0" />
                    <span>Договор №{p.contractNumber}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.payment}</div>
                  <div className="text-sm font-black text-slate-900">{progress}%</div>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-xs font-medium">
                  <span className="text-slate-500">{t.paid}</span>
                  <span className="text-slate-900 font-bold">{(totalPaid / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New Project Card (Desktop) */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-slate-200 rounded-[32px] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all min-h-[300px] group"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
            <Plus size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">{t.new_project}</h3>
          <p className="text-slate-400 text-sm max-w-[200px]">{t.create_desc}</p>
        </div>
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t.new_project}
        maxWidth="max-w-2xl"
      >
        {/* Language Switcher for Inputs */}
        <div className="flex items-center gap-2 mb-8 bg-slate-50 p-1.5 rounded-[22px] w-fit border border-slate-100/50">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mr-2 leading-none">{t.input_lang}:</span>
          {(['ru', 'uz', 'en'] as const).map(l => (
            <button
              type="button"
              key={l}
              onClick={() => setInputLang(l)}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-[11px] uppercase transition-all ${inputLang === l ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-110' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
            >
              {l}
            </button>
          ))}
        </div>

        <form onSubmit={handleCreateProject} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Client Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {t.client}
              </h4>

              <div className="space-y-5">
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-1">{t.select_from_db}</label>
                  <div className="relative group">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder={t.search_client}
                      value={clientSearchQuery}
                      onFocus={() => setIsClientSearchOpen(true)}
                      onChange={(e) => setClientSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-14 pr-5 font-bold text-slate-900 outline-none focus:border-primary/50 focus:bg-white focus:shadow-md transition-all placeholder:text-slate-400"
                    />
                    {isClientSearchOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-[22px] shadow-2xl max-h-[250px] overflow-y-auto animate-in fade-in slide-in-from-top-2 divide-y divide-slate-50">
                        {(Array.isArray(users) ? users : []).filter(u =>
                          (u.first_name || '').toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
                          (u.last_name || '').toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
                          (u.username || '').toLowerCase().includes(clientSearchQuery.toLowerCase())
                        ).map(u => (
                          <div
                            key={u.id}
                            className="px-5 py-3 hover:bg-slate-50 cursor-pointer flex flex-col transition-colors"
                            onClick={() => {
                              const fullName = `${u.first_name} ${u.last_name || ''}`.trim();
                              setFormData({
                                ...formData,
                                clientName: { ru: fullName, uz: fullName, en: fullName },
                                telegramId: u.telegram_id,
                                phone: u.phone || formData.phone || '+998 '
                              });
                              setClientSearchQuery(fullName);
                              setIsClientSearchOpen(false);
                            }}
                          >
                            <span className="font-bold text-slate-900 text-sm">{u.first_name} {u.last_name || ''}</span>
                            <span className="text-[10px] text-slate-400 font-medium">@{u.username || 'no_username'} • ID: {u.telegram_id}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 py-4">
                  <div className="h-[1px] flex-grow bg-slate-200"></div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.or_manual}</span>
                  <div className="h-[1px] flex-grow bg-slate-200"></div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-1 flex items-center justify-between">
                    {t.fio}
                    <span className="text-[8px] bg-slate-200 text-slate-500 px-2 py-1 rounded-md">{inputLang.toUpperCase()}</span>
                  </label>
                  <div className="relative group">
                    <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      required
                      type="text"
                      value={typeof formData.clientName === 'string' ? formData.clientName : formData.clientName?.[inputLang] || ''}
                      onChange={(e) => {
                        const newName = typeof formData.clientName === 'string'
                          ? { ru: formData.clientName, uz: formData.clientName, en: formData.clientName, [inputLang]: e.target.value }
                          : { ...(formData.clientName as any) || { ru: '', uz: '', en: '' }, [inputLang]: e.target.value };
                        setFormData({ ...formData, clientName: newName });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-14 pr-5 font-bold text-slate-900 outline-none focus:border-primary/50 focus:shadow-md transition-all appearance-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-1">{t.phone}</label>
                  <div className="relative group">
                    <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-14 pr-5 font-bold text-slate-900 outline-none focus:border-primary/50 focus:shadow-md transition-all appearance-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Object Info */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-200 pb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {t.object}
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-1 flex items-center justify-between">
                    {t.address}
                    <span className="text-[8px] bg-slate-200 text-slate-500 px-2 py-1 rounded-md">{inputLang.toUpperCase()}</span>
                  </label>
                  <div className="relative group">
                    <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      required
                      type="text"
                      value={typeof formData.address === 'string' ? formData.address : formData.address?.[inputLang] || ''}
                      onChange={(e) => {
                        const newAddr = typeof formData.address === 'string'
                          ? { ru: formData.address, uz: formData.address, en: formData.address, [inputLang]: e.target.value }
                          : { ...(formData.address as any) || { ru: '', uz: '', en: '' }, [inputLang]: e.target.value };
                        setFormData({ ...formData, address: newAddr });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-14 pr-5 font-bold text-slate-900 outline-none focus:border-primary/50 focus:shadow-md transition-all appearance-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-1">{t.contract_details}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative group">
                      <FileText size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <input
                        required
                        type="text"
                        value={formData.contractNumber}
                        onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-14 pr-5 font-bold text-slate-900 outline-none focus:border-primary/50 focus:bg-white focus:shadow-md transition-all text-sm"
                        placeholder="№ "
                      />
                    </div>
                    <div className="relative group">
                      <DollarSign size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <input
                        required
                        type="number"
                        value={formData.totalEstimate || ''}
                        onChange={(e) => setFormData({ ...formData, totalEstimate: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-14 pr-5 font-bold text-slate-900 outline-none focus:border-primary/50 focus:bg-white focus:shadow-md transition-all text-sm"
                        placeholder={t.total}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-1">{t.tg_id}</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 px-2 h-8 bg-slate-200 border border-slate-300 rounded-lg flex items-center justify-center text-[9px] font-black text-slate-500 group-focus-within:border-primary/50 group-focus-within:text-primary transition-all">ID</div>
                    <input
                      type="text"
                      value={formData.telegramId || ''}
                      onChange={(e) => setFormData({ ...formData, telegramId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-14 pr-5 font-bold text-slate-900 outline-none focus:border-primary/50 focus:bg-white focus:shadow-md transition-all"
                      placeholder="123456789"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Plus size={14} className="text-primary" />
              ФОТО ОБЪЕКТА
            </h4>
            <MediaUpload
              values={formData.imageUrl ? [formData.imageUrl] : []}
              onUpload={(urls) => setFormData({ ...formData, imageUrl: urls[0] || '' })}
              multiple={false}
              label="Главное фото проекта"
            />
          </div>

          <div className="space-y-6 bg-slate-50/50 p-6 rounded-[24px] border border-slate-200">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <Calendar size={14} className="text-primary" />
              {t.terms}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">{t.start_date}</label>
                <div className="relative group">
                  <input
                    required
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-full py-4 px-5 font-bold text-slate-900 outline-none focus:border-primary/50 focus:shadow-md transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">{t.deadline}</label>
                <div className="relative group">
                  <input
                    required
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-full py-4 px-5 font-bold text-slate-900 outline-none focus:border-primary/50 focus:shadow-md transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-8 py-4 bg-slate-100 text-slate-500 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-95"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-black rounded-full py-5 font-black text-base shadow-xl shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all uppercase tracking-[0.15em]"
            >
              {t.create}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
