import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
  type: TransactionType;
}

interface FinanceState {
  transactions: Transaction[];
  monthlyBudget: number;
  isDarkMode: boolean;
  currency: string;
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  setMonthlyBudget: (amount: number) => void;
  toggleTheme: () => void;
  
  // Derived calculated values (getters)
  getTotalBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getMonthlyExpenses: () => number;
  getMonthlyIncome: () => number;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      monthlyBudget: 50000, // Default INR budget
      isDarkMode: true,
      currency: '₹',
      
      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: Math.random().toString(36).substring(2, 9),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
      
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },
      
      setMonthlyBudget: (amount) => set({ monthlyBudget: amount }),
      
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      getTotalBalance: () => {
        const { transactions } = get();
        return transactions.reduce((acc, t) => 
          t.type === 'income' ? acc + t.amount : acc - t.amount, 0
        );
      },
      
      getTotalIncome: () => {
        const { transactions } = get();
        return transactions
          .filter((t) => t.type === 'income')
          .reduce((acc, t) => acc + t.amount, 0);
      },
      
      getTotalExpenses: () => {
        const { transactions } = get();
        return transactions
          .filter((t) => t.type === 'expense')
          .reduce((acc, t) => acc + t.amount, 0);
      },
      
      getMonthlyExpenses: () => {
        const { transactions } = get();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return transactions
          .filter((t) => {
            if (t.type !== 'expense') return false;
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
          })
          .reduce((acc, t) => acc + t.amount, 0);
      },
      
      getMonthlyIncome: () => {
        const { transactions } = get();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return transactions
          .filter((t) => {
            if (t.type !== 'income') return false;
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
          })
          .reduce((acc, t) => acc + t.amount, 0);
      },
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
