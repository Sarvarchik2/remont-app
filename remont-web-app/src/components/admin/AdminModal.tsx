import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
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
            // Also prevent main content scroll in AdminLayout
            const mainContent = document.querySelector('.flex-1.overflow-y-auto');
            if (mainContent instanceof HTMLElement) mainContent.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            const mainContent = document.querySelector('.flex-1.overflow-y-auto');
            if (mainContent instanceof HTMLElement) mainContent.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'unset';
            const mainContent = document.querySelector('.flex-1.overflow-y-auto');
            if (mainContent instanceof HTMLElement) mainContent.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
        <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[99999] flex justify-center items-center p-4 md:p-10 animate-fade-in"
            onClick={onClose}
            style={{ zIndex: 99999 }}
        >
            <div
                className={`bg-white rounded-[32px] w-full ${maxWidth} max-h-[90vh] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)] animate-scale-up relative flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 sticky top-0 bg-white/95 backdrop-blur-md z-[100] rounded-t-[32px] border-b border-slate-50 shrink-0">
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
                <div className="p-8 pt-6 overflow-y-auto custom-scrollbar flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
