import React, { useState, Dispatch, SetStateAction } from 'react';
import { translations, Language } from '../../../utils/translations';
import { CatalogItem } from '../../../utils/types';
import { AdminModal } from '../AdminModal';
import { MediaUpload } from '../MediaUpload';
import { Plus, Trash2, Pencil, Search, X, Image as ImageIcon, Check, Type, List, DollarSign, Video } from 'lucide-react';

interface AdminCatalogProps {
    lang: Language;
    catalog: CatalogItem[];
    onUpdateCatalog: Dispatch<SetStateAction<CatalogItem[]>>;
}

export const AdminCatalog: React.FC<AdminCatalogProps> = ({ lang, catalog, onUpdateCatalog }) => {
    const setCatalog = onUpdateCatalog;
    const t = translations[lang].admin.catalog;

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
        specs: [],
        videoUrl: ''
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
        if (confirm(t.confirm_delete)) {
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
                specs: newItem.specs || [],
                videoUrl: newItem.videoUrl || ''
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
    const catLabels = (translations[lang].catalog as any).categories;

    return (
        <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                        SHOP
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setNewItem(defaultItem);
                        setIsModalOpen(true);
                    }}
                    className="bg-primary text-black px-6 py-3 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors font-bold text-sm active:scale-95"
                >
                    <Plus size={18} className="mr-2" />
                    {t.add_product}
                </button>
            </div>

            {/* Filters & Search Bar */}
            <div className="bg-white p-4 md:p-6 rounded-[32px] border border-slate-100 shadow-sm mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
                <div className="relative flex-shrink-0 w-full md:w-[320px]">
                    <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.search}
                        className="w-full pl-14 pr-6 py-4 rounded-full border border-slate-100 bg-slate-50 font-bold text-slate-900 outline-none focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-400"
                    />
                </div>

                <div className="flex items-center overflow-x-auto hide-scrollbar gap-2 pb-2 md:pb-0 flex-grow">
                    <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden md:block" />
                    {categories.map((catKey) => (
                        <button
                            key={catKey}
                            onClick={() => setFilterCategory(catKey)}
                            className={`whitespace-nowrap px-6 py-3.5 rounded-full text-[13px] font-bold transition-all border-2 ${filterCategory === catKey
                                ? 'bg-black text-white border-black shadow-lg shadow-black/10 scale-105'
                                : 'bg-white text-slate-500 border-transparent hover:border-slate-100 hover:bg-slate-50'
                                }`}
                        >
                            {catKey === 'all' ? catLabels.all : catLabels[catKey as keyof typeof catLabels]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredCatalog.map(item => (
                    <div key={item.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group flex flex-col hover:shadow-xl transition-all duration-500 h-full">
                        <div className="relative h-60 bg-slate-50 shrink-0 overflow-hidden">
                            <img
                                src={item.image}
                                alt="preview"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Glass-style Category Badge */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2.5 bg-black/30 backdrop-blur-md rounded-full text-[10px] uppercase font-black text-white shadow-2xl border border-white/10 tracking-[0.2em] pointer-events-none">
                                {catLabels[item.category as keyof typeof catLabels]}
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all translate-y-0 md:translate-y-2 group-hover:translate-y-0 z-20">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center text-slate-600 shadow-xl hover:bg-white hover:text-black hover:scale-110 transition-all active:scale-90"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(item.id, e)}
                                    className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center text-red-400 shadow-xl hover:bg-red-500 hover:text-white hover:scale-110 transition-all active:scale-90"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-bold text-slate-900 text-lg mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                {item.title[lang] || (item.title as any)?.ru || ''}
                            </h3>

                            <div className="mt-auto flex items-end justify-between">
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{t.price_label}</div>
                                    <span className="font-black text-slate-900 text-2xl tracking-tighter">
                                        {item.price.toLocaleString()}
                                    </span>
                                    <span className="text-slate-400 text-[11px] ml-1.5 uppercase font-black tracking-widest">UZS</span>
                                </div>

                                {item.videoUrl && (
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Video size={18} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={editingId ? t.edit : t.new}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSave} className="space-y-12">
                    <div className="flex items-center gap-4 bg-slate-100/50 p-1.5 rounded-[24px] w-fit border border-slate-200/60 shadow-inner">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-5 mr-1 leading-none opacity-60">{t.input_lang}:</span>
                        {(['ru', 'uz', 'en'] as const).map(l => (
                            <button
                                type="button"
                                key={l}
                                onClick={() => setInputLang(l)}
                                className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-[11px] uppercase transition-all ${inputLang === l ? 'bg-primary text-black shadow-xl shadow-primary/20 scale-110' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-8 bg-white/50 p-6 rounded-[32px] border border-slate-100">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Type size={18} strokeWidth={2.5} />
                            </div>
                            {t.main_info}
                        </h4>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-4 flex items-center gap-2">
                                    {t.title_label} <span className="bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-md text-[9px]">{inputLang.toUpperCase()}</span>
                                </label>
                                <input
                                    placeholder="e.g. Lamp Kristall"
                                    value={newItem.title?.[inputLang] || ''}
                                    onChange={(e) => handleTitleChange(inputLang, e.target.value)}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 px-6 font-bold text-base outline-none focus:border-primary/50 focus:bg-white transition-all shadow-sm placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-4 flex items-center gap-2">
                                    {t.desc_label} <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md text-[9px]">{inputLang.toUpperCase()}</span>
                                </label>
                                <textarea
                                    placeholder="Detailed info..."
                                    value={newItem.description?.[inputLang] || ''}
                                    onChange={(e) => {
                                        setNewItem(prev => ({
                                            ...prev,
                                            description: { ...prev.description, [inputLang]: e.target.value } as Record<Language, string>
                                        }));
                                    }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[24px] py-4 px-6 font-medium text-base outline-none focus:border-primary/50 focus:bg-white transition-all shadow-sm placeholder:text-slate-400 min-h-[120px] resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 bg-white/50 p-6 rounded-[32px] border border-slate-100">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <DollarSign size={18} strokeWidth={2.5} />
                            </div>
                            {t.specs}
                        </h4>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-4">{t.price_uzs}</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={newItem.price || ''}
                                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 px-6 font-black text-base outline-none focus:border-primary/50 focus:bg-white transition-all shadow-sm placeholder:text-slate-400"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-4">{t.category_label}</label>
                                <div className="relative">
                                    <select
                                        value={newItem.category || 'materials'}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 px-6 font-bold text-base outline-none focus:border-primary/50 focus:bg-white transition-all shadow-sm appearance-none"
                                    >
                                        <option value="materials">{catLabels.materials}</option>
                                        <option value="furniture">{catLabels.furniture}</option>
                                        <option value="lighting">{catLabels.lighting}</option>
                                        <option value="plumbing">{catLabels.plumbing}</option>
                                        <option value="decor">{catLabels.decor}</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <List size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 bg-white/50 p-6 rounded-[32px] border border-slate-100">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <ImageIcon size={18} strokeWidth={2.5} />
                            </div>
                            {t.media_assets}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.main_photo}</p>
                                <div className="bg-slate-50/50 p-4 rounded-[28px] border border-slate-100/50">
                                    <MediaUpload
                                        multiple={false}
                                        values={newItem.image ? [newItem.image] : []}
                                        onUpload={(urls) => setNewItem({ ...newItem, image: urls[0] })}
                                        label={null as any}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.gallery}</p>
                                <div className="bg-slate-50/50 p-4 rounded-[28px] border border-slate-100/50">
                                    <MediaUpload
                                        multiple={true}
                                        values={newItem.images || []}
                                        onUpload={(urls) => setNewItem({ ...newItem, images: urls })}
                                        label={null as any}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 bg-white/50 p-6 rounded-[32px] border border-slate-100">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Video size={18} strokeWidth={2.5} />
                            </div>
                            {t.video}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100/50">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-2">{t.upload_video}</p>
                                <MediaUpload
                                    multiple={false}
                                    accept="video/*"
                                    values={newItem.videoUrl && !newItem.videoUrl.startsWith('http') ? [newItem.videoUrl] : []}
                                    onUpload={(urls) => setNewItem({ ...newItem, videoUrl: urls[0] })}
                                    label={null as any}
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-6 block">{t.video_url} (YouTube/Vimeo)</label>
                                <input
                                    placeholder="https://..."
                                    value={newItem.videoUrl || ''}
                                    onChange={(e) => setNewItem({ ...newItem, videoUrl: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 px-6 font-bold text-base outline-none focus:border-primary/50 focus:bg-white transition-all shadow-sm placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 flex gap-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-10 bg-slate-50 text-slate-400 border border-slate-100 rounded-full py-5 font-black text-[12px] uppercase tracking-[0.15em] hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-[0.98] shadow-sm"
                        >
                            {t.cancel}
                        </button>
                        <button type="submit" className="flex-1 bg-primary text-black rounded-full py-5 font-black text-[12px] shadow-2xl shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all uppercase tracking-[0.15em] border border-primary/20">
                            {editingId ? t.save : t.add}
                        </button>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
};
