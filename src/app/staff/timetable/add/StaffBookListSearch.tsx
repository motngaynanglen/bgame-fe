"use client";
import { useState } from 'react';
import { AutoComplete, Input, Spin, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import productApiRequest from '@/src/apiRequests/product';
import { useAppContext } from '@/src/app/app-provider';

interface BoardGame {
  id: string;
  product_name: string;
  product_group_ref_id: string;
  quantity: number;
  price: number;
  status: boolean;
  image: string;
  rent_price: number;
  rent_price_per_hour: number;
  publisher: string;
  category: string;
  player: string;
  time: string;
  age: number;
  complexity: number;
  code: string;
  product_type: string;
}

export default function StaffBookListSearch({ 
  onAddProduct 
}: {
  onAddProduct: (product: BoardGame) => void;
}) {
  const { user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<{
    value: string;
    label: React.ReactNode;
    product: BoardGame;
  }[]>([]);

  const searchProducts = useMutation({
    mutationFn: async (code: string) => {
      const res = await productApiRequest.getByCode({ code });
      return res.data;
    },
    onSuccess: (products) => {
      if (Array.isArray(products) && products.length > 0) {
        const opts = products.map((product: BoardGame) => ({
          value: product.id,
          label: (
            <div className="flex justify-between">
              <span>{product.product_name} - {product.code} - {product.product_type === "RENT_PRODUCT" ? (<>Sản phẩm cho thuê</>):(<>Sản phẩm bán</>)} </span>
              <span>{product.price?.toLocaleString()}đ</span>
            </div>
          ),
          product,
        }));
        setOptions(opts);
      } else {
        setOptions([]);
        message.warning('Không tìm thấy sản phẩm');
      }
    },
    onError: () => {
      setOptions([]);
      message.error('Lỗi khi tìm kiếm sản phẩm');
    },
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim() && user?.token) {
      searchProducts.mutate(value);
    } else {
      setOptions([]);
    }
  };

  const handleSelect = (value: string) => {
    const selected = options.find((o) => o.value === value);
    if (selected) {
      onAddProduct(selected.product);
      setSearchTerm("");
      setOptions([]);
    }
  };

  if (!user) {
    return <div className="text-red-500">Vui lòng đăng nhập</div>;
  }

  return (
    <div className="mb-4">
      <AutoComplete
        className="w-full"
        value={searchTerm}
        options={options}
        onSearch={handleSearch}
        onSelect={handleSelect}
        notFoundContent={
          searchProducts.isPending ? (
            <Spin size="small" />
          ) : (
            "Nhập mã sản phẩm để tìm kiếm"
          )
        }
      >
        <Input 
          placeholder="Nhập mã/tên sản phẩm..." 
          prefix={<SearchOutlined />}
          size="large"
        />
      </AutoComplete>
    </div>
  );
}