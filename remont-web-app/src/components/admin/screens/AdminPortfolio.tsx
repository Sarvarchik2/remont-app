import React, { useState, Dispatch, SetStateAction } from 'react';
import { translations, Language } from '../../../utils/translations';
import { MOCK_PORTFOLIO, PortfolioItem } from '../../../utils/mockData';
import { Plus, Trash2, MapPin, Ruler, Clock, X, Image as ImageIcon, Pencil, CheckSquare, List, Type } from 'lucide-react';

interface AdminPortfolioProps {
  lang: Language;
  portfolio: PortfolioItem[];
  onUpdatePortfolio: Dispatch<SetStateAction<PortfolioItem[]>>;
}

export const AdminPortfolio: React.FC<AdminPortfolioProps> = ({ lang, portfolio, onUpdatePortfolio }) => {
  const setPortfolio = onUpdatePortfolio;
  const t = translations[lang].admin.portfolio;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'details' | 'media'>('general');

  // Form State
  const defaultItem: Partial<PortfolioItem> = {
    type: 'living',
    title: '',
    area: '',
    term: '',
    cost: '',
    location: '',
    description: '',
    tags: [],
    materials: [],
    isNewBuilding: false,
    imgBefore: 'https://images.unsplash.com/photo-1704920110270-5c107519cdc4?auto=format&fit=crop&w=600&q=80',
    imgAfter: 'https://images.unsplash.com/photo-1765767056681-9583b29007cf?auto=format&fit=crop&w=800&q=80'
  };

  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>(defaultItem);

  // Helpers for array fields
  const handleArrayInput = (field: keyof PortfolioItem, value: string) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value.split(',').map(s => s.trim()).filter(Boolean)
    }));
  };

  const handleDelete = (id: number) => {
    if (confirm('Вы уверены?')) {
      setPortfolio(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setNewItem(item);
    setEditingId(item.id);
    setActiveTab('general');
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewItem(defaultItem);
    setActiveTab('general');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.area) return;

    if (editingId) {
        // Edit existing
        setPortfolio(prev => prev.map(item => 
            item.id === editingId ? { ...item, ...newItem } as PortfolioItem : item
        ));
    } else {
        // Create new
        const item: PortfolioItem = {
            id: Date.now(),
            type: newItem.type as any || 'living',
            title: newItem.title!,
            area: newItem.area!,
            term: newItem.term || '1 мес',
            cost: newItem.cost || '0',
            location: newItem.location || 'Ташкент',
            description: newItem.description || '',
            tags: newItem.tags || [],
            materials: newItem.materials || [],
            isNewBuilding: newItem.isNewBuilding || false,
            imgBefore: newItem.imgBefore || defaultItem.imgBefore!,
            imgAfter: newItem.imgAfter || defaultItem.imgAfter!,
            // Defaults for complex fields not yet in form
            worksCompleted: [],
            team: [],
            gallery: []
        };
        setPortfolio([item, ...portfolio]);
    }

    handleClose();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            PORTFOLIO
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Наши работы</h1>
        </div>
        <button 
          onClick={() => {
              setEditingId(null);
              setNewItem(defaultItem);
              setIsModalOpen(true);
          }}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors font-bold text-sm"
        >
          <Plus size={18} className="mr-2" />
          Добавить проект
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <div key={item.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col h-full">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={item.imgAfter} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-wider shadow-sm">
                {item.type}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-extrabold text-slate-900 text-xl leading-tight">{item.title}</h3>
                <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-black hover:bg-slate-200 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide mb-6">
                 <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"><MapPin size={14} /> {item.location}</div>
                 <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"><Ruler size={14} /> {item.area} м²</div>
                 <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"><Clock size={14} /> {item.term}</div>
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{tag}</span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Бюджет</span>
                <span className="font-black text-slate-900 text-lg">{item.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-[#F9F9F7] rounded-t-[40px] sm:rounded-[40px] w-full max-w-2xl p-8 animate-slide-up sm:animate-fade-in max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-black text-slate-900">
                   {editingId ? 'Редактировать проект' : 'Новый проект'}
               </h3>
               <button onClick={handleClose} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-900 hover:bg-slate-100 transition-colors">
                 <X size={20} />
               </button>
             </div>

             {/* Tabs */}
             <div className="flex space-x-2 mb-6 bg-slate-200 p-1 rounded-2xl w-fit">
                <button 
                  onClick={() => setActiveTab('general')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'general' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Основное
                </button>
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'details' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Детали
                </button>
                <button 
                  onClick={() => setActiveTab('media')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'media' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Медиа
                </button>
             </div>

             <form onSubmit={handleSave} className="space-y-6">
               
               {/* GENERAL TAB */}
               {activeTab === 'general' && (
                 <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Название ЖК</label>
                      <input 
                        placeholder="ЖК Infinity" 
                        value={newItem.title}
                        onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                        required
                        className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Тип помещения</label>
                          <div className="relative">
                              <select 
                                className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-base outline-none shadow-sm appearance-none focus:ring-2 focus:ring-black/5"
                                value={newItem.type}
                                onChange={(e) => setNewItem({...newItem, type: e.target.value as any})}
                              >
                                <option value="living">Гостиная</option>
                                <option value="kitchen">Кухня</option>
                                <option value="bath">Ванная</option>
                                <option value="bedroom">Спальня</option>
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                  <ChevronRight className="rotate-90" size={16} />
                              </div>
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Площадь (м²)</label>
                          <input 
                            type="number"
                            placeholder="85" 
                            value={newItem.area}
                            onChange={(e) => setNewItem({...newItem, area: e.target.value})}
                            required
                            className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                          />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Срок</label>
                          <input 
                            placeholder="2 мес" 
                            value={newItem.term}
                            onChange={(e) => setNewItem({...newItem, term: e.target.value})}
                            className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Бюджет</label>
                          <input 
                            placeholder="150М" 
                            value={newItem.cost}
                            onChange={(e) => setNewItem({...newItem, cost: e.target.value})}
                            className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                          />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Локация</label>
                      <input 
                        placeholder="Ташкент, Шайхантахур" 
                        value={newItem.location}
                        onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                        className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-base outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                      />
                    </div>
                 </div>
               )}

               {/* DETAILS TAB */}
               {activeTab === 'details' && (
                 <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Описание</label>
                      <textarea 
                        placeholder="Подробное описание проекта..." 
                        value={newItem.description}
                        onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                        className="w-full bg-white border-none rounded-2xl py-5 px-6 font-medium text-base outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5 min-h-[120px] resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Теги (через запятую)</label>
                      <input 
                        placeholder="Минимализм, Лофт, Светлый" 
                        value={newItem.tags?.join(', ')}
                        onChange={(e) => handleArrayInput('tags', e.target.value)}
                        className="w-full bg-white border-none rounded-2xl py-5 px-6 font-medium text-base outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Материалы (через запятую)</label>
                      <input 
                        placeholder="Knauf, Dulux, Egger" 
                        value={newItem.materials?.join(', ')}
                        onChange={(e) => handleArrayInput('materials', e.target.value)}
                        className="w-full bg-white border-none rounded-2xl py-5 px-6 font-medium text-base outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                      />
                    </div>

                    <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-slate-100">
                       <button 
                         type="button"
                         onClick={() => setNewItem({...newItem, isNewBuilding: !newItem.isNewBuilding})}
                         className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${newItem.isNewBuilding ? 'bg-primary border-primary text-primary-foreground' : 'border-slate-300 text-transparent'}`}
                       >
                         <CheckSquare size={16} />
                       </button>
                       <span className="font-bold text-slate-900">Это новостройка</span>
                    </div>
                 </div>
               )}

               {/* MEDIA TAB */}
               {activeTab === 'media' && (
                 <div className="space-y-4 animate-fade-in">
                   <div>
                     <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Фото ДО (URL)</label>
                     <div className="flex items-center gap-2">
                        <input 
                            placeholder="https://..." 
                            value={newItem.imgBefore}
                            onChange={(e) => setNewItem({...newItem, imgBefore: e.target.value})}
                            className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-sm outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                        />
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 overflow-hidden">
                            {newItem.imgBefore ? <img src={newItem.imgBefore} alt="preview" className="w-full h-full object-cover" /> : <ImageIcon size={24} />}
                        </div>
                     </div>
                   </div>

                   <div>
                     <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Фото ПОСЛЕ (URL)</label>
                     <div className="flex items-center gap-2">
                        <input 
                            placeholder="https://..." 
                            value={newItem.imgAfter}
                            onChange={(e) => setNewItem({...newItem, imgAfter: e.target.value})}
                            className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-sm outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                        />
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 overflow-hidden">
                            {newItem.imgAfter ? <img src={newItem.imgAfter} alt="preview" className="w-full h-full object-cover" /> : <ImageIcon size={24} />}
                        </div>
                     </div>
                   </div>
                 </div>
               )}

               <div className="pt-4 mt-8 border-t border-slate-100">
                  <button type="submit" className="w-full bg-primary text-primary-foreground rounded-2xl py-5 font-bold text-xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-transform hover:bg-primary/90">
                    {editingId ? 'Сохранить изменения' : 'Добавить проект'}
                  </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Chevron component for the select dropdown
const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m9 18 6-6-6-6"/>
    </svg>
);
