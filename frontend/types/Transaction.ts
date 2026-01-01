export interface Transaction {
    id: number;
    name: string;
    category: string;
    amount: string;
    date: string;
    avatar: string | null;
    is_income: boolean;
    is_recurring: boolean;
}
