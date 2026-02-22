import React, { useState } from 'react';
import { translations, Language } from '../../../utils/translations';
import { Project } from '../../../utils/mockData';
import { AdminProjectDetail } from './AdminProjectDetail';
import { Search, Plus, MapPin, Calendar, X, DollarSign, User, Phone, FileText } from 'lucide-react';

interface AdminProjectsProps {
  lang: Language;
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({ lang, projects, onUpdateProjects }) => {
  const t = translations[lang].admin.project || { title: 'Проекты' };
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    clientName: '',
    address: '',
    phone: '+998 ',
    contractNumber: '',
    totalEstimate: 0,
    startDate: '',
    deadline: '',
    status: 'new',
    currentStage: 'Подготовка'
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: Project = {
      id: Date.now().toString(),
      clientName: formData.clientName || 'Новый клиент',
      address: formData.address || '',
      phone: formData.phone || '',
      contractNumber: formData.contractNumber || '',
      totalEstimate: formData.totalEstimate || 0,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      deadline: formData.deadline || '',
      status: 'new',
      currentStage: formData.currentStage || 'Подготовка',
      stage: formData.currentStage || 'Подготовка', // Alias
      forecast: formData.deadline || '', // Initially forecast = deadline
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
      ]
    };

    onUpdateProjects([newProject, ...projects]);
    setIsModalOpen(false);
    setFormData({
      clientName: '',
      address: '',
      phone: '+998 ',
      contractNumber: '',
      totalEstimate: 0,
      startDate: '',
      deadline: '',
      status: 'new',
      currentStage: 'Подготовка'
    });
  };

  if (selectedProjectId) {
    return (
      <AdminProjectDetail 
        projectId={selectedProjectId} // Assuming mockData IDs might need handling if string vs number
        lang={lang} 
        onBack={() => setSelectedProjectId(null)} 
      />
    );
  }

  const filteredProjects = projects.filter(p => 
    p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contractNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            Projects
          </p>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 bg-primary text-black px-6 py-3 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors font-bold text-sm active:scale-95"
        >
          <Plus size={18} className="mr-2" />
          Добавить проект
        </button>
      </div>

      {/* Search & Filter */}
      <div className="relative mb-8">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
           <Search size={20} />
        </div>
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию ЖК, клиенту или адресу..." 
          className="w-full pl-14 pr-4 py-4 rounded-[24px] border border-slate-200 bg-white font-bold text-slate-900 outline-none focus:border-primary transition-colors placeholder:text-slate-400 shadow-sm"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => {
          // Calculate progress dynamically
          const totalPaid = p.finance?.paid || 0;
          const total = p.finance?.total || 1;
          const progress = total > 0 ? Math.min(100, Math.round((totalPaid / total) * 100)) : 0;
          
          return (
            <div 
              key={p.id} 
              onClick={() => setSelectedProjectId(p.id)}
              className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-slate-900 text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors border border-slate-100 uppercase">
                   {p.clientName.charAt(0)}
                </div>
                <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                  p.status === 'process' ? 'bg-primary text-primary-foreground border-primary' : 
                  p.status === 'finished' ? 'bg-white text-slate-900 border-slate-200' : 
                  'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {p.status === 'process' ? 'В работе' :  
                   p.status === 'finished' ? 'Завершен' : 'Новый'}
                </div>
              </div>

              <div className="mb-6 flex-grow">
                 <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-black transition-colors line-clamp-1">{p.clientName}</h3>
                 
                 <div className="space-y-2">
                   <div className="flex items-center text-slate-500 text-sm font-medium">
                      <MapPin size={16} className="mr-2 text-slate-300 flex-shrink-0" />
                      <span className="truncate">{p.address}</span>
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
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Оплата</div>
                  <div className="text-sm font-black text-slate-900">{progress}%</div>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-700 ease-out rounded-full" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Оплачено:</span>
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
          <h3 className="text-lg font-bold text-slate-900 mb-1">Новый проект</h3>
          <p className="text-slate-400 text-sm max-w-[200px]">Создайте карточку нового объекта для отслеживания</p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-2xl p-8 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900">
                Новый проект
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Клиент</h4>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">ФИО Клиента</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        required
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-black/5"
                        placeholder="Иванов Иван"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Телефон</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-black/5"
                        placeholder="+998 90 123 45 67"
                      />
                    </div>
                  </div>
                </div>

                {/* Object Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Объект</h4>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Адрес</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        required
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-black/5"
                        placeholder="Улица, Дом, Квартира"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Номер договора</label>
                    <div className="relative">
                      <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        required
                        type="text"
                        value={formData.contractNumber}
                        onChange={(e) => setFormData({...formData, contractNumber: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-black/5"
                        placeholder="№ 123"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Finance & Dates */}
              <div className="space-y-4">
                 <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Финансы и Сроки</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Сумма сметы</label>
                      <div className="relative">
                        <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          required
                          type="number"
                          value={formData.totalEstimate || ''}
                          onChange={(e) => setFormData({...formData, totalEstimate: Number(e.target.value)})}
                          className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-black/5"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Дата начала</label>
                      <input 
                        required
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-black/5"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Дедлайн</label>
                      <input 
                        required
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-black/5"
                      />
                    </div>
                 </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-900 rounded-2xl py-4 font-bold text-lg hover:bg-slate-200 transition-colors"
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-transform"
                >
                  Создать проект
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
