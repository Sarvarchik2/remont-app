import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Language } from '../../utils/translations';
import { Story } from '../../utils/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface StoriesModalProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const StoriesModal: React.FC<StoriesModalProps> = ({ stories, initialIndex, isOpen, onClose, lang }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setProgress(0);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1.5;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentIndex, isOpen]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  if (!isOpen) return null;

  const currentStory = stories[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col animate-fade-in">
      {/* Progress Bar */}
      <div className="absolute top-4 left-4 right-4 flex space-x-1.5 z-30">
        {stories.map((story, idx) => (
          <div key={story.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className={`h-full bg-white transition-all duration-75 ease-linear ${idx < currentIndex ? 'w-full' : idx === currentIndex ? '' : 'w-0'
                }`}
              style={{ width: idx === currentIndex ? `${progress}%` : undefined }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-30 pt-2">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-400 to-orange-400 p-0.5">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-xs">
              R
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-none mb-0.5">RemontUz</span>
            <span className="text-white/60 text-[10px] font-bold">только что</span>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 relative flex items-center justify-center bg-zinc-900">
        <ImageWithFallback
          src={currentStory.imageUrl}
          alt="Story"
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

        {/* Navigation Areas */}
        <div className="absolute inset-0 flex z-20">
          <div className="w-1/3 h-full" onClick={handlePrev} />
          <div className="w-2/3 h-full" onClick={handleNext} />
        </div>

        {/* Caption & CTA */}
        <div className="absolute bottom-10 left-6 right-6 z-30">
          <h3 className="text-3xl font-black mb-6 leading-tight tracking-tight">{currentStory.title[lang]}</h3>

          <button className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm uppercase tracking-widest active:scale-95 transition-transform flex items-center justify-center">
            {lang === 'ru' ? 'Подробнее' : lang === 'en' ? 'Details' : 'Batafsil'}
          </button>
        </div>
      </div>
    </div>
  );
};
