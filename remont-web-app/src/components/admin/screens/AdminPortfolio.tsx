import React, { useState, Dispatch, SetStateAction } from 'react';
import { translations, Language } from '../../../utils/translations';
import { PortfolioItem } from '../../../utils/types';
import { AdminModal } from '../AdminModal';
import { MediaUpload } from '../MediaUpload';
import { Plus, Trash2, MapPin, Ruler, Clock, X, Image as ImageIcon, Pencil, CheckSquare, List, Type, Video, Play, DollarSign, Layers, Users, Star } from 'lucide-react';

interface AdminPortfolioProps {
  lang: Language;
  portfolio: PortfolioItem[];
  onUpdatePortfolio: Dispatch<SetStateAction<PortfolioItem[]>>;
}

export const AdminPortfolio: React.FC<AdminPortfolioProps> = ({ lang, portfolio, onUpdatePortfolio }) => {
  const setPortfolio = onUpdatePortfolio;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'details' | 'media'>('general');
  const [inputLang, setInputLang] = useState<Language>('ru');

  // Form State
  const defaultItem: Partial<PortfolioItem> = {
    type: 'living',
    title: { ru: '', uz: '', en: '' },
    area: '',
    term: '',
    cost: '',
    location: '',
    description: { ru: '', uz: '', en: '' },
    tags: [],
    materials: [],
    isNewBuilding: false,
    imgBefore: '',
    imgAfter: '',
    gallery: [],
    videoUrl: '',
    worksCompleted: [],
    team: []
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
        title: newItem.title || { ru: 'Новый проект', uz: 'Yangi loyiha', en: 'New project' },
        area: newItem.area!,
        term: newItem.term || '1 мес',
        cost: newItem.cost || '0',
        location: newItem.location || 'Ташкент',
        description: newItem.description || { ru: '', uz: '', en: '' },
        tags: newItem.tags || [],
        materials: newItem.materials || [],
        isNewBuilding: newItem.isNewBuilding || false,
        imgBefore: newItem.imgBefore || '',
        imgAfter: newItem.imgAfter || '',
        gallery: newItem.gallery || [],
        videoUrl: newItem.videoUrl || '',
        worksCompleted: newItem.worksCompleted || [],
        team: newItem.team || []
      };
      setPortfolio([item, ...portfolio]);
    }
    handleClose();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
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
          className="bg-primary text-black px-6 py-3 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-bold text-sm active:scale-95"
        >
          <Plus size={18} className="mr-2" />
          Добавить проект
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <div key={item.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-md transition-all flex flex-col h-full relative">
            <div className="relative h-64 overflow-hidden">
              <img
                src={item.imgAfter || 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6?auto=format&fit=crop&w=800&q=80'}
                alt={typeof item.title === 'string' ? item.title : (item.title as any)?.[lang] || (item.title as any)?.ru}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-900 uppercase tracking-wider shadow-sm border border-white/50">
                {item.type === 'living' ? 'Гостиная' : item.type === 'kitchen' ? 'Кухня' : item.type === 'bath' ? 'Ванная' : 'Спальня'}
              </div>

              {/* Actions */}
              <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                  className="w-10 h-10 flex items-center justify-center bg-white/95 backdrop-blur-md rounded-xl text-slate-900 hover:bg-primary transition-all shadow-md"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                  className="w-10 h-10 flex items-center justify-center bg-white/95 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-bold text-slate-900 text-xl leading-snug mb-4 group-hover:text-primary transition-colors line-clamp-2">
                {typeof item.title === 'string' ? item.title : (item.title as any)?.[lang] || (item.title as any)?.ru}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Площадь</span>
                  <span className="text-sm font-bold text-slate-900">{item.area} м²</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Срок</span>
                  <span className="text-sm font-bold text-slate-900">{item.term}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Бюджет</span>
                <span className="font-black text-slate-900 text-lg tracking-tight">{item.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingId ? "Редактировать проект" : "Новый проект"}
        maxWidth="max-w-3xl"
      >
        {/* Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-[24px] w-fit mb-8 border border-slate-100/50">
          {[
            { id: 'general', label: 'Основное', icon: Type },
            { id: 'details', label: 'Детали', icon: List },
            { id: 'media', label: 'Медиа', icon: ImageIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-[0_8px_20px_rgba(0,0,0,0.06)] scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <tab.icon size={14} className={activeTab === tab.id ? 'text-primary' : ''} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Language Switcher for Inputs */}
        <div className="flex items-center gap-2 mb-8 bg-slate-50 p-2 rounded-[22px] w-fit">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4 mr-2 leading-none">Язык:</span>
          {(['ru', 'uz', 'en'] as const).map(l => (
            <button
              key={l}
              type="button"
              onClick={() => setInputLang(l)}
              className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-[11px] uppercase transition-all ${inputLang === l ? 'bg-black text-white shadow-xl scale-110' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
            >
              {l}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-10">

          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Star size={16} className="text-primary" />
                  Информация
                </h4>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-5 flex items-center gap-2">
                    Название ЖК / Проекта <span className="bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-md text-[9px]">{inputLang.toUpperCase()}</span>
                  </label>
                  <input
                    placeholder="ЖК Infinity"
                    value={typeof newItem.title === 'string' ? newItem.title : (newItem.title as any)?.[inputLang] || ''}
                    onChange={(e) => {
                      const newTitle = typeof newItem.title === 'string'
                        ? { ru: newItem.title, uz: newItem.title, en: newItem.title, [inputLang]: e.target.value }
                        : { ...(newItem.title as any) || { ru: '', uz: '', en: '' }, [inputLang]: e.target.value };
                      setNewItem({ ...newItem, title: newTitle });
                    }}
                    required
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 px-6 font-bold text-lg outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm placeholder:text-slate-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-5">Тип помещения</label>
                    <div className="relative">
                      <select
                        className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 px-6 font-bold text-base outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                        value={newItem.type}
                        onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
                      >
                        <option value="living">Гостиная</option>
                        <option value="kitchen">Кухня</option>
                        <option value="bath">Ванная</option>
                        <option value="bedroom">Спальня</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Layers size={18} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-5">Площадь (м²)</label>
                    <div className="relative">
                      <Ruler size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        placeholder="85"
                        value={newItem.area}
                        onChange={(e) => setNewItem({ ...newItem, area: e.target.value })}
                        required
                        className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 pl-14 pr-6 font-bold text-lg outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-5">Срок реализации</label>
                    <div className="relative">
                      <Clock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        placeholder="2 мес"
                        value={newItem.term}
                        onChange={(e) => setNewItem({ ...newItem, term: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 pl-14 pr-6 font-bold text-lg outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-5">Бюджет</label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        placeholder="150М"
                        value={newItem.cost}
                        onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 pl-14 pr-6 font-bold text-lg outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-5">Локация</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      placeholder="Ташкент, Шайхантахур"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 pl-14 pr-6 font-bold text-base outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DETAILS TAB */}
          {activeTab === 'details' && (
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                  <List size={16} className="text-primary" />
                  Подробности
                </h4>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-5 flex items-center gap-2">
                    Описание <span className="bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-md text-[9px]">{inputLang.toUpperCase()}</span>
                  </label>
                  <textarea
                    placeholder="Расскажите о проекте подробнее..."
                    value={typeof newItem.description === 'string' ? newItem.description : (newItem.description as any)?.[inputLang] || ''}
                    onChange={(e) => {
                      const newDesc = typeof newItem.description === 'string'
                        ? { ru: newItem.description, uz: newItem.description, en: newItem.description, [inputLang]: e.target.value }
                        : { ...(newItem.description as any) || { ru: '', uz: '', en: '' }, [inputLang]: e.target.value };
                      setNewItem({ ...newItem, description: newDesc });
                    }}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[28px] py-5 px-7 font-medium text-base outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm placeholder:text-slate-300 min-h-[140px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-5">Теги (через запятую)</label>
                    <input
                      placeholder="Минимализм, Лофт"
                      value={newItem.tags?.join(', ') || ''}
                      onChange={(e) => handleArrayInput('tags', e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 px-6 font-bold text-base outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-5">Материалы (через запятую)</label>
                    <input
                      placeholder="Knauf, Egger"
                      value={newItem.materials?.join(', ') || ''}
                      onChange={(e) => handleArrayInput('materials', e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 px-6 font-bold text-base outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div
                  onClick={() => setNewItem({ ...newItem, isNewBuilding: !newItem.isNewBuilding })}
                  className="flex items-center gap-4 bg-slate-50 p-6 rounded-[28px] border-2 border-transparent hover:border-primary/20 cursor-pointer transition-all"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${newItem.isNewBuilding ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-110' : 'bg-white border-2 border-slate-200 text-transparent'}`}>
                    <CheckSquare size={20} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 leading-none mb-1">Новостройка</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Отметьте, если это новый жилой комплекс</p>
                  </div>
                </div>
              </div>

              {/* Works Completed Section */}
              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                  <CheckSquare size={16} className="text-primary" />
                  Выполненные работы
                </h4>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100/50 p-3 rounded-xl border border-slate-100">
                    Формат: Категория: работа 1, работа 2 (каждая категория с новой строки)
                  </p>
                  <textarea
                    placeholder={"Черновая: Стяжка, Штукатурка\nЧистовая: Покраска, Обои"}
                    value={newItem.worksCompleted?.map(w => `${w.category}: ${w.items.join(', ')}`).join('\n') || ''}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').filter(Boolean);
                      const works = lines.map(line => {
                        const [category, itemsStr] = line.split(':');
                        return {
                          category: category?.trim() || 'Общие',
                          items: itemsStr?.split(',').map(i => i.trim()).filter(Boolean) || []
                        };
                      });
                      setNewItem({ ...newItem, worksCompleted: works });
                    }}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[28px] py-5 px-7 font-medium text-base outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm placeholder:text-slate-300 min-h-[120px] resize-none"
                  />
                </div>
              </div>

              {/* Team Section */}
              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  Команда проекта
                </h4>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100/50 p-3 rounded-xl border border-slate-100">
                    Формат: Имя | Роль (каждый участник с новой строки)
                  </p>
                  <textarea
                    placeholder={"Иван Иванов | Дизайнер\nПетр Петров | Прораб"}
                    value={newItem.team?.map(m => {
                      const name = typeof m.name === 'string' ? m.name : m.name?.[inputLang] || (m.name as any)?.ru;
                      return `${name} | ${m.role}`;
                    }).join('\n') || ''}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').filter(Boolean);
                      const team = lines.map(line => {
                        const [name, role] = line.split('|');
                        return {
                          name: { ru: name?.trim() || '', uz: name?.trim() || '', en: name?.trim() || '' },
                          role: role?.trim() || 'Специалист',
                          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80' // Default avatar
                        };
                      });
                      setNewItem({ ...newItem, team: team });
                    }}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[28px] py-5 px-7 font-medium text-base outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm placeholder:text-slate-300 min-h-[120px] resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* MEDIA TAB */}
          {activeTab === 'media' && (
            <div className="space-y-10 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Star size={14} className="text-amber-400" />
                    Фото ДО
                  </h4>
                  <MediaUpload
                    multiple={false}
                    values={newItem.imgBefore ? [newItem.imgBefore] : []}
                    onUpload={(urls) => setNewItem({ ...newItem, imgBefore: urls[0] })}
                    label={null as any}
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Star size={14} className="text-green-500" />
                    Фото ПОСЛЕ
                  </h4>
                  <MediaUpload
                    multiple={false}
                    values={newItem.imgAfter ? [newItem.imgAfter] : []}
                    onUpload={(urls) => setNewItem({ ...newItem, imgAfter: urls[0] })}
                    label={null as any}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                  <ImageIcon size={16} className="text-primary" />
                  Галерея проекта (Все фото)
                </h4>
                <MediaUpload
                  multiple={true}
                  values={newItem.gallery || []}
                  onUpload={(urls) => setNewItem({ ...newItem, gallery: urls })}
                  label={null as any}
                />
              </div>

              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Video size={16} className="text-primary" />
                  Видео обзор (URL)
                </h4>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                    <Play size={16} className="fill-current" />
                  </div>
                  <input
                    placeholder="https://vimeo.com/... / Direct URL"
                    value={newItem.videoUrl || ''}
                    onChange={(e) => setNewItem({ ...newItem, videoUrl: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-4 pl-20 pr-6 font-bold text-base outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-slate-100 flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-10 bg-slate-100 text-slate-500 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white rounded-[26px] py-5 font-black text-xl shadow-2xl shadow-black/30 active:scale-[0.98] transition-transform hover:bg-slate-900 uppercase tracking-widest"
            >
              {editingId ? 'Сохранить изменения' : 'Опубликовать проект'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
