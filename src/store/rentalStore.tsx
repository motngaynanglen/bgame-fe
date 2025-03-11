import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Rental = {
  title: string;
  method: 'days' | 'hours';
  startDate: string;
  endDate?: string;
  price: number;
};

type RentalStore = {
  rentals: Rental[];
  addRental: (rental: Rental) => void;
};

export const useRentalStore = create<RentalStore>()(
  persist(
    (set) => ({
      rentals: [],
      addRental: (rental) =>
        set((state) => ({ rentals: [...state.rentals, rental] })),
    }),
    {
      name: 'rental', // Tên của store trong session storage
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      }, // Sử dụng sessionStorage
    }
  )
);