import React, { useState } from 'react';
import { Language, translations } from '../../../utils/translations';
import { AppUser } from '../../../utils/types';
import { Search, User, ExternalLink, ShieldCheck } from 'lucide-react';

interface AdminUsersProps {
    lang: Language;
    users: AppUser[];
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ lang, users }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(u =>
        (u.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.telegram_id.includes(searchQuery)
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                        Community
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900">Пользователи бота</h1>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-8">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={20} />
                </div>
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по имени, username или Telegram ID..."
                    className="w-full pl-14 pr-4 py-4 rounded-[24px] border border-slate-200 bg-white font-bold text-slate-900 outline-none focus:border-primary transition-colors placeholder:text-slate-400 shadow-sm"
                />
            </div>

            <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Пользователь</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telegram ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Статус</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase border border-slate-100">
                                                {u.first_name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{u.first_name} {u.last_name || ''}</div>
                                                {u.username && (
                                                    <div className="text-xs text-[#24A1DE] font-bold">@{u.username}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="bg-slate-50 border border-slate-100 px-2 py-1 rounded text-xs font-mono text-slate-600">
                                            {u.telegram_id}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${u.is_active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {u.is_active && <ShieldCheck size={12} />}
                                            <span>{u.is_active ? 'Активен' : 'Неактивен'}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                            <ExternalLink size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        Пользователей не найдено
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
