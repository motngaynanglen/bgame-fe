import { create } from "zustand";
import { persist } from "zustand/middleware";

interface POSItem {
  id: string;
  key: string;
  product_name: string;
  code: string;
  quantity: number;
  price: number;
  total: string;
  image: string;
}

interface POSBill {
  items: POSItem[];
}

interface POSStore {
  bills: POSBill[];
  activeBillIndex: number | null;
  error: string | null;
  createBill: () => void;
  addItemToActiveBill: (item: POSItem, quantity?: number) => void;
  removeItemFromActiveBill: (itemId: string) => void;
  updateItemQuantityInActiveBill: (itemId: string, quantity: number) => void;
  clearActiveBill: () => void;
  calculateActiveBillTotal: () => number;
  setActiveBill: (index: number) => void;
  deleteBill: (index: number) => void;
  clearError: () => void;
}

export const usePOSStore = create<POSStore>()(
  // persist(
  (set, get) => ({
    bills: [],
    activeBillIndex: null,
    error: null,

    createBill: () => {
      try {
        set((state) => ({
          bills: [...state.bills, { items: [] }],
          activeBillIndex: state.bills.length - 1,
          error: null,
        }));
      } catch (err) {
        set({
          error: `Failed to create bill: ${
            err instanceof Error ? err.message : String(err)
          }`,
        });
      }
    },

    addItemToActiveBill: (item, quantity = 1) => {
      try {
        if (quantity <= 0) {
          throw new Error("Quantity must be greater than 0");
        }

        set((state) => {
          let bills = state.bills;
          let activeIndex = state.activeBillIndex;

          if (activeIndex === null) {
            bills = [...bills, { items: [] }];
            activeIndex = bills.length - 1;
          }

          if (activeIndex === null || activeIndex >= bills.length) {
            throw new Error("Invalid active bill index");
          }

          const bill = bills[activeIndex];
          const existingItem = bill.items.find((i) => i.id === item.id);

          const updatedItems = existingItem
            ? bill.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
              )
            : [...bill.items, { ...item, quantity }];

          return {
            bills: bills.map((b, idx) =>
              idx === activeIndex ? { ...b, items: updatedItems } : b
            ),
            activeBillIndex: activeIndex,
            error: null,
          };
        });
      } catch (err) {
        set({
          error: `Failed to add item: ${
            err instanceof Error ? err.message : String(err)
          }`,
        });
      }
    },

    removeItemFromActiveBill: (itemId) => {
      try {
        set((state) => {
          if (state.activeBillIndex === null) {
            throw new Error("No active bill to remove item from");
          }

          if (state.activeBillIndex >= state.bills.length) {
            throw new Error("Invalid active bill index");
          }

          return {
            bills: state.bills.map((bill, index) => {
              if (index === state.activeBillIndex) {
                return {
                  ...bill,
                  items: bill.items.filter((i) => i.id !== itemId),
                };
              }
              return bill;
            }),
            error: null,
          };
        });
      } catch (err) {
        set({
          error: `Failed to remove item: ${
            err instanceof Error ? err.message : String(err)
          }`,
        });
      }
    },

    updateItemQuantityInActiveBill: (itemId, quantity) => {
      try {
        if (quantity <= 0) {
          throw new Error("Quantity must be greater than 0");
        }

        set((state) => {
          if (state.activeBillIndex === null) {
            throw new Error("No active bill to update");
          }

          if (state.activeBillIndex >= state.bills.length) {
            throw new Error("Invalid active bill index");
          }

          return {
            bills: state.bills.map((bill, index) => {
              if (index === state.activeBillIndex) {
                const itemExists = bill.items.some((i) => i.id === itemId);
                if (!itemExists) {
                  throw new Error(
                    `Item with id ${itemId} not found in active bill`
                  );
                }

                return {
                  ...bill,
                  items: bill.items.map((i) =>
                    i.id === itemId ? { ...i, quantity } : i
                  ),
                };
              }
              return bill;
            }),
            error: null,
          };
        });
      } catch (err) {
        set({
          error: `Failed to update quantity: ${
            err instanceof Error ? err.message : String(err)
          }`,
        });
      }
    },

    clearActiveBill: () => {
      try {
        set((state) => {
          if (state.activeBillIndex === null) {
            throw new Error("No active bill to clear");
          }

          if (state.activeBillIndex >= state.bills.length) {
            throw new Error("Invalid active bill index");
          }

          return {
            bills: state.bills.map((bill, index) => {
              if (index === state.activeBillIndex) {
                return { ...bill, items: [] };
              }
              return bill;
            }),
            error: null,
          };
        });
      } catch (err) {
        set({
          error: `Failed to clear bill: ${
            err instanceof Error ? err.message : String(err)
          }`,
        });
      }
    },

    calculateActiveBillTotal: () => {
      try {
        const state = get();
        if (state.activeBillIndex === null) {
          throw new Error("No active bill to calculate");
        }

        if (state.activeBillIndex >= state.bills.length) {
          throw new Error("Invalid active bill index");
        }

        const activeBill = state.bills[state.activeBillIndex];
        return activeBill.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      } catch (err) {
        set({
          error: `Failed to calculate total: ${
            err instanceof Error ? err.message : String(err)
          }`,
        });
        return 0;
      }
    },

    setActiveBill: (index) => {
      try {
        if (index < 0 || index >= get().bills.length) {
          throw new Error("Invalid bill index");
        }
        set(() => ({ activeBillIndex: index, error: null }));
      } catch (err) {
        set({
          error: `Failed to set active bill: ${
            err instanceof Error ? err.message : String(err)
          }`,
        });
      }
    },

    deleteBill: (index: number) => {
      try {
        if (index < 0 || index >= get().bills.length) {
          throw new Error("Invalid bill index");
        }

        set((state) => {
          const newBills = state.bills.filter((_, i) => i !== index);
          const isDeletingActive = index === state.activeBillIndex;

          return {
            bills: newBills,
            activeBillIndex: isDeletingActive
              ? newBills.length > 0
                ? 0
                : null
              : state.activeBillIndex !== null && state.activeBillIndex > index
              ? state.activeBillIndex - 1
              : state.activeBillIndex,
            error: null,
          };
        });
      } catch (err) {
        set({
          error: `Failed to delete bill: ${
            err instanceof Error ? err.message : String(err)
          }`,
        });
      }
    },

    clearError: () => {
      set({ error: null });
    },
  })
  // {
  //   name: "pos-bills",
  //   storage: {
  //     getItem: (name) => {
  //       try {
  //         const item = sessionStorage.getItem(name);
  //         return item ? JSON.parse(item) : null;
  //       } catch (err) {
  //         console.error("Failed to load state from sessionStorage:", err);
  //         return null;
  //       }
  //     },
  //     setItem: (name, value) => {
  //       try {
  //         sessionStorage.setItem(name, JSON.stringify(value));
  //       } catch (err) {
  //         console.error("Failed to save state to sessionStorage:", err);
  //       }
  //     },
  //     removeItem: (name) => {
  //       try {
  //         sessionStorage.removeItem(name);
  //       } catch (err) {
  //         console.error("Failed to remove state from sessionStorage:", err);
  //       }
  //     },
  //   },
  // }
  // )
);
