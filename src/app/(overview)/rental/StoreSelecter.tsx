// components/Store/StoreSelector.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Empty, Select, Skeleton } from "antd";
import { useStores } from "@/src/hooks/useStores";
import { useDebouncedCallback } from "use-debounce";

const StoreSelector = ({
  value,
  onChange,
  className = "",
  placeholder = "Chọn cửa hàng",
  autoSelectFirst = true
}: {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  autoSelectFirst?: boolean;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const { stores, isLoading, isError, error } = useStores();

  useEffect(() => {
    if (autoSelectFirst && stores.length > 0 && !value) {
      onChange?.(stores[0].id);
    }
  }, [stores, value, onChange, autoSelectFirst]);

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchValue(value);
  }, 300);

  const filteredStores = useMemo(() => {
    if (!searchValue) return stores;
    return stores.filter(store =>
      store.store_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      store.address.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [stores, searchValue]);

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <Skeleton.Input active size="small" style={{ width: 100, marginBottom: 8 }} />
        <Skeleton.Input active style={{ width: '100%', height: 40 }} />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Lỗi khi tải cửa hàng: {error?.message}</div>;
  }

  return (
    <div className={`w-full ${className}`}>
      <Select
        showSearch
        placeholder={placeholder}
        optionFilterProp="children"
        filterOption={false}
        onSearch={handleSearch}
        onChange={onChange}
        value={value}
        style={{ width: "100%", height: "100%" }}
        dropdownStyle={{ minWidth: 300 }}
        popupMatchSelectWidth={false} // Thay thế dropdownMatchSelectWidth
        loading={isLoading}
        notFoundContent={<Empty description="Không tìm thấy cửa hàng" />}
      >
        {autoSelectFirst ?? (<Select.Option value="" >Tất cả cửa hàng</Select.Option>)}
        {filteredStores.map((store) => (
          <Select.Option key={store.id} value={store.id}>
            <div className="flex flex-col">
              <span className="font-medium">{store.store_name}</span>
              <span className="text-xs text-gray-500">
                {store.address} • {store.hotline}
              </span>
            </div>
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default StoreSelector;