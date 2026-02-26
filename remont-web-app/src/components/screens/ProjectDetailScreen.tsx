import React, { useState } from 'react';
import { translations, Language } from '../../utils/translations';
import { Project } from '../../utils/types';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Package,
  Video,
  MessageSquare,
  Play
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { FullscreenMedia } from '../ui/FullscreenMedia';

interface ProjectDetailScreenProps {
  lang: Language;
  onNavigate: (tab: string) => void;
  projectId?: string | number;
  projects?: Project[];
}

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  lang,
  onNavigate,
  projectId,
  projects = []
}) => {
  const [activeTab, setActiveTab] = useState<'finance' | 'payments' | 'timeline'>('finance');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // Find project by ID or use first one as fallback
  const project = projects.find(p => p.id === String(projectId)) || projects[0];

  const progressPercentage = project.finance
    ? Math.round((project.finance.paid / project.finance.total) * 100)
    : 0;

  return (
    <div className="pb-32 bg-[#F9F9F7] min-h-screen">
      {/* Header with Hero Image */}
      <div className="relative h-72 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1687669930011-65755484a0a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBwcm9ncmVzcyUyMHRpbWVsaW5lfGVufDF8fHx8MTc3MTAwNTI4Mnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Project"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="absolute top-6 left-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Project Info Overlay */}
        <div className="absolute bottom-6 left-4 right-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-primary text-black text-[10px] font-bold px-3 py-1.5 rounded-full">
              {lang === 'ru' ? 'В РАБОТЕ' : lang === 'en' ? 'IN PROGRESS' : 'JARAYONDA'}
            </span>
            <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/20">
              {lang === 'ru' ? 'Договор №' : lang === 'en' ? 'Contract #' : 'Shartnoma №'}{project.contractNumber}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{typeof project.clientName === 'string' ? project.clientName : project.clientName?.[lang] || (project.clientName as any)?.ru}</h1>
          <p className="text-white/70 text-sm">{typeof project.address === 'string' ? project.address : (project.address as any)?.[lang] || (project.address as any)?.ru}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-6 pb-4">
        <div className="bg-white rounded-[24px] p-1.5 flex space-x-1 shadow-sm border border-slate-100">
          <TabButton
            active={activeTab === 'finance'}
            onClick={() => setActiveTab('finance')}
            icon={DollarSign}
            label={lang === 'ru' ? 'Финансы' : lang === 'en' ? 'Finance' : 'Moliya'}
          />
          <TabButton
            active={activeTab === 'payments'}
            onClick={() => setActiveTab('payments')}
            icon={CreditCard}
            label={lang === 'ru' ? 'Платежи' : lang === 'en' ? 'Payments' : 'To\'lovlar'}
          />
          <TabButton
            active={activeTab === 'timeline'}
            onClick={() => setActiveTab('timeline')}
            icon={Package}
            label={lang === 'ru' ? 'Работы' : lang === 'en' ? 'Works' : 'Ishlar'}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'finance' && <FinanceTab project={project} progressPercentage={progressPercentage} lang={lang} />}
        {activeTab === 'payments' && <PaymentsTab project={project} lang={lang} />}
        {activeTab === 'timeline' && <TimelineTab project={project} lang={lang} onSelectMedia={setSelectedMedia} />}
      </div>

      <FullscreenMedia
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        currentUrl={selectedMedia || ''}
      />
    </div>
  );
};

// Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-[18px] font-bold text-xs transition-all ${active
      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
      : 'text-slate-400 hover:text-slate-600'
      }`}
  >
    <Icon size={16} />
    <span>{label}</span>
  </button>
);

// Finance Tab
const FinanceTab = ({ project, progressPercentage, lang }: any) => (
  <div className="space-y-4">
    {/* Summary Cards */}
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-[#FFB800] rounded-[28px] p-6 text-black relative overflow-hidden shadow-lg shadow-[#FFB800]/20">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
        <div className="relative z-10">
          <DollarSign size={28} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{(project.finance.total / 1000000).toFixed(1)}М</div>
          <div className="text-xs text-black/60 font-medium">{lang === 'ru' ? 'Общая смета' : lang === 'en' ? 'Total estimate' : 'Umumiy smeta'}</div>
        </div>
      </div>

      <div className="bg-white rounded-[28px] p-6 text-slate-900 relative overflow-hidden border border-slate-200">
        <div className="relative z-10">
          <CheckCircle2 size={28} className="mb-3 text-slate-900" />
          <div className="text-3xl font-bold mb-1">{(project.finance.paid / 1000000).toFixed(1)}М</div>
          <div className="text-xs text-slate-400 font-medium">{lang === 'ru' ? 'Оплачено' : lang === 'en' ? 'Paid' : 'To\'langan'}</div>
        </div>
      </div>
    </div>

    {/* Remaining Amount */}
    <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">{lang === 'ru' ? 'Остаток к оплате' : lang === 'en' ? 'Remaining amount' : 'To\'lanishi kerak'}</h3>
        <AlertCircle size={20} className="text-slate-900" />
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-1">
        {(project.finance.remaining / 1000000).toFixed(2)} {lang === 'ru' ? 'млн' : lang === 'en' ? 'm' : 'mln'}
      </div>
      <p className="text-sm text-slate-500">
        {project.finance.remaining.toLocaleString('ru-RU')} {lang === 'ru' ? 'сум' : lang === 'en' ? 'sum' : 'so\'m'}
      </p>
    </div>

    {/* Progress Card */}
    <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">{lang === 'ru' ? 'Прогресс оплаты' : lang === 'en' ? 'Payment progress' : 'To\'lov jarayoni'}</h3>
        <span className="text-2xl font-bold text-slate-900">{progressPercentage}%</span>
      </div>
      <div className="bg-slate-100 rounded-full h-3 overflow-hidden mb-4">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex items-center text-sm text-slate-500">
        <TrendingUp size={16} className="mr-2" />
        <span>{lang === 'ru' ? 'Оплата по графику' : lang === 'en' ? 'Paid on schedule' : 'Grafik bo\'yicha to\'lov'}</span>
      </div>
    </div>

    {/* Stage Info */}
    <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Clock size={24} className="text-slate-900" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 mb-1">{lang === 'ru' ? 'Текущий этап' : lang === 'en' ? 'Current stage' : 'Joriy bosqich'}</h3>
          <p className="text-slate-600 text-sm mb-2">{typeof project.currentStage === 'string' ? project.currentStage : (project.currentStage as any)?.[lang] || (project.currentStage as any)?.ru}</p>
          <p className="text-xs text-slate-400">
            {lang === 'ru' ? 'Прогноз завершения:' : lang === 'en' ? 'Estimated completion:' : 'Tugatish prognozi:'} {project.forecast}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Payments Tab
const PaymentsTab = ({ project, lang }: any) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-bold text-slate-900 text-lg">{lang === 'ru' ? 'История платежей' : lang === 'en' ? 'Payment history' : 'To\'lovlar tarixi'}</h3>
      <span className="text-xs text-slate-400 font-medium">{project.payments.length} {lang === 'ru' ? 'операций' : lang === 'en' ? 'transactions' : 'operatsiyalar'}</span>
    </div>

    {project.payments.length === 0 ? (
      <div className="bg-white rounded-[24px] p-8 border border-slate-100 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center">
          <CreditCard size={28} className="text-slate-400" />
        </div>
        <p className="text-slate-500 text-sm">{lang === 'ru' ? 'Платежей пока нет' : lang === 'en' ? 'No payments yet' : 'Hali to\'lovlar yo\'q'}</p>
      </div>
    ) : (
      project.payments.map((payment: any, index: number) => (
        <div key={index} className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-11 h-11 bg-[#FFB800] rounded-2xl flex items-center justify-center text-black flex-shrink-0">
                <CreditCard size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  {typeof (payment.description || payment.comment) === 'string'
                    ? (payment.description || payment.comment)
                    : (payment.description || payment.comment)?.[lang] || (payment.description || payment.comment)?.ru}
                </h4>
                <p className="text-xs text-slate-400 flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {payment.date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900">
                +{(payment.amount / 1000000).toFixed(2)}М
              </div>
              <div className="text-xs text-slate-400">
                {payment.amount.toLocaleString('ru-RU')} {lang === 'ru' ? 'сум' : lang === 'en' ? 'sum' : 'so\'m'}
              </div>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

// Timeline Tab - Chat Style
const TimelineTab = ({ project, lang, onSelectMedia }: any) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-bold text-slate-900 text-lg">{lang === 'ru' ? 'Хронология работ' : lang === 'en' ? 'Work timeline' : 'Ish xronologiyasi'}</h3>
      <span className="text-xs text-slate-400 font-medium">{project.timeline.length} {lang === 'ru' ? 'обновлений' : lang === 'en' ? 'updates' : 'yangilanishlar'}</span>
    </div>

    <div className="space-y-3">
      {project.timeline.map((event: any, index: number) => (
        <div key={index} className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-sm">
          {/* Header - Date */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#FFB800] rounded-full flex items-center justify-center">
                <span className="text-black text-xs font-bold">A</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{lang === 'ru' ? 'Менеджер' : lang === 'en' ? 'Manager' : 'Menejer'}</p>
                <p className="text-[10px] text-slate-400">{event.date}</p>
              </div>
            </div>
            {event.status === 'completed' && (
              <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                {lang === 'ru' ? 'Завершено' : lang === 'en' ? 'Completed' : 'Tugallandi'}
              </span>
            )}
            {event.status === 'in_progress' && (
              <span className="text-[10px] font-bold text-black bg-[#FFB800] px-2 py-1 rounded-full">
                {lang === 'ru' ? 'В работе' : lang === 'en' ? 'In progress' : 'Jarayonda'}
              </span>
            )}
            {event.status === 'planned' && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                {lang === 'ru' ? 'Запланировано' : lang === 'en' ? 'Planned' : 'Rejalashtirilgan'}
              </span>
            )}
          </div>

          {/* Message Content */}
          {event.title && (
            <h4 className="font-bold text-slate-900 mb-1">
              {typeof event.title === 'string' ? event.title : event.title?.[lang] || (event.title as any)?.ru}
            </h4>
          )}
          {(event.message || event.description) && (
            <p className="text-sm text-slate-700 mb-3 leading-relaxed">
              {typeof (event.message || event.description) === 'string'
                ? (event.message || event.description)
                : (event.message || event.description)?.[lang] || (event.message || event.description)?.ru}
            </p>
          )}

          {/* Media Content (Multiple or Single) */}
          {((event.mediaUrls && event.mediaUrls.length > 0) || (event.mediaUrl || event.fileUrl)) && (
            <div className={`grid gap-2 mb-2 ${(event.mediaUrls?.length || 1) > 1 ? 'grid-cols-2' : 'grid-cols-1'
              }`}>
              {(event.mediaUrls || [event.mediaUrl || event.fileUrl]).filter(Boolean).map((url: any, i: number) => {
                const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/) || event.type === 'video';
                return (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden border border-slate-100 relative cursor-pointer aspect-square"
                    onClick={() => onSelectMedia(url)}
                  >
                    {isVideo ? (
                      <div className="w-full h-full relative group-hover:bg-black transition-colors">
                        <video src={url} className="w-full h-full object-cover opacity-80" muted playsInline />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                            <Play size={24} className="text-white fill-white ml-1" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ImageWithFallback
                        src={url}
                        alt="Work progress"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Text Only */}
          {event.type === 'text' && !event.mediaUrl && !event.videoUrl && (
            <div className="flex items-start space-x-2 text-slate-500">
              <MessageSquare size={14} className="mt-0.5 flex-shrink-0" />
              <p className="text-xs">{lang === 'ru' ? 'Текстовое обновление' : lang === 'en' ? 'Text update' : 'Matnli xabar'}</p>
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Info Note */}
    <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
      <p className="text-xs text-slate-500">
        {lang === 'ru' ? 'Здесь менеджер публикует обновления о ходе работ на вашем объекте' : lang === 'en' ? 'Here the manager publishes updates on the progress of your project' : 'Bu yerda menejer obyektingizdagi ish jarayoni haqida ma\'lumot qoldiradi'}
      </p>
    </div>
  </div>
);
