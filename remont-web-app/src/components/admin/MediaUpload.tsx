import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2, Video, FileText, Play } from 'lucide-react';
import { toast } from 'sonner';

interface MediaUploadProps {
    onUpload: (urls: string[]) => void;
    values?: string[];
    label?: string;
    multiple?: boolean;
    accept?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
    onUpload,
    values = [],
    label = "Загрузить файлы",
    multiple = true,
    accept = "image/*,video/*"
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Check file size (100MB for multiple, mostly for videos)
        const totalSize = files.reduce((acc, f) => acc + f.size, 0);
        if (totalSize > 100 * 1024 * 1024) {
            toast.error('Вес файлов слишком велик. Максимум 100MB');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const url = multiple ? '/api/v1/media/upload-multiple' : '/api/v1/media/upload';
            // If single, we need to adjust the field name to 'file' for the single endpoint
            if (!multiple) {
                const singleFormData = new FormData();
                singleFormData.append('file', files[0]);
                const response = await fetch('/api/v1/media/upload', {
                    method: 'POST',
                    body: singleFormData,
                });
                if (response.ok) {
                    const data = await response.json();
                    onUpload([data.url]);
                    toast.success('Файл загружен успешно!');
                } else throw new Error();
            } else {
                const response = await fetch('/api/v1/media/upload-multiple', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    const data = await response.json();
                    onUpload([...values, ...data.urls]);
                    toast.success('Файлы загружены успешно!');
                } else throw new Error();
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            toast.error('Ошибка при загрузке файлов');
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const removeMedia = (index: number) => {
        const newValues = values.filter((_, i) => i !== index);
        onUpload(newValues);
    };

    const isVideo = (url: string) => {
        return url.match(/\.(mp4|webm|ogg|mov)$|^blob:|^data:video/i);
    };

    return (
        <div className="space-y-3">
            {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-2">{label}</label>}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {values.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50">
                        {isVideo(url) ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                <Video className="text-white opacity-40" size={32} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Play className="text-white fill-white" size={24} />
                                </div>
                                <video className="hidden" src={url} />
                            </div>
                        ) : (
                            <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => removeMedia(idx)}
                                className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                ))}

                {(multiple || values.length === 0) && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-slate-100 transition-all group ${isUploading ? 'pointer-events-none' : ''}`}
                    >
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-black animate-spin" />
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                    <Upload size={20} />
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Добавить</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple={multiple}
                accept={accept}
            />
        </div>
    );
};
