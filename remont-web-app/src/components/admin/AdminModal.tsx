import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[100] flex justify-center items-start overflow-y-auto p-4 md:p-8 animate-fade-in"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-[40px] w-full ${maxWidth} shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-scale-up relative my-auto`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-8 pb-4 sticky top-0 bg-white/80 backdrop-blur-md z-20 rounded-t-[40px]">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 pt-2">
                    {children}
                </div>
            </div>
        </div>
    );
};
