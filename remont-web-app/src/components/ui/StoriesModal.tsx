import React, { useEffect, useState } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { Language } from '../../utils/translations';
import { Story } from '../../utils/types';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface StoriesModalProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const getRelativeTime = (date?: string, lang: Language = 'ru') => {
  if (!date) return lang === 'ru' ? 'сейчас' : lang === 'en' ? 'now' : 'hozir';

  const now = new Date();
  const created = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));

  // Handle potential negative diff or nearly current as "now"
  if (diffInMinutes < 1) return lang === 'ru' ? 'сейчас' : lang === 'en' ? 'now' : 'hozir';
  if (diffInMinutes < 60) return `${diffInMinutes}${lang === 'ru' ? 'м' : lang === 'en' ? 'm' : 'daq'}`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ${lang === 'ru' ? 'ч' : lang === 'en' ? 'h' : 's'}`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${lang === 'ru' ? 'д' : lang === 'en' ? 'd' : 'k'}`;
};

export const StoriesModal: React.FC<StoriesModalProps> = ({ stories, initialIndex, isOpen, onClose, lang }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(5000); // Default 5s
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setProgress(0);
      setIsPaused(false);
    }
  }, [isOpen, initialIndex]);

  // Image story timer
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const currentStory = stories[currentIndex];
    const isDirectVideo = !!currentStory.videoUrl && !currentStory.videoUrl.includes('youtube') && !currentStory.videoUrl.includes('vimeo');

    if (isDirectVideo) return; // Video handles its own progress through onTimeUpdate

    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isOpen, isPaused, duration]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
      setDuration(5000);
      setIsPaused(false);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
      setDuration(5000);
      setIsPaused(false);
    }
  };

  const onVideoTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const onVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration * 1000);
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
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary via-amber-400 to-yellow-200 p-[2px]">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-sm text-primary">
              R
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-none mb-0.5">Vicasa</span>
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">
              {getRelativeTime(currentStory.createdAt, lang)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {currentStory.videoUrl && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative flex items-center justify-center bg-zinc-900">
        {currentStory.videoUrl ? (
          <div className="w-full h-full relative">
            {currentStory.videoUrl.includes('vimeo') || currentStory.videoUrl.includes('youtube') || currentStory.videoUrl.includes('youtu.be') ? (
              <iframe
                src={currentStory.videoUrl.includes('vimeo')
                  ? `https://player.vimeo.com/video/${currentStory.videoUrl.split('/').pop()}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=${isMuted ? 1 : 0}&background=1`
                  : `https://www.youtube.com/embed/${currentStory.videoUrl.includes('v=') ? currentStory.videoUrl.split('v=')[1].split('&')[0] : currentStory.videoUrl.split('/').pop()}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${currentStory.videoUrl.includes('v=') ? currentStory.videoUrl.split('v=')[1].split('&')[0] : currentStory.videoUrl.split('/').pop()}`
                }
                className="absolute inset-0 w-full h-full pointer-events-none"
                allow="autoplay; fullscreen"
                title="Story Video"
              ></iframe>
            ) : (
              <video
                ref={videoRef}
                src={currentStory.videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted={isMuted}
                playsInline
                onWaiting={() => setIsPaused(true)}
                onPlaying={() => setIsPaused(false)}
                onTimeUpdate={onVideoTimeUpdate}
                onLoadedMetadata={onVideoLoadedMetadata}
                onEnded={handleNext}
              />
            )}
          </div>
        ) : (
          <ImageWithFallback
            src={currentStory.imageUrl}
            alt="Story"
            className="w-full h-full object-cover"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />

        {/* Navigation Areas */}
        <div className="absolute inset-0 flex z-20">
          <div className="w-1/3 h-full" onClick={handlePrev} />
          <div className="w-2/3 h-full" onClick={handleNext} />
        </div>

        {/* Caption & CTA */}
        <div className="absolute bottom-10 left-6 right-6 z-30">
          <h3 className="text-3xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">{currentStory.title[lang]}</h3>

          {currentStory.linkUrl && (
            <a
              href={currentStory.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm uppercase tracking-widest active:scale-95 transition-transform flex items-center justify-center shadow-xl shadow-black/40"
            >
              {lang === 'ru' ? 'Подробнее' : lang === 'en' ? 'Details' : 'Batafsil'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
