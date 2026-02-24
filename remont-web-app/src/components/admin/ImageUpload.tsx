import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
    onUpload: (url: string) => void;
    value?: string;
    label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, value, label = "Загрузить фото" }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/v1/media/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                onUpload(data.url);
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-2">{label}</label>}

            {value ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 group">
                    <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => onUpload('')}
                            className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-slate-100 transition-all group"
                >
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                <Upload size={24} />
                            </div>
                            <p className="text-sm font-bold text-slate-500">Нажмите для загрузки</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">PNG, JPG до 5MB</p>
                        </>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>
            )}
        </div>
    );
};
