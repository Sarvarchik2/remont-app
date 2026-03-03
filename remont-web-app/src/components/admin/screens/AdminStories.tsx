import React, { useState } from 'react';
import { translations, Language } from '../../../utils/translations';
import { Story } from '../../../utils/types';
import { AdminModal } from '../AdminModal';
import { MediaUpload } from '../MediaUpload';
import { Plus, Trash2, Edit2, Play, Image as ImageIcon, Check, X, Search, Type, List, Video, Star, Users, Zap } from 'lucide-react';

interface AdminStoriesProps {
  lang: Language;
  stories: Story[];
  onUpdateStories: (stories: Story[]) => void;
}

export const AdminStories: React.FC<AdminStoriesProps> = ({ lang, stories, onUpdateStories }) => {
  const t = (translations[lang].admin as any).stories;
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
    { id: 'process', icon: Play },
    { id: 'reviews', icon: Star },
    { id: 'team', icon: Users },
    { id: 'promo', icon: Zap }
  ];

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setFormData(story);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirm_delete)) {
      onUpdateStories(stories.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl || !formData.title?.ru || !formData.title?.uz || !formData.title?.en) {
      alert(t.required_fields);
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
            {t.title}
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
          className="bg-primary text-black px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={18} />
          {t.add}
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
                {(translations[lang].home.stories as any)[story.category]}
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
        title={editingStory ? t.edit_story : t.new_story}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-4 flex items-center gap-2">
              <Type size={16} className="text-primary" />
              {t.titles}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { key: 'ru', label: 'RU Title', placeholder: 'Монтаж...' },
                { key: 'uz', label: 'UZ Title', placeholder: 'Montaj...' },
                { key: 'en', label: 'EN Title', placeholder: 'Installing...' },
              ].map((langItem) => (
                <div key={langItem.key}>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-4 leading-none">
                    {langItem.label}
                  </label>
                  <input
                    type="text"
                    required
                    value={(formData.title as any)?.[langItem.key] || ''}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title!, [langItem.key]: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 px-5 font-bold text-slate-900 outline-none focus:border-primary/50 focus:bg-white transition-all shadow-sm placeholder:text-slate-400"
                    placeholder={langItem.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
              <List size={16} className="text-primary" />
              {t.category}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id as any })}
                  className={`flex items-center gap-3 p-4 rounded-[24px] border-2 transition-all ${formData.category === cat.id
                    ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'bg-slate-50 text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.category === cat.id ? 'bg-black/10' : 'bg-white shadow-sm'}`}>
                    <cat.icon size={18} className={formData.category === cat.id ? 'text-black' : 'text-slate-400'} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    {(translations[lang].home.stories as any)[cat.id]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
              <ImageIcon size={16} className="text-primary" />
              {t.cover}
            </h4>
            <MediaUpload
              label={null as any}
              values={formData.imageUrl ? [formData.imageUrl] : []}
              onUpload={(urls) => setFormData({ ...formData, imageUrl: urls[0] || '' })}
              multiple={false}
            />
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
              <Video size={16} className="text-primary" />
              {t.video_review || 'Видео обзор'}
            </h4>

            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">
                  {t.upload_video || 'Загрузить видео'}
                </p>
                <MediaUpload
                  multiple={false}
                  accept="video/*"
                  values={formData.videoUrl && !formData.videoUrl.startsWith('http') ? [formData.videoUrl] : []}
                  onUpload={(urls) => setFormData({ ...formData, videoUrl: urls[0] })}
                  label={null as any}
                />
              </div>

              <div className="relative group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-6">
                  {t.video_url || 'Ссылка на видео'} (Vimeo / YouTube)
                </p>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                    <Play size={16} className="fill-current" />
                  </div>
                  <input
                    placeholder="https://vimeo.com/..."
                    value={formData.videoUrl || ''}
                    style={{ padding: '10px 60px' }}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-5 pl-20 pr-8 font-bold text-base outline-none focus:border-primary/50 focus:bg-white transition-all shadow-sm placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-black rounded-full py-5 font-black text-xl shadow-2xl shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all mt-4 uppercase tracking-widest"
          >
            {t.save}
          </button>
        </form>
      </AdminModal>
    </div>
  );
};
