import React, { useState, Dispatch, SetStateAction } from 'react';
import { translations, Language } from '../../../utils/translations';
import { CatalogItem } from '../../../utils/types';
import { AdminModal } from '../AdminModal';
import { ImageUpload } from '../ImageUpload';
import { Plus, Trash2, Pencil, Search, X, Image as ImageIcon, Check } from 'lucide-react';

interface AdminCatalogProps {
    lang: Language;
    catalog: CatalogItem[];
    onUpdateCatalog: Dispatch<SetStateAction<CatalogItem[]>>;
}

export const AdminCatalog: React.FC<AdminCatalogProps> = ({ lang, catalog, onUpdateCatalog }) => {
    const setCatalog = onUpdateCatalog;
    const t = translations[lang].catalog;

    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [inputLang, setInputLang] = useState<Language>('ru');

    const defaultItem: Partial<CatalogItem> = {
        category: 'materials',
        title: { ru: '', uz: '', en: '' },
        description: { ru: '', uz: '', en: '' },
        price: 0,
        image: '',
        images: [],
        specs: []
    };

    const [newItem, setNewItem] = useState<Partial<CatalogItem>>(defaultItem);

    const filteredCatalog = catalog.filter(item => {
        const title = typeof item.title === 'string' ? item.title : item.title?.[lang] || (item.title as any)?.ru || '';
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            setCatalog(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleEdit = (item: CatalogItem) => {
        setNewItem(item);
        setEditingId(item.id);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setNewItem(defaultItem);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.title?.ru || !newItem.price) return;

        if (editingId) {
            setCatalog(prev => prev.map(item =>
                item.id === editingId ? { ...item, ...newItem } as CatalogItem : item
            ));
        } else {
            const item: CatalogItem = {
                id: `cat-${Date.now()}`,
                category: newItem.category as any || 'materials',
                title: newItem.title! || { ru: 'Новый товар', uz: 'Yangi mahsulot', en: 'New product' },
                description: newItem.description || { ru: '', uz: '', en: '' },
                price: Number(newItem.price),
                image: newItem.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
                images: newItem.images || [],
                specs: newItem.specs || []
            };
            setCatalog([item, ...catalog]);
        }
        handleClose();
    };

    const handleTitleChange = (langKey: Language, value: string) => {
        setNewItem(prev => ({
            ...prev,
            title: { ...prev.title, [langKey]: value } as Record<Language, string>
        }));
    };

    const categories = ['all', 'materials', 'furniture', 'lighting', 'plumbing', 'decor'];

    return (
        <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                        SHOP
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900">Каталог товаров</h1>
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
                    Добавить товар
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search size={20} />
                    </div>
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск по названию..."
                        className="w-full pl-14 pr-4 py-4 rounded-[24px] border border-slate-200 bg-white font-bold text-slate-900 outline-none focus:border-primary transition-colors placeholder:text-slate-400 shadow-sm"
                    />
                </div>
                <div className="flex overflow-x-auto hide-scrollbar gap-2 md:w-auto w-full py-2 md:py-0">
                    {categories.map((catKey) => (
                        <button
                            key={catKey}
                            onClick={() => setFilterCategory(catKey)}
                            className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold transition-all border ${filterCategory === catKey
                                ? 'bg-black text-white border-black shadow-lg shadow-black/20'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            {catKey === 'all' ? t.categories.all : t.categories[catKey as keyof typeof t.categories]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredCatalog.map(item => (
                    <div key={item.id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100 group flex flex-col hover:shadow-md transition-shadow">
                        <div className="relative h-40 bg-slate-50 p-4 shrink-0 flex items-center justify-center">
                            <img src={item.image} alt="preview" className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 backdrop-blur rounded-lg text-[10px] uppercase font-bold text-slate-500 shadow-sm border border-white/50">
                                {t.categories[item.category as keyof typeof t.categories]}
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(item)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm hover:text-black">
                                    <Pencil size={14} />
                                </button>
                                <button onClick={(e) => handleDelete(item.id, e)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm hover:text-red-500">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2">{item.title.ru}</h3>
                            <div className="mt-auto pt-2">
                                <span className="font-black text-slate-900 text-base">{item.price.toLocaleString()}</span>
                                <span className="text-slate-400 text-[10px] ml-1 uppercase font-bold">Сум</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={editingId ? "Редактировать товар" : "Новый товар"}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Language Switcher for Inputs */}
                    <div className="flex space-x-2 mb-6 border-b border-slate-100 pb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest self-center mr-2">Язык ввода:</span>
                        {(['ru', 'uz', 'en'] as const).map(l => (
                            <button
                                type="button"
                                key={l}
                                onClick={() => setInputLang(l)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase transition-all ${inputLang === l ? 'bg-primary text-black shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-4 mb-2 flex items-center gap-2 uppercase tracking-wide">
                            Название <span className="bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">{inputLang.toUpperCase()}</span>
                        </label>
                        <input
                            placeholder="Например: Люстра Kristall"
                            value={newItem.title?.[inputLang] || ''}
                            onChange={(e) => handleTitleChange(inputLang, e.target.value)}
                            required
                            autoFocus
                            className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-4 mb-2 flex items-center gap-2 uppercase tracking-wide">
                            Описание <span className="bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">{inputLang.toUpperCase()}</span>
                        </label>
                        <textarea
                            placeholder="Подробное описание товара..."
                            value={newItem.description?.[inputLang] || ''}
                            onChange={(e) => {
                                setNewItem(prev => ({
                                    ...prev,
                                    description: { ...prev.description, [inputLang]: e.target.value } as Record<Language, string>
                                }));
                            }}
                            className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-medium text-base outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5 min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Цена (UZS)</label>
                            <input
                                type="number"
                                placeholder="1 500 000"
                                value={newItem.price || ''}
                                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                                required
                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-lg outline-none shadow-sm placeholder:text-slate-300 focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 ml-4 mb-2 block uppercase tracking-wide">Категория</label>
                            <select
                                value={newItem.category || 'materials'}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-base outline-none shadow-sm focus:ring-2 focus:ring-black/5 appearance-none"
                            >
                                <option value="materials">Материалы</option>
                                <option value="furniture">Мебель</option>
                                <option value="lighting">Освещение</option>
                                <option value="plumbing">Сантехника</option>
                                <option value="decor">Декор</option>
                            </select>
                        </div>
                    </div>

                    <ImageUpload
                        label="Фото товара"
                        value={newItem.image || ''}
                        onUpload={(url) => setNewItem({ ...newItem, image: url })}
                    />

                    <div className="pt-4 border-t border-slate-100">
                        <button type="submit" className="w-full bg-black text-white rounded-2xl py-5 font-bold text-xl shadow-xl shadow-black/10 transition-transform active:scale-[0.98]">
                            {editingId ? 'Сохранить изменения' : 'Добавить товар'}
                        </button>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
};
