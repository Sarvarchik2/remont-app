import React, { useState } from 'react';
import { translations, Language } from '../../../utils/translations';
import { Story } from '../../../utils/types';
import { Plus, Trash2, Edit2, Play, Image as ImageIcon, Check, X, Search } from 'lucide-react';

interface AdminStoriesProps {
  lang: Language;
  stories: Story[];
  onUpdateStories: (stories: Story[]) => void;
}

export const AdminStories: React.FC<AdminStoriesProps> = ({ lang, stories, onUpdateStories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Story>>({
    category: 'process',
    title: { ru: '', uz: '', en: '' },
    imageUrl: '',
    videoUrl: ''
  });

  const categories = [
    { id: 'process', label: 'Процесс / Jarayon' },
    { id: 'reviews', label: 'Отзывы / Sharhlar' },
    { id: 'team', label: 'Команда / Jamoa' },
    { id: 'promo', label: 'Акции / Aksiya' }
  ];

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setFormData(story);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены? / Ishonchingiz komilmi?')) {
      onUpdateStories(stories.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl || !formData.title?.ru || !formData.title?.uz || !formData.title?.en) {
      alert('Заполните все обязательные поля');
      return;
    }

    if (editingStory) {
      // Update
      const updated = stories.map(s => s.id === editingStory.id ? { ...formData, id: s.id } as Story : s);
      onUpdateStories(updated);
    } else {
      // Create
      const newStory: Story = {
        ...formData as Story,
        id: Date.now().toString(),
      };
      onUpdateStories([newStory, ...stories]);
    }

    setIsModalOpen(false);
    setEditingStory(null);
    setFormData({
      category: 'process',
      title: { ru: '', uz: '', en: '' },
      imageUrl: '',
      videoUrl: ''
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            CONTENT
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            {lang === 'ru' ? 'Сторис' : 'Stories'}
          </h1>
        </div>
        <button
          onClick={() => {
            setEditingStory(null);
            setFormData({
              category: 'process',
              title: { ru: '', uz: '', en: '' },
              imageUrl: '',
              videoUrl: ''
            });
            setIsModalOpen(true);
          }}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={18} />
          {lang === 'ru' ? 'Добавить' : 'Qo\'shish'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {stories.map((story) => (
          <div key={story.id} className="group relative aspect-[9/16] bg-slate-100 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <img
              src={story.imageUrl}
              alt={story.title[lang]}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">
                {categories.find(c => c.id === story.category)?.label.split('/')[lang === 'ru' ? 0 : lang === 'en' ? 2 : 1] || categories.find(c => c.id === story.category)?.label.split('/')[0]}
              </span>
              <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
                {story.title[lang]}
              </h3>
            </div>

            {/* Actions Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <button
                onClick={() => handleEdit(story)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-110 transition-transform shadow-lg"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(story.id)}
                className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {story.videoUrl && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <Play size={10} className="text-white fill-current" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {editingStory
                  ? (lang === 'ru' ? 'Редактировать сторис' : lang === 'en' ? 'Edit Story' : 'Tahrirlash')
                  : (lang === 'ru' ? 'Новая сторис' : lang === 'en' ? 'New Story' : 'Yangi story')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">RU Заголовок</label>
                  <input
                    type="text"
                    required
                    value={formData.title?.ru}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title!, ru: e.target.value } })}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="Например: Монтаж"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">UZ Sarlavha</label>
                  <input
                    type="text"
                    required
                    value={formData.title?.uz}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title!, uz: e.target.value } })}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="Masalan: Montaj"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">EN Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title?.en}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title!, en: e.target.value } })}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="E.g: Mount"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Категория / Kategoriya</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id as any })}
                      className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${formData.category === cat.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      {cat.label.split('/')[lang === 'ru' ? 0 : lang === 'en' ? 2 : 1] || cat.label.split('/')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Фото (URL)</label>
                <div className="relative">
                  <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="https://..."
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 h-32 w-full rounded-xl overflow-hidden bg-slate-100">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+URL')} />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Видео (Optional URL)</label>
                <div className="relative">
                  <Play size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.videoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-transform mt-4"
              >
                {lang === 'ru' ? 'Сохранить' : 'Saqlash'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
