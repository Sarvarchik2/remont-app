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
  description?: string; // Alias for comment for compatibility
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
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
  name?: string;
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
  clientName: string;
  address: string;
  phone: string;
  totalEstimate: number;
  startDate: string;
  deadline: string;
  status: 'new' | 'process' | 'finished';
  currentStage: string;
  payments: Payment[];
  timeline: TimelineEvent[];
  contractNumber: string;
  // New fields for compatibility
  stage?: string; // Alias for currentStage
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
  title: string;
  imgBefore: string;
  imgAfter: string;
  area: string;
  term: string;
  cost?: string;
  location?: string;
  tags?: string[];
  description?: string;
  worksCompleted?: {
    category: string;
    items: string[];
  }[];
  budget?: string;
  duration?: string;
  team?: {
    name: string;
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
  name: string;
  price: string;
  unit: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon: string; // Storing icon name as string for mock data simplicity
  services: ServiceItem[];
}

// --- MOCK DATA ---

export const MOCK_SERVICES: ServiceCategory[] = [
  {
    id: 'demolition',
    title: 'Демонтаж',
    icon: 'Hammer',
    services: [
      { id: 'd1', name: 'Снятие старых обоев', price: '15 000', unit: 'сум/м²' },
      { id: 'd2', name: 'Демонтаж плитки со стен', price: '45 000', unit: 'сум/м²' },
      { id: 'd3', name: 'Демонтаж плитки с пола', price: '40 000', unit: 'сум/м²' },
      { id: 'd4', name: 'Снос кирпичных стен', price: '120 000', unit: 'сум/м²' },
      { id: 'd5', name: 'Демонтаж дверей', price: '35 000', unit: 'сум/шт' },
      { id: 'd6', name: 'Демонтаж сантехники', price: '50 000', unit: 'сум/шт' }
    ]
  },
  {
    id: 'electrical',
    title: 'Электрика',
    icon: 'Zap',
    services: [
      { id: 'e1', name: 'Штробление стен под кабель', price: '25 000', unit: 'сум/п.м' },
      { id: 'e2', name: 'Укладка кабеля в штробу', price: '5 000', unit: 'сум/п.м' },
      { id: 'e3', name: 'Установка розетки', price: '35 000', unit: 'сум/шт' },
      { id: 'e4', name: 'Установка выключателя', price: '30 000', unit: 'сум/шт' },
      { id: 'e5', name: 'Монтаж распределительного щита', price: '150 000', unit: 'сум/шт' },
      { id: 'e6', name: 'Установка люстры', price: '50 000', unit: 'сум/шт' }
    ]
  },
  {
    id: 'finishing',
    title: 'Отделка стен',
    icon: 'Paintbrush',
    services: [
      { id: 'f1', name: 'Грунтовка стен', price: '5 000', unit: 'сум/м²' },
      { id: 'f2', name: 'Штукатурка стен (маяки)', price: '65 000', unit: 'сум/м²' },
      { id: 'f3', name: 'Шпаклевка стен (2 слоя)', price: '45 000', unit: 'сум/м²' },
      { id: 'f4', name: 'Шлифовка стен', price: '15 000', unit: 'сум/м²' },
      { id: 'f5', name: 'Покраска стен (2 слоя)', price: '35 000', unit: 'сум/м²' },
      { id: 'f6', name: 'Поклейка обоев', price: '40 000', unit: 'сум/м²' }
    ]
  },
  {
    id: 'tiles',
    title: 'Плиточные работы',
    icon: 'Grid3x3',
    services: [
      { id: 't1', name: 'Укладка кафеля на стену', price: '180 000', unit: 'сум/м²' },
      { id: 't2', name: 'Укладка плитки на пол', price: '150 000', unit: 'сум/м²' },
      { id: 't3', name: 'Затирка швов', price: '15 000', unit: 'сум/м²' },
      { id: 't4', name: 'Запил под 45 градусов', price: '80 000', unit: 'сум/п.м' },
      { id: 't5', name: 'Укладка мозаики', price: '250 000', unit: 'сум/м²' },
      { id: 't6', name: 'Гидроизоляция пола', price: '35 000', unit: 'сум/м²' }
    ]
  },
  {
    id: 'plumbing',
    title: 'Сантехнические работы',
    icon: 'Droplet',
    services: [
      { id: 'p1', name: 'Установка унитаза', price: '150 000', unit: 'сум/шт' },
      { id: 'p2', name: 'Монтаж смесителя', price: '80 000', unit: 'сум/шт' },
      { id: 'p3', name: 'Установка ванны', price: '250 000', unit: 'сум/шт' },
      { id: 'p4', name: 'Установка душевой кабины', price: '200 000', unit: 'сум/шт' },
      { id: 'p5', name: 'Монтаж раковины', price: '100 000', unit: 'сум/шт' },
      { id: 'p6', name: 'Разводка труб водоснабжения', price: '35 000', unit: 'сум/п.м' }
    ]
  },
  {
    id: 'flooring',
    title: 'Напольные покрытия',
    icon: 'HomeIcon',
    services: [
      { id: 'fl1', name: 'Стяжка пола', price: '65 000', unit: 'сум/м²' },
      { id: 'fl2', name: 'Наливной пол', price: '85 000', unit: 'сум/м²' },
      { id: 'fl3', name: 'Укладка ламината', price: '45 000', unit: 'сум/м²' },
      { id: 'fl4', name: 'Укладка паркета', price: '120 000', unit: 'сум/м²' },
      { id: 'fl5', name: 'Монтаж плинтуса', price: '15 000', unit: 'сум/п.м' },
      { id: 'fl6', name: 'Укладка линолеума', price: '35 000', unit: 'сум/м²' }
    ]
  },
  {
    id: 'additional',
    title: 'Дополнительные работы',
    icon: 'Wrench',
    services: [
      { id: 'a1', name: 'Монтаж гипсокартона', price: '85 000', unit: 'сум/м²' },
      { id: 'a2', name: 'Установка дверей', price: '150 000', unit: 'сум/шт' },
      { id: 'a3', name: 'Монтаж окон', price: '200 000', unit: 'сум/шт' },
      { id: 'a4', name: 'Натяжной потолок', price: '120 000', unit: 'сум/м²' },
      { id: 'a5', name: 'Шумоизоляция стен', price: '75 000', unit: 'сум/м²' },
      { id: 'a6', name: 'Утепление балкона', price: '450 000', unit: 'сум/м²' }
    ]
  }
];

export const MOCK_CATALOG: CatalogItem[] = [
  {
    id: 'c1',
    category: 'materials',
    title: { ru: 'Ламинат дуб натуральный', uz: 'Tabiiy eman laminati' },
    description: { 
      ru: 'Высококачественный ламинат 33 класса. Влагостойкий, подходит для теплых полов. Текстура натурального дерева.', 
      uz: 'Yuqori sifatli 33-sinf laminati. Namlikka chidamli, issiq pollar uchun mos. Tabiiy yog\'och teksturasi.' 
    },
    price: 120000,
    image: 'https://images.unsplash.com/photo-1761053133165-0f3acdaf1770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW1pbmF0ZSUyMGZsb29yaW5nJTIwd29vZCUyMHRleHR1cmV8ZW58MXx8fHwxNzcxMTUxOTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1761053133165-0f3acdaf1770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW1pbmF0ZSUyMGZsb29yaW5nJTIwd29vZCUyMHRleHR1cmV8ZW58MXx8fHwxNzcxMTUxOTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    specs: [
      { label: { ru: 'Класс', uz: 'Sinf' }, value: { ru: '33', uz: '33' } },
      { label: { ru: 'Толщина', uz: 'Qalinligi' }, value: { ru: '12 мм', uz: '12 mm' } },
      { label: { ru: 'Производитель', uz: 'Ishlab chiqaruvchi' }, value: { ru: 'Kastamonu', uz: 'Kastamonu' } }
    ]
  },
  {
    id: 'c2',
    category: 'plumbing',
    title: { ru: 'Смеситель для кухни Chrome', uz: 'Oshxona uchun smesitel Chrome' },
    description: { 
      ru: 'Современный однорычажный смеситель с высоким изливом. Хромированное покрытие, керамический картридж.', 
      uz: 'Zamonaviy bir tutqichli yuqori jo\'mrakli smesitel. Xrom qoplama, keramik kartridj.' 
    },
    price: 850000,
    image: 'https://images.unsplash.com/photo-1769763828411-eb09bb05d97f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwZmF1Y2V0JTIwY2hyb21lJTIwbW9kZXJufGVufDF8fHx8MTc3MTE1MTk0NXww&ixlib=rb-4.1.0&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1769763828411-eb09bb05d97f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwZmF1Y2V0JTIwY2hyb21lJTIwbW9kZXJufGVufDF8fHx8MTc3MTE1MTk0NXww&ixlib=rb-4.1.0&q=80&w=1080'],
    specs: [
      { label: { ru: 'Материал', uz: 'Material' }, value: { ru: 'Латунь', uz: 'Latun' } },
      { label: { ru: 'Тип', uz: 'Tur' }, value: { ru: 'Однорычажный', uz: 'Bir tutqichli' } }
    ]
  },
  {
    id: 'c3',
    category: 'materials',
    title: { ru: 'Плитка керамогранит Marble', uz: 'Marmar keramogranit plitkasi' },
    description: { 
      ru: 'Крупноформатный керамогранит под белый мрамор. Полированная поверхность, ректифицированные края.', 
      uz: 'Oq marmar ostidagi katta formatli keramogranit. Sayqallangan sirt, rektifikatsiyalangan qirralar.' 
    },
    price: 180000,
    image: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjZXJhbWljJTIwdGlsZXMlMjBiYXRocm9vbXxlbnwxfHx8fDE3NzExNTE5NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1695191388218-f6259600223f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjZXJhbWljJTIwdGlsZXMlMjBiYXRocm9vbXxlbnwxfHx8fDE3NzExNTE5NDV8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    specs: [
      { label: { ru: 'Размер', uz: 'O\'lcham' }, value: { ru: '60x120 см', uz: '60x120 sm' } },
      { label: { ru: 'Поверхность', uz: 'Sirt' }, value: { ru: 'Полированная', uz: 'Sayqallangan' } }
    ]
  },
  {
    id: 'c4',
    category: 'furniture',
    title: { ru: 'Диван Modern Beige', uz: 'Modern Beige divani' },
    description: { 
      ru: 'Стильный двухместный диван в бежевой обивке. Мягкие подушки, прочный деревянный каркас.', 
      uz: 'Bej qoplamali zamonaviy ikki kishilik divan. Yumshoq yostiqlar, mustahkam yog\'och karkas.' 
    },
    price: 4500000,
    image: 'https://images.unsplash.com/photo-1767584394169-cb62eccfe930?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWlnZSUyMHNvZmElMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3MTE1MTk0NXww&ixlib=rb-4.1.0&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1767584394169-cb62eccfe930?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWlnZSUyMHNvZmElMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3MTE1MTk0NXww&ixlib=rb-4.1.0&q=80&w=1080'],
    specs: [
      { label: { ru: 'Ширина', uz: 'Kengligi' }, value: { ru: '220 см', uz: '220 sm' } },
      { label: { ru: 'Обивка', uz: 'Qoplama' }, value: { ru: 'Велюр', uz: 'Velyur' } }
    ]
  },
  {
    id: 'c5',
    category: 'materials',
    title: { ru: 'Краска интерьерная Matt', uz: 'Interyer bo\'yog\'i Matt' },
    description: { 
      ru: 'Матовая моющаяся краска для стен и потолков. Экологичная, без запаха.', 
      uz: 'Devor va shiftlar uchun matli yuviladigan bo\'yoq. Ekologik toza, hidsiz.' 
    },
    price: 450000,
    image: 'https://images.unsplash.com/photo-1673297821205-e0575bbc2ab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW4lMjBvZiUyMHdhbGwlMjBwYWludCUyMGludGVyaW9yfGVufDF8fHx8MTc3MTE1MTk0NXww&ixlib=rb-4.1.0&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1673297821205-e0575bbc2ab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW4lMjBvZiUyMHdhbGwlMjBwYWludCUyMGludGVyaW9yfGVufDF8fHx8MTc3MTE1MTk0NXww&ixlib=rb-4.1.0&q=80&w=1080'],
    specs: [
      { label: { ru: 'Объем', uz: 'Hajmi' }, value: { ru: '9 л', uz: '9 l' } },
      { label: { ru: 'Цвет', uz: 'Rangi' }, value: { ru: 'Белый', uz: 'Oq' } }
    ]
  },
  {
    id: 'c6',
    category: 'lighting',
    title: { ru: 'Люстра Modern Ring', uz: 'Modern Ring qandili' },
    description: { 
      ru: 'Дизайнерская светодиодная люстра в форме колец. Регулируемая яркость и цветовая температура.', 
      uz: 'Uzuk shaklidagi dizaynerlik LED qandil. Sozlanishi yorqinlik va rang harorati.' 
    },
    price: 1500000,
    image: 'https://images.unsplash.com/photo-1665832966717-238c3a7e2bf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaGFuZGVsaWVyJTIwbGlnaHRpbmd8ZW58MXx8fHwxNzcxMTUxOTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1665832966717-238c3a7e2bf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaGFuZGVsaWVyJTIwbGlnaHRpbmd8ZW58MXx8fHwxNzcxMTUxOTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    specs: [
      { label: { ru: 'Мощность', uz: 'Quvvati' }, value: { ru: '60 Вт', uz: '60 Vt' } },
      { label: { ru: 'Диаметр', uz: 'Diametri' }, value: { ru: '80 см', uz: '80 sm' } }
    ]
  }
];

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    id: 1,
    type: 'living',
    title: 'ЖК Tashkent City',
    imgBefore: 'https://images.unsplash.com/photo-1704920110270-5c107519cdc4?auto=format&fit=crop&w=600&q=80',
    imgAfter: 'https://images.unsplash.com/photo-1765767056681-9583b29007cf?auto=format&fit=crop&w=800&q=80',
    area: '85',
    term: '3.5 мес',
    cost: '250 000 000 сум',
    location: 'Ташкент, Шайхантахур',
    isNewBuilding: true,
    tags: ['Новостройка', 'Минимализм'],
    description: 'Просторная квартира в современном стиле с элементами минимализма. Главной задачей было создание чистого, светлого пространства с использованием натуральных материалов и современной сантехники. Применили скрытый монтаж дверей и плинтусов.',
    worksCompleted: [
      {
        category: 'Демонтаж',
        items: [
          'Снос перегородок',
          'Вывоз строительного мусора',
          'Зачистка поверхностей'
        ]
      },
      {
        category: 'Черновые работы',
        items: [
          'Возведение стен (пеноблок)',
          'Штукатурка под маяк',
          'Стяжка пола с шумоизоляцией',
          'Разводка электрики и сантехники'
        ]
      },
      {
        category: 'Чистовые работы',
        items: [
          'Укладка инженерной доски',
          'Покраска стен (Little Greene)',
          'Монтаж теневого профиля',
          'Установка сантехники Grohe'
        ]
      }
    ],
    budget: '350 млн сум',
    duration: '3 месяца',
    team: [
      {
        name: 'Искандер Р.',
        role: 'Прораб',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Мадина А.',
        role: 'Дизайнер',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
      }
    ],
    materials: ['Knauf', 'Tikkurila', 'Grohe', 'Schneider Electric', 'Kerama Marazzi'],
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&q=80&w=1080'
    ],
    videoUrl: 'https://example.com/video.mp4'
  },
  {
    id: 2,
    type: 'kitchen',
    title: 'ЖК Mirabad Avenue',
    imgBefore: 'https://images.unsplash.com/photo-1758523671637-5a39ea2c129b?auto=format&fit=crop&w=600&q=80',
    imgAfter: 'https://images.unsplash.com/photo-1691752060291-50e019a9a16b?auto=format&fit=crop&w=800&q=80',
    area: '16',
    term: '1 мес',
    cost: '45 000 000 сум',
    location: 'Ташкент, Мирабад',
    isNewBuilding: false,
    tags: ['Модерн'],
    description: 'Полная реновация кухни с современной бытвой техникой и стильными фасадами.',
    budget: '45 млн сум',
    duration: '1 месяц',
    materials: ['Grohe', 'Bosch', 'Egger'],
    gallery: [
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1080'
    ]
  },
  {
    id: 3,
    type: 'living',
    title: 'ЖК Magic City',
    imgBefore: 'https://images.unsplash.com/photo-1704920110270-5c107519cdc4?auto=format&fit=crop&w=600&q=80',
    imgAfter: 'https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?auto=format&fit=crop&w=800&q=80',
    area: '92',
    term: '4 мес',
    cost: '380 000 000 сум',
    location: 'Ташкент, Юнусабад',
    isNewBuilding: true,
    tags: ['Новостройка', 'Премиум'],
    description: 'Просторная трехкомнатная квартира с элементами премиального дизайна.',
    budget: '380 млн сум',
    duration: '4 месяца',
    materials: ['Knauf', 'Tikkurila', 'Grohe', 'Legrand'],
    gallery: [
      'https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?auto=format&fit=crop&q=80&w=1080'
    ]
  },
  {
    id: 4,
    type: 'bath',
    title: 'ЖК Sergeli City',
    imgBefore: 'https://images.unsplash.com/photo-1758523671637-5a39ea2c129b?auto=format&fit=crop&w=600&q=80',
    imgAfter: 'https://images.unsplash.com/photo-1756079664354-34944e001f6d?auto=format&fit=crop&w=800&q=80',
    area: '8',
    term: '3 недели',
    cost: '28 000 000 сум',
    location: 'Ташкент, Сергели',
    isNewBuilding: true,
    tags: ['Новостройка', 'Минимализм'],
    description: 'Современный санузел в минималистичном стиле с премиальной сантехникой.',
    budget: '28 млн сум',
    duration: '3 недели',
    materials: ['Grohe', 'Kerama Marazzi', 'Hansgrohe'],
    gallery: [
      'https://images.unsplash.com/photo-1756079664354-34944e001f6d?auto=format&fit=crop&q=80&w=1080'
    ]
  },
  {
    id: 5,
    type: 'bedroom',
    title: 'ЖК Compass',
    imgBefore: 'https://images.unsplash.com/photo-1704920110270-5c107519cdc4?auto=format&fit=crop&w=600&q=80',
    imgAfter: 'https://images.unsplash.com/photo-1704428382583-c9c7c1e55d94?auto=format&fit=crop&w=800&q=80',
    area: '18',
    term: '2 мес',
    cost: '65 000 000 сум',
    location: 'Ташкент, Чиланзар',
    isNewBuilding: false,
    tags: ['Модерн', 'Уютный'],
    description: 'Спальня в современном стиле с элементами уюта и комфорта.',
    budget: '65 млн сум',
    duration: '2 месяца',
    materials: ['Tikkurila', 'Egger', 'Schneider Electric'],
    gallery: [
      'https://images.unsplash.com/photo-1704428382583-c9c7c1e55d94?auto=format&fit=crop&q=80&w=1080'
    ]
  }
];

export const STORIES_DATA: Story[] = [
  {
    id: '1',
    category: 'process',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?auto=format&fit=crop&q=80&w=800',
    title: { ru: 'Монтаж электрики', uz: 'Elektr montaji' }
  },
  {
    id: '2',
    category: 'process',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800',
    title: { ru: 'Укладка плитки', uz: 'Plitka yotqizish' }
  },
  {
    id: '3',
    category: 'reviews',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=800',
    title: { ru: 'Отзыв клиента', uz: 'Sharh' }
  },
  {
    id: '4',
    category: 'team',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
    title: { ru: 'Наша команда', uz: 'Bizning jamoa' }
  },
  {
    id: '5',
    category: 'promo',
    imageUrl: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&q=80&w=800',
    title: { ru: 'Скидка -20%', uz: 'Chegirma -20%' }
  },
  {
    id: '6',
    category: 'process',
    imageUrl: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=800',
    title: { ru: 'Отделка стен', uz: 'Devorlarni bezash' }
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    clientName: 'Алишер Усманов',
    address: 'ул. Нукусская, д. 15, кв. 42',
    phone: '+998 90 123 45 67',
    contractNumber: '145',
    totalEstimate: 150000000, // 150 mln
    startDate: '2023-10-01',
    deadline: '2024-02-15',
    status: 'process',
    currentStage: 'Чистовая отделка',
    stage: 'Чистовая отделка',
    forecast: '15 февраля 2024',
    finance: {
      total: 150000000,
      paid: 90000000,
      remaining: 60000000
    },
    payments: [
      { id: 'p1', date: '2023-10-01', amount: 50000000, comment: 'Аванс 30%', description: 'Первый платеж - аванс' },
      { id: 'p2', date: '2023-11-15', amount: 40000000, comment: 'Второй этап', description: 'Оплата после завершения черновых работ' },
    ],
    timeline: [
      { 
        id: 't1', 
        date: '2023-10-05', 
        type: 'text', 
        title: '', 
        description: '',
        message: 'Здравствуйте! Сегодня началась работа на вашем объекте. Бригада п��иступила к демонтажу.',
        status: 'completed'
      },
      { 
        id: 't2', 
        date: '2023-10-06', 
        type: 'photo', 
        title: '', 
        description: '', 
        message: 'Демонтаж завершен, вывезли весь мусор',
        mediaUrl: 'https://images.unsplash.com/photo-1678944827354-fb54b9040a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBkZW1vbGl0aW9uJTIwd29ya3xlbnwxfHx8fDE3NzEwMDU1OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'completed'
      },
      { 
        id: 't3', 
        date: '2023-10-20', 
        type: 'photo', 
        title: '', 
        description: '', 
        message: 'Завершили разводку сантехники. Использовали трубы Rehau',
        mediaUrl: 'https://images.unsplash.com/photo-1751486289950-5c4898a4c773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmluZyUyMHBpcGVzJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc3MDk3NTA0MXww&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'completed'
      },
      { 
        id: 't4', 
        date: '2023-11-10', 
        type: 'photo', 
        title: '', 
        description: '', 
        message: 'Электромонтаж готов. Проложены все кабели и установлен щиток',
        mediaUrl: 'https://images.unsplash.com/photo-1759916569063-8ee7eb32035e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwd2lyaW5nJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc3MDkzMDMxNnww&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'completed'
      },
      { 
        id: 't5', 
        date: '2023-11-25', 
        type: 'text', 
        title: '', 
        description: '',
        message: 'Стяжка пола выполнена, нужно дать высохнуть 2 недели',
        status: 'completed'
      },
      { 
        id: 't6', 
        date: '2023-12-15', 
        type: 'video', 
        title: '', 
        description: '',
        message: 'Штукатурка стен завершена. Посмот��ите результат',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        status: 'completed'
      },
      { 
        id: 't7', 
        date: '2024-01-15', 
        type: 'photo', 
        title: '', 
        description: '',
        message: 'Начали укладку плитки в санузлах. Используем Kerama Marazzi',
        mediaUrl: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxlJTIwZmxvb3JpbmclMjBjZXJhbWljfGVufDF8fHx8MTc3MTAwNTU5OXww&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'in_progress'
      },
      { 
        id: 't8', 
        date: '2024-02-01', 
        type: 'text', 
        title: '', 
        description: '',
        message: 'На следующей неделе начнем покраску стен',
        status: 'planned'
      },
    ]
  },
  {
    id: '2',
    clientName: 'Мадина Каримова',
    address: 'ЖК Infinity, Блок А',
    phone: '+998 90 999 88 77',
    contractNumber: '148',
    totalEstimate: 85000000,
    startDate: '2023-12-01',
    deadline: '2024-03-01',
    status: 'new',
    currentStage: 'Замер и смета',
    stage: 'Замер и смета',
    forecast: '1 марта 2024',
    finance: {
      total: 85000000,
      paid: 0,
      remaining: 85000000
    },
    payments: [],
    timeline: [
      { 
        id: 't1', 
        date: '2023-12-05', 
        type: 'info', 
        title: 'Первый выезд на объект', 
        description: 'Замеры и фотофиксация',
        comment: 'Осмотр квартиры и консультация с клиентом',
        status: 'completed'
      },
      { 
        id: 't2', 
        date: '2024-01-10', 
        type: 'doc', 
        title: 'Подготовка сметы', 
        description: 'Расчет стоимости работ и материалов',
        comment: 'Детальная смета со всеми позициями',
        status: 'planned'
      },
    ]
  }
];

// Initial leads data
export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Алишер Усманов',
    phone: '+998 90 123 45 67',
    source: 'calculator',
    status: 'new',
    date: '13.02.2026',
    time: '10:30',
    calculatorData: {
      area: 85,
      type: 'new',
      level: 'standard',
      estimatedCost: 153000000
    }
  },
  {
    id: 'lead-2',
    name: 'Елена Ким',
    phone: '+998 90 987 65 43',
    source: 'booking',
    status: 'contacted',
    date: '12.02.2026',
    time: '14:20',
    bookingData: {
      date: '15.02.2026',
      time: '11:00',
      address: 'ЖК Compass, блок B, кв. 45'
    }
  },
  {
    id: 'lead-3',
    source: 'calculator',
    status: 'new',
    date: '13.02.2026',
    time: '09:15',
    calculatorData: {
      area: 60,
      type: 'secondary',
      level: 'economy',
      estimatedCost: 90000000
    }
  }
];

export const INITIAL_CALCULATOR_PRICES = {
  new: { economy: 1200000, standard: 1800000, premium: 3500000 },
  secondary: { economy: 1500000, standard: 2200000, premium: 4000000 }
};