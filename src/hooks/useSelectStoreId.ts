import { useState, useEffect } from "react";
import { Store, useStores } from "./useStores"; // Import useStores hook

export const useSelectedStore = () => {
  const { stores } = useStores();
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<Store>();

  useEffect(() => {
    if (stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0].id);
      setSelectedStore(stores[0]);
    }
  }, [stores, selectedStoreId]);

  return {
    selectedStoreId,
    selectedStore,
    setSelectedStoreId,
    setSelectedStore,
  };
};