export interface CalculatorPriceType {
    id: string;
    label: string;
    economy: number;
    standard: number;
    premium: number;
}

export const INITIAL_CALCULATOR_PRICES: CalculatorPriceType[] = [
    { id: 'new', label: 'Новостройка', economy: 150, standard: 250, premium: 450 },
    { id: 'secondary', label: 'Вторичка', economy: 180, standard: 300, premium: 550 },
    { id: 'house', label: 'Частный дом', economy: 250, standard: 350, premium: 650 }
];
