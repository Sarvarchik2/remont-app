import React, { useState } from 'react';
import { translations, Language } from '../../../utils/translations';
import { MOCK_SERVICES, ServiceCategory, ServiceItem } from '../../../utils/mockData';
import { Plus, Trash2, Pencil, ChevronDown, ChevronRight, X, Save, Hammer, Zap, Paintbrush, Grid3x3, Droplet, Home as HomeIcon, Wrench, LucideIcon } from 'lucide-react';

interface AdminServicesProps {
  lang: Language;
  categories: ServiceCategory[];
  onUpdateCategories: React.Dispatch<React.SetStateAction<ServiceCategory[]>>;
}

const ICON_OPTIONS = [
  { name: 'Hammer', icon: Hammer },
  { name: 'Zap', icon: Zap },
  { name: 'Paintbrush', icon: Paintbrush },
  { name: 'Grid3x3', icon: Grid3x3 },
  { name: 'Droplet', icon: Droplet },
  { name: 'HomeIcon', icon: HomeIcon },
  { name: 'Wrench', icon: Wrench }
];

const ICON_MAP: Record<string, LucideIcon> = {
  'Hammer': Hammer,
  'Zap': Zap,
  'Paintbrush': Paintbrush,
  'Grid3x3': Grid3x3,
  'Droplet': Droplet,
  'HomeIcon': HomeIcon,
  'Wrench': Wrench
};

export const AdminServices: React.FC<AdminServicesProps> = ({ lang, categories, onUpdateCategories }) => {
  const setCategories = onUpdateCategories;
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'category' | 'service'>('category');
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [parentId, setParentId] = useState<string | null>(null); // For adding service to a category

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    icon: 'Hammer',
    name: '',
    price: '',
    unit: 'сум/м²'
  });

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  // --- Handlers ---

  const handleAddCategory = () => {
    setModalMode('category');
    setEditingCategory(null);
    setFormData({ title: '', icon: 'Hammer', name: '', price: '', unit: '' });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: ServiceCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode('category');
    setEditingCategory(category);
    setFormData({ ...formData, title: category.title, icon: category.icon });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Удалить категорию и все услуги в ней?')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleAddService = (categoryId: string) => {
    setModalMode('service');
    setParentId(categoryId);
    setEditingService(null);
    setFormData({ title: '', icon: '', name: '', price: '', unit: 'сум/м²' });
    setIsModalOpen(true);
  };

  const handleEditService = (categoryId: string, service: ServiceItem) => {
    setModalMode('service');
    setParentId(categoryId);
    setEditingService(service);
    setFormData({ ...formData, name: service.name, price: service.price, unit: service.unit });
    setIsModalOpen(true);
  };

  const handleDeleteService = (categoryId: string, serviceId: string) => {
    if (confirm('Удалить услугу?')) {
      setCategories(prev => prev.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, services: cat.services.filter(s => s.id !== serviceId) };
        }
        return cat;
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'category') {
      if (editingCategory) {
        // Edit Category
        setCategories(prev => prev.map(c => 
          c.id === editingCategory.id ? { ...c, title: formData.title, icon: formData.icon } : c
        ));
      } else {
        // Add Category
        const newCategory: ServiceCategory = {
          id: `cat-${Date.now()}`,
          title: formData.title,
          icon: formData.icon,
          services: []
        };
        setCategories([...categories, newCategory]);
      }
    } else {
      // Service Mode
      if (!parentId) return;

      if (editingService) {
        // Edit Service
        setCategories(prev => prev.map(c => {
          if (c.id === parentId) {
            return {
              ...c,
              services: c.services.map(s => s.id === editingService.id ? { ...s, name: formData.name, price: formData.price, unit: formData.unit } : s)
            };
          }
          return c;
        }));
      } else {
        // Add Service
        const newService: ServiceItem = {
          id: `srv-${Date.now()}`,
          name: formData.name,
          price: formData.price,
          unit: formData.unit
        };
        setCategories(prev => prev.map(c => {
          if (c.id === parentId) {
            return { ...c, services: [...c.services, newService] };
          }
          return c;
        }));
        // Auto expand the category
        setExpandedCategory(parentId);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            SERVICES
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Услуги и цены</h1>
        </div>
        <button 
          onClick={handleAddCategory}
          className="bg-primary text-black px-6 py-3 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors font-bold text-sm"
        >
          <Plus size={18} className="mr-2" />
          Новая категория
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => {
          const Icon = ICON_MAP[category.icon] || Hammer;
          const isExpanded = expandedCategory === category.id;

          return (
            <div key={category.id} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              {/* Category Header */}
              <div
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-5 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isExpanded ? 'bg-primary text-primary-foreground' : 'bg-slate-50 text-slate-700 group-hover:bg-slate-100'}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{category.title}</h3>
                    <p className="text-xs font-medium text-slate-400">{category.services.length} услуг</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleEditCategory(category, e)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-black hover:bg-slate-200 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteCategory(category.id, e)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                   </div>
                   <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${isExpanded ? 'bg-slate-100 rotate-180' : ''}`}>
                      <ChevronDown size={20} className="text-slate-400" />
                   </div>
                </div>
              </div>

              {/* Services List */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-[#FBFBFA]">
                   {category.services.length === 0 ? (
                       <div className="p-8 text-center text-slate-400 text-sm font-medium">
                           В этой категории пока нет услуг
                       </div>
                   ) : (
                       <div className="divide-y divide-slate-100">
                           {category.services.map((service) => (
                               <div key={service.id} className="px-6 py-4 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                                   <div className="flex-1 pr-4">
                                       <span className="text-slate-700 font-bold text-sm block">{service.name}</span>
                                   </div>
                                   <div className="flex items-center gap-4">
                                       <div className="text-right mr-2">
                                            <div className="text-slate-900 font-black text-sm">{service.price}</div>
                                            <div className="text-slate-400 text-[10px] uppercase font-bold">{service.unit}</div>
                                       </div>
                                       <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEditService(category.id, service)}
                                                className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-black hover:border-slate-300 transition-colors shadow-sm"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteService(category.id, service.id)}
                                                className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}
                   
                   {/* Add Service Button */}
                   <div className="p-4 border-t border-slate-100">
                       <button 
                         onClick={() => handleAddService(category.id)}
                         className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm hover:border-slate-300 hover:text-slate-600 transition-all flex items-center justify-center gap-2"
                       >
                           <Plus size={16} />
                           Добавить услугу
                       </button>
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-[#F9F9F7] rounded-t-[40px] sm:rounded-[40px] w-full max-w-lg p-8 animate-slide-up sm:animate-fade-in max-h-[90vh] overflow-y-auto shadow-2xl">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black text-slate-900">
                   {modalMode === 'category' 
                     ? (editingCategory ? 'Редактировать категорию' : 'Новая категория')
                     : (editingService ? 'Редактировать услугу' : 'Новая услуга')
                   }
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-900 hover:bg-slate-100 transition-colors">
                 <X size={20} />
               </button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                {modalMode === 'category' ? (
                    // Category Form
                    <>
                        <div>
                            <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Название</label>
                            <input 
                                placeholder="Например: Электрика" 
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                                autoFocus
                                className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Иконка</label>
                            <div className="grid grid-cols-4 gap-2">
                                {ICON_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.name}
                                        type="button"
                                        onClick={() => setFormData({...formData, icon: opt.name})}
                                        className={`p-4 rounded-2xl flex items-center justify-center transition-all ${
                                            formData.icon === opt.name 
                                                ? 'bg-black text-white shadow-lg scale-105' 
                                                : 'bg-white text-slate-400 hover:bg-slate-50'
                                        }`}
                                    >
                                        <opt.icon size={24} />
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 mt-4 px-2">
                                * Цены редактируются внутри списка услуг (кнопка редактирования напротив каждой услуги)
                            </p>
                        </div>
                    </>
                ) : (
                    // Service Form
                    <>
                        <div>
                            <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Название услуги</label>
                            <input 
                                placeholder="Например: Установка розетки" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                autoFocus
                                className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Цена</label>
                                <input 
                                    placeholder="35 000" 
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    required
                                    className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Ед. измерения</label>
                                <input 
                                    placeholder="сум/шт" 
                                    value={formData.unit}
                                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                                    required
                                    className="w-full bg-white border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                                />
                            </div>
                        </div>
                    </>
                )}

                <button type="submit" className="w-full bg-black text-white rounded-2xl py-5 font-bold text-xl shadow-xl shadow-black/20 mt-6 active:scale-[0.98] transition-transform hover:bg-slate-900">
                    Сохранить
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
