import { create } from "zustand";

type Rental = {
  title: string;
  method: "days" | "hours";
  startDate: string;
  endDate?: string;
  price: number;
};

type RentalStore = {
  rentals: Rental[];
  addRental: (rental: Rental) => void;
};

export const useRentalStore = create<RentalStore>((set) => ({
  rentals: [],
  addRental: (rental) =>
    set((state) => ({ rentals: [...state.rentals, rental] })),
}));
