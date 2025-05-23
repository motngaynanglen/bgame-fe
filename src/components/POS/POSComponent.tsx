"use client";
import productApiRequest from "@/src/apiRequests/product";
import { usePOSStore } from "@/src/store/posStore";
import { useMutation } from "@tanstack/react-query";
import type { TableProps } from "antd";
import {
  AutoComplete,
  Button,
  Empty,
  Input,
  InputNumber,
  QRCode,
  Space,
  Spin,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";

interface Product {
  id: string;
  key: string;
  product_name: string;
  code: string; // Added the missing 'code' property
  quantity: number;
  price: number;
  total: string;
  image: string;
}

interface POSComponentProps {
  billIndex: number;
}

export default function POSComponent() {
  const {
    bills,
    activeBillIndex,
    addItemToActiveBill,
    updateItemQuantityInActiveBill,
    removeItemFromActiveBill,
    createBill,
    calculateActiveBillTotal,
  } = usePOSStore();
  //  const bill = bills[billIndex];
  const [options, setOptions] = useState<
    { value: string; label: React.ReactNode; product: Product }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<Product[]>([]);

  // if (!bill) {
  //   return <div>Không tìm thấy hóa đơn</div>;
  // }
  useEffect(() => {
    if (activeBillIndex === null) {
      createBill();
    }
  }, [activeBillIndex, createBill]);
  const currentItems =
    activeBillIndex !== null ? bills[activeBillIndex]?.items || [] : [];

  const searchProducts = useMutation({
    mutationFn: async (code: string) => {
      const res = await productApiRequest.getByCode({ code }); // Trả về 1 sản phẩm
      return res.data;
    },
    onSuccess: (products) => {
      if (Array.isArray(products) && products.length > 0) {
        const opts = products.map((product: Product) => ({
          value: product.code,
          label: `${product.code} - ${product.product_name} - ${
            product.price?.toLocaleString?.() || ""
          }đ`,
          product,
        }));
        setOptions(opts);
      } else {
        setOptions([]);
      }
    },
    onError: () => {
      setOptions([]);
    },
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      searchProducts.mutate(value);
    } else {
      setOptions([]);
    }
  };

  const handleSelect = (value: string) => {
    const selected = options.find((o) => o.value === value);
    if (selected) {
      addItemToActiveBill(selected.product);
      setSearchTerm("");
      setOptions([]);
    }
  };

  const totalQuantity = currentItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalAmount = calculateActiveBillTotal().toLocaleString();

  //
  const columns: TableProps<Product>["columns"] = [
    { title: "STT", dataIndex: "index", width: 50 },
    { title: "Tên hàng", dataIndex: "product_name" },
    {
      title: "SL",
      dataIndex: "quantity",
      width: 100,
      render: (value, record) => (
        <InputNumber
          min={1}
          value={value}
          onChange={(newQuantity) =>
            handleQuantityChange(record.key, newQuantity)
          }
        />
      ),
    },
    { title: "Đơn giá", dataIndex: "price", width: 150 },
    { title: "Thành tiền", dataIndex: "total", width: 150 },
    {
      title: "",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => removeItemFromActiveBill(record.id)}>Xóa</a>
        </Space>
      ),
    },
  ];

  const handleQuantityChange = (itemId: string, newQuantity: number | null) => {
    if (newQuantity !== null) {
      updateItemQuantityInActiveBill(itemId, newQuantity);
    }
  };
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {/* Left Panel - Sản phẩm */}
        <div className="col-span-2 relative">
          <AutoComplete
            className="w-full md:w-96"
            value={searchTerm}
            options={options}
            onSearch={handleSearch}
            onSelect={handleSelect}
            notFoundContent={
              searchProducts.isPending ? (
                <Spin size="small" />
              ) : (
                "Không tìm thấy sản phẩm"
              )
            }
          >
            <Input.Search placeholder="Nhập mã sản phẩm..." enterButton />
          </AutoComplete>

          <Table
            dataSource={currentItems}
            columns={columns}
            pagination={false}
            size="small"
            locale={{ emptyText: <Empty description="No Data" /> }}
          />
        </div>

        {/* Right Panel - Thanh toán */}
        <div className="bg-white border rounded p-4 shadow-sm">
          <div className="mb-2">
            <span className="font-medium text-xl">Tên khách hàng:</span>
            <Input placeholder="Khách lẻ" size="middle" className="mt-1" />
          </div>
          <div className="mb-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-xl">Tổng SL hàng:</span>{" "}
              <span className="text-xl">{totalAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl">Giảm giá:</span>{" "}
              <input
                type="text"
                id="standard_success"
                aria-describedby="standard_success_help"
                className="basis-1/5 block text-end w-full text-xl text-black bg-transparent border-0 border-b-2 border-green-600 appearance-none dark:text-white dark:border-green-500 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder="0"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-xl">Thực thu:</span>{" "}
              <span className="text-xl">{totalAmount}</span>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <h2 className="text-xl font-semibold mb-2">Thanh toán</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="radio" name="payment" className="mr-2" />
                <label className="text-lg">Tiền mặt</label>
                <i className="fas fa-money-bill-wave ml-2"></i>
              </div>
              <div className="flex items-center">
                <input type="radio" name="payment" className="mr-2" />
                <label className="text-lg">Chuyển khoản</label>
                <i className="fas fa-money-bill-wave ml-2"></i>
              </div>
            </div>
          </div>
          <div className="flex justify-center my-4">
            <QRCode value="https://momo.vn/payment" size={128} />
          </div>
          <Button type="primary" block size="large">
            THANH TOÁN
          </Button>
        </div>
      </div>
    </div>
  );
}
