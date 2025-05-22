"use client";
import React, { useEffect, useState } from "react";
import { StoreItem, useCartStore } from "@/src/store/cartStore";
import { Card, Select, Button, InputNumber, Divider, Empty } from "antd";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import Link from "next/link";
import { formatVND } from "@/src/lib/utils";
import { set } from "zod";
import storeApiRequest from "@/src/apiRequests/stores";

const { Option } = Select;

export default function TemplateForm() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
  } = useCartStore();
  const [clientOnlyTotal, setClientOnlyTotal] = useState("0");
  const [storeLoading, setStoreLoading] = useState(false);
  useEffect(() => {
    setClientOnlyTotal(formatVND(calculateTotal()));
  }, [cart]);

  // Phân chia cart theo storeId (nếu đã chọn) và chưa chọn (storeId null/empty)
  const cartByStore: Record<string, typeof cart> = {};
  const unassignedItems: typeof cart = [];

  cart.forEach((item) => {
    if (!item.storeId) {
      unassignedItems.push(item);
    } else {
      if (!cartByStore[item.storeId]) {
        cartByStore[item.storeId] = [];
      }
      cartByStore[item.storeId].push(item);
    }
  });

  const handleStoreChange = (itemId: string, newStoreId: string) => {
    const updated = cart.map((item) =>
      item.id === itemId ? { ...item, storeId: newStoreId } : item
    );
    useCartStore.setState({ cart: updated });
  };

  const canCheckout = unassignedItems.length === 0;


  const fetchStoreList = async (templateId: string): Promise<StoreItem[]> => {
    setStoreLoading(true);

    const res = await storeApiRequest.getListAndProductCountById({
      product_template_id: templateId,
    });
    const { data } = res.data;

    setStoreLoading(false);
    // Map dữ liệu trả về sang định dạng dùng trong cart
    return data.store.map((store: any) => ({
      id: store.store_id,
      name: store.store_name,
      quantity: store.sales_count, // hoặc tính tùy theo logic bạn cần
    }));

  };
  const reloadStoreList = async (templateId: string) => {
    const newStoreList = await fetchStoreList(templateId);

    // Cập nhật storeList trong cart
    const updatedCart = cart.map((item) =>
      item.id === templateId ? { ...item, storeList: newStoreList } : item
    );

    useCartStore.setState({ cart: updatedCart });


  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
      <Divider />
      {unassignedItems.length > 0 && (
        <Card title="Sản phẩm chưa chọn cửa hàng" className="mb-6 border-red-400">
          {unassignedItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b"
            >
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name || ""} className="w-16 h-16" />
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div>{item.price.toLocaleString()}₫</div>
                  <InputNumber
                    min={1}
                    max={item.storeList?.map(store => store.quantity).reduce((a, b) => Math.max(a, b), 0)}
                    value={item.quantity}
                    onChange={(val) => updateQuantity(item.id, val || 1)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="gap-2 flex items-center">
                <Select
                  disabled={storeLoading}
                  loading={storeLoading}
                  showSearch
                  placeholder="Chọn cửa hàng"
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  onChange={(val) => handleStoreChange(item.id, val)}
                >
                  {item.storeList?.map((store) => (
                    <Option
                      key={store.id}
                      value={store.id}
                      disabled={store.quantity < item.quantity}
                    >
                      {store.name} ({store.quantity} sẵn có)
                    </Option>
                  ))}
                </Select>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => reloadStoreList(item.id)}
                />
                </div>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeFromCart(item.id)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {Object.entries(cartByStore).map(([storeId, items], index) => (
        <Card
          key={storeId}
          title={`Đơn hàng #${index + 1} – Cửa hàng ${items[0].storeList?.find(store => store.id === storeId)?.name}`}
          className="mb-6"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b"
            >
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name || ""} className="w-16 h-16" />
                <div>
                  <div className="font-semibold">{item.name} </div>
                  <div>{item.price.toLocaleString()}₫ / sản phẩm</div>
                  <InputNumber
                    min={1}
                    max={item.storeList?.find(store => store.id === item.storeId)?.quantity}
                    value={item.quantity}
                    onChange={(val) => updateQuantity(item.id, val || 1)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Select
                  showSearch
                  value={item.storeId}
                  onChange={(val) => handleStoreChange(item.id, val)}
                  optionFilterProp="children"
                >
                  {item.storeList?.map((store) => (
                    <Option
                      key={store.id}
                      value={store.id}
                      disabled={store.quantity < item.quantity}
                    >
                      {store.name} ({store.quantity} sẵn có)
                    </Option>
                  ))}
                </Select>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => reloadStoreList(item.id)}
                />
                <div className="flex justify-between items-center w-full ms-3">
                  <span className="text-sm  text-gray-500">
                    Số lượng sẵn có: {item.storeList?.find(store => store.id === item.storeId)?.quantity} sản phẩm
                  </span>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Xóa
                  </Button>
                </div>

              </div>
            </div>
          ))}
        </Card>
      ))}

      {cart.length === 0 && (
        < div className="flex flex-col items-center justify-center">
          <Empty description="Giỏ hàng trống" className="mt-10 mb-3" />
          <Link href="/products" >
            <Button type="primary"> Tìm mua sản phẩm </Button>
          </Link>
        </div>

      )}

      <Divider />

      <h3 className="text-lg font-semibold text-center sm:text-left">
        Hóa đơn
      </h3>
      <div className="text-right">
        <div className="text-lg font-semibold mb-2">
          Tổng: {clientOnlyTotal}₫
        </div>

      </div>
      {/* Action Buttons */}
      <div className="flex justify-between">
        <Link href="/products">
          <Button
            variant="solid"
            color="default"
          >
            Tiếp tục mua hàng
          </Button>
        </Link>
        <Link href="/check-out">
          <Button
            type="primary"
            disabled={!canCheckout || cart.length === 0}
          // onClick={() => {
          //   // Gọi API tạo đơn hàng ở đây
          //   alert("Tạo đơn hàng!");
          // }}
          >
            Tiến hành thanh toán
          </Button>
        </Link>
      </div>
    </div>
  );
};

