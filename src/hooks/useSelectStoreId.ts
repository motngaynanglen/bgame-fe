import { useState, useEffect } from "react";
import { useStores } from "./useStores"; // Import useStores hook

export const useSelectedStore = () => {
  const { stores } = useStores();
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  useEffect(() => {
    if (stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0].id);
    }
  }, [stores, selectedStoreId]);

  return {
    selectedStoreId,
    setSelectedStoreId,
  };
};