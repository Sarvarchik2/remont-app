import React from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div
                className={`bg-white rounded-[32px] w-full ${maxWidth} p-8 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto relative`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-10 pb-2">
                    <h3 className="text-2xl font-bold text-slate-900">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};
