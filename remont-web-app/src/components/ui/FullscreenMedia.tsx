import React from 'react';
import { X, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface FullscreenMediaProps {
    isOpen: boolean;
    onClose: () => void;
    currentUrl: string;
    allUrls?: string[];
    onNext?: () => void;
    onPrev?: () => void;
}

export const FullscreenMedia: React.FC<FullscreenMediaProps> = ({
    isOpen,
    onClose,
    currentUrl,
    allUrls = [],
    onNext,
    onPrev
}) => {
    if (!isOpen) return null;

    const isVideo = (url: string) => url.match(/\.(mp4|webm|ogg|mov)$|^blob:|^data:video/i);

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in backdrop-blur-xl">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all z-[110]"
            >
                <X size={24} />
            </button>

            {allUrls.length > 1 && onPrev && (
                <button
                    onClick={onPrev}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all z-[110]"
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            {allUrls.length > 1 && onNext && (
                <button
                    onClick={onNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all z-[110]"
                >
                    <ChevronRight size={24} />
                </button>
            )}

            <div className="w-full h-full p-4 md:p-12 flex items-center justify-center" onClick={onClose}>
                <div className="max-w-5xl max-h-full w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                    {isVideo(currentUrl) ? (
                        <video
                            src={currentUrl}
                            controls
                            autoPlay
                            className="max-h-full max-w-full rounded-2xl shadow-2xl"
                        />
                    ) : (
                        <img
                            src={currentUrl}
                            alt="Full size"
                            className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                        />
                    )}
                </div>
            </div>

            {allUrls.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-bold tracking-widest uppercase">
                    {allUrls.indexOf(currentUrl) + 1} / {allUrls.length}
                </div>
            )}
        </div>
    );
};
