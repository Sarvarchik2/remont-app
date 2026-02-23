import { Language } from './translations';

export interface Story {
    id: string;
    category: 'process' | 'reviews' | 'team' | 'promo';
    imageUrl: string;
    title: Record<Language, string>;
    videoUrl?: string; // Optional
}

export interface Payment {
    id: string;
    date: string;
    amount: number;
    comment: string;
    description?: Record<Language, string> | string; // Alias for comment for compatibility
}

export interface TimelineEvent {
    id: string;
    date: string;
    title: Record<Language, string> | string;
    description: Record<Language, string> | string;
    type: 'photo' | 'doc' | 'info' | 'video' | 'text'; // Added 'video' and 'text'
    fileUrl?: string;
    comment?: string; // Additional field
    status?: 'completed' | 'in_progress' | 'planned'; // Status for timeline
    mediaUrl?: string; // For photos and videos
    videoUrl?: string; // For video content
    message?: string; // Text message from admin
}

// Lead/Quote interface
export interface Lead {
    id: string;
    name?: Record<Language, string> | string;
    phone?: string;
    source: 'calculator' | 'booking' | 'phone' | 'other';
    status: 'new' | 'contacted' | 'measuring' | 'contract' | 'declined';
    date: string;
    time: string;
    // Calculator data
    calculatorData?: {
        area: number;
        type: 'new' | 'secondary';
        level: 'economy' | 'standard' | 'premium';
        estimatedCost: number;
    };
    // Booking data
    bookingData?: {
        date: string;
        time: string;
        address: string;
        comment?: string;
    };
    notes?: string;
}

export interface Project {
    id: string; // Changed to string for consistency
    clientName: Record<Language, string> | string;
    address: Record<Language, string> | string;
    phone: string;
    totalEstimate: number;
    startDate: string;
    deadline: string;
    status: 'new' | 'process' | 'finished';
    currentStage: Record<Language, string> | string;
    payments: Payment[];
    timeline: TimelineEvent[];
    contractNumber: string;
    // New fields for compatibility
    stage?: Record<Language, string> | string; // Alias for currentStage
    forecast?: string;
    finance?: {
        total: number;
        paid: number;
        remaining: number;
    };
}

export interface PortfolioItem {
    id: number;
    type: 'living' | 'kitchen' | 'bath' | 'bedroom';
    title: Record<Language, string> | string;
    imgBefore: string;
    imgAfter: string;
    area: string;
    term: string;
    cost?: string;
    location?: string;
    tags?: string[];
    description?: Record<Language, string> | string;
    worksCompleted?: {
        category: string;
        items: string[];
    }[];
    budget?: string;
    duration?: string;
    team?: {
        name: Record<Language, string> | string;
        role: string;
        avatar: string;
    }[];
    materials?: string[];
    gallery?: string[];
    videoUrl?: string;
    isNewBuilding?: boolean;
}

export interface CatalogItem {
    id: string;
    category: 'materials' | 'furniture' | 'lighting' | 'plumbing' | 'decor';
    title: Record<Language, string>;
    description: Record<Language, string>;
    price: number;
    image: string;
    images: string[];
    specs?: { label: Record<Language, string>; value: Record<Language, string> }[];
}

export interface ServiceItem {
    id: string;
    name: Record<Language, string> | string;
    price: string;
    unit: Record<Language, string> | string;
}

export interface ServiceCategory {
    id: string;
    title: Record<Language, string> | string;
    icon: string; // Storing icon name as string for mock data simplicity
    services: ServiceItem[];
}
