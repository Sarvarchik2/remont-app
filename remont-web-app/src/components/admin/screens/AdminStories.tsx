import React, { useState } from 'react';
import { translations, Language } from '../../../utils/translations';
import { Story } from '../../../utils/types';
import { AdminModal } from '../AdminModal';
import { MediaUpload } from '../MediaUpload';
import { Plus, Trash2, Edit2, Play, Image as ImageIcon, Check, X, Search, Type, List, Video } from 'lucide-react';

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
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStory ? "Редактировать сторис" : "Новая сторис"}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
              <Type size={16} className="text-primary" />
              Заголовки (Title)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { key: 'ru', label: 'RU Sarlavha', placeholder: 'Монтаж...' },
                { key: 'uz', label: 'UZ Sarlavha', placeholder: 'Montaj...' },
                { key: 'en', label: 'EN Title', placeholder: 'Installing...' },
              ].map((langItem) => (
                <div key={langItem.key}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-4 leading-none">
                    {langItem.label}
                  </label>
                  <input
                    type="text"
                    required
                    value={(formData.title as any)?.[langItem.key] || ''}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title!, [langItem.key]: e.target.value } })}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] py-4 px-5 font-bold text-slate-900 outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm placeholder:text-slate-300"
                    placeholder={langItem.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
              <List size={16} className="text-primary" />
              Категория
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-1.5 bg-slate-50 rounded-[24px]">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id as any })}
                  className={`py-3.5 px-3 rounded-[18px] text-[11px] font-black uppercase tracking-wider transition-all border-2 ${formData.category === cat.id
                    ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  {cat.label.split('/')[lang === 'ru' ? 0 : lang === 'en' ? 2 : 1] || cat.label.split('/')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
              <ImageIcon size={16} className="text-primary" />
              Обложка
            </h4>
            <MediaUpload
              label={null as any}
              values={formData.imageUrl ? [formData.imageUrl] : []}
              onUpload={(urls) => setFormData({ ...formData, imageUrl: urls[0] || '' })}
              multiple={false}
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
              <Video size={16} className="text-primary" />
              Видео (Optional)
            </h4>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                <Play size={14} className="fill-current" />
              </div>
              <input
                type="text"
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] py-4 pl-16 pr-5 font-bold text-slate-900 outline-none focus:border-primary/20 focus:bg-white transition-all shadow-sm placeholder:text-slate-300"
                placeholder="https://vimeo.com/... / Direct URL"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white rounded-[24px] py-5 font-black text-xl shadow-2xl shadow-black/30 hover:bg-slate-900 active:scale-[0.98] transition-all mt-6 uppercase tracking-widest"
          >
            {lang === 'ru' ? 'Сохранить' : 'Saqlash'}
          </button>
        </form>
      </AdminModal>
    </div>
  );
};
