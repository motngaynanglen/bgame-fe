"use client";
import { useState } from "react";
import { AutoComplete, Input, Spin, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import productApiRequest from "@/src/apiRequests/product";
import { useAppContext } from "@/src/app/app-provider";

interface BoardGame {
  id: string;
  product_name: string;
  product_group_ref_id: string;
  productTemplateID: string;
  quantity: number;
  price: number;
  status: string;
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
  onAddProduct,
}: {
  onAddProduct: (product: BoardGame) => void;
}) {
  const { user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<
    {
      value: string;
      label: React.ReactNode;
      product: BoardGame;
    }[]
  >([]);

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
            <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg">
              {/* Hình ảnh */}
              <img
                src={product.image}
                className="w-16 h-16 object-cover rounded-md"
                alt={product.product_name}
              />

              {/* Thông tin sản phẩm */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 truncate py-2">
                      {product.product_name}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.status === "ACTIVE"
                            ? " text-green-800"
                            : " text-red-800"
                        }`}
                      >
                        {product.status === "ACTIVE"
                          ? "Khả dụng"
                          : "Đang được thuê"}
                      </span>
                    </h4>
                    <p className="text-sm text-gray-600">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.product_type === "SALES_PRODUCT"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.product_type === "SALES_PRODUCT"
                          ? "Sản phẩm bán"
                          : "Sản phẩm cho thuê"}
                      </span>{" "}
                      - Mã: {product.code}
                    </p>
                    {/* <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.product_type === "SALES_PRODUCT"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.product_type === "SALES_PRODUCT"
                          ? "Sản phẩm bán"
                          : "Sản phẩm cho thuê"}
                      </span>
                    </div> */}
                  </div>

                  {/* Giá tiền */}
                  <div className="text-right ml-4">
                    <p className="font-bold text-green-600 text-lg">
                      {product.price?.toLocaleString()}đ
                    </p>
                    {product.product_type === "RENT_PRODUCT" && (
                      <p className="text-xs text-gray-500">/buổi</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ),
          product,
        }));
        setOptions(opts);
      } else {
        setOptions([]);
        message.warning("Không tìm thấy sản phẩm");
      }
    },
    onError: () => {
      setOptions([]);
      message.error("Lỗi khi tìm kiếm sản phẩm");
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
