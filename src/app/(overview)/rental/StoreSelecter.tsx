// /mnt/data/StoreSelecter.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Select, Avatar, Spin, Empty } from "antd";
import { useStores } from "@/src/hooks/useStores"; // keep your hook
import { useQuery } from "@tanstack/react-query";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

/**
 * StoreSelecter
 * - giữ hook useStores / API đã có (useStores used in your original file)
 * - improved UI: avatar, address snippet, autoSelectFirst option
 */
export default function StoreSelecter({
  value,
  onChange,
  placeholder = "Chọn cửa hàng",
  className = "",
  autoSelectFirst = false,
}: {
  value?: string | null;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
  autoSelectFirst?: boolean;
}) {
  const { stores, isLoading, refetch } = useStores(); // your existing hook
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (autoSelectFirst && !value && stores?.length) {
      onChange?.(stores[0].id);
    }
  }, [autoSelectFirst, stores, value, onChange]);

  const filtered = useMemo(() => {
    if (!search) return stores ?? [];
    return (stores ?? []).filter(
      (s: any) =>
        s.name?.toLowerCase()?.includes(search.toLowerCase()) ||
        s.address?.toLowerCase()?.includes(search.toLowerCase())
    );
  }, [search, stores]);

  if (isLoading) {
    return (
      <div className={`flex items-center ${className}`}>
        <Spin />
      </div>
    );
  }

  if (!(stores?.length)) {
    return (
      <div className={className}>
        <Empty description="Không có cửa hàng" />
      </div>
    );
  }

  return (
    <div className={className}>
      <Select
        showSearch
        placeholder={placeholder}
        value={value ?? undefined}
        onSearch={(v) => setSearch(v)}
        onChange={(v) => onChange?.(v)}
        filterOption={false}
        style={{ width: "100%" }}
      >
        {filtered.map((s: any) => (
          <Option key={s.id} value={s.id}>
            <div className="flex items-center gap-3">
              <Avatar size={36} src={s.logo || undefined}>{(!s.logo && s.name) ? s.name.charAt(0) : null}</Avatar>
              <div className="min-w-0">
                <div className="font-medium truncate">{s.name}</div>
                <div className="text-xs text-gray-500 truncate">{s.address}</div>
              </div>
            </div>
          </Option>
        ))}
      </Select>
    </div>
  );
}
