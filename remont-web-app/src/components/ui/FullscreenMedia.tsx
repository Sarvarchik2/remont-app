import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    // Handle scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const isVideo = (url: string) => url.match(/\.(mp4|webm|ogg|mov)$|^blob:|^data:video/i);

    const content = (
        <div className="fixed inset-0 z-[100000] bg-black/95 flex items-center justify-center animate-fade-in backdrop-blur-3xl">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all z-[110] active:scale-95"
            >
                <X size={24} />
            </button>

            {allUrls.length > 1 && onPrev && (
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all z-[110] active:scale-95"
                >
                    <ChevronLeft size={28} />
                </button>
            )}

            {allUrls.length > 1 && onNext && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all z-[110] active:scale-95"
                >
                    <ChevronRight size={28} />
                </button>
            )}

            <div className="w-full h-full p-4 md:p-12 flex items-center justify-center" onClick={onClose}>
                <div className="max-w-6xl max-h-full w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
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
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold tracking-[0.2em] uppercase bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                    {allUrls.indexOf(currentUrl) + 1} / {allUrls.length}
                </div>
            )}
        </div>
    );

    return createPortal(content, document.body);
};
