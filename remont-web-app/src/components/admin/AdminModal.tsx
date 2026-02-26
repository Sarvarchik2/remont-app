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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-start overflow-y-auto p-4 md:p-8 animate-fade-in"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-[32px] w-full ${maxWidth} shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] animate-scale-up relative my-auto`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-20 rounded-t-[32px] border-b border-slate-50">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center justify-center transition-all active:scale-90"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};
