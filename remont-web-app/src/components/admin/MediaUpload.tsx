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
        <div className="space-y-4">
            {label && (
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block leading-none">
                    {label}
                </label>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {values.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-[28px] overflow-hidden border-2 border-slate-50 group bg-slate-50 transition-all hover:scale-[1.02] hover:shadow-xl shadow-sm">
                        {isVideo(url) ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900 group-hover:bg-black transition-colors">
                                <Video className="text-white opacity-20" size={40} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
                                        <Play className="text-white fill-white ml-1" size={24} />
                                    </div>
                                </div>
                                <video className="hidden" src={url} />
                            </div>
                        ) : (
                            <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <button
                                type="button"
                                onClick={() => removeMedia(idx)}
                                className="bg-white/90 backdrop-blur-md text-red-500 w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-2xl active:scale-90"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                ))}

                {(multiple || values.length === 0) && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`aspect-square rounded-[28px] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group ${isUploading ? 'pointer-events-none' : ''}`}
                    >
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Загрузка...</span>
                            </div>
                        ) : (
                            <>
                                <div className="w-14 h-14 rounded-[22px] bg-white text-slate-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:text-primary transition-all shadow-sm border border-slate-100 group-hover:border-primary/20">
                                    <Upload size={24} />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary">Добавить</p>
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
