export interface CalculatorPriceType {
    id: string;
    label: string;
    economy: number;
    standard: number;
    premium: number;
}

export const INITIAL_CALCULATOR_PRICES: CalculatorPriceType[] = [
    { id: 'new', label: 'Новостройка', economy: 1200000, standard: 1800000, premium: 3500000 },
    { id: 'secondary', label: 'Вторичка', economy: 1500000, standard: 2200000, premium: 4000000 },
    { id: 'house', label: 'Частный дом', economy: 2000000, standard: 3000000, premium: 5000000 }
];
