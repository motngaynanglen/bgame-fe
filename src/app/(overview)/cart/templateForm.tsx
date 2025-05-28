"use client";
import React, { useEffect, useState } from "react";
import { StoreItem, useCartStore } from "@/src/store/cartStore";
import {
  Card,
  Select,
  Button,
  InputNumber,
  Divider,
  Empty,
  Checkbox,
  Image,
} from "antd";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import Link from "next/link";
import { formatVND } from "@/src/lib/utils";
import { set } from "zod";
import storeApiRequest from "@/src/apiRequests/stores";
import { notifyError } from "@/src/components/Notification/Notification";
import type { CheckboxProps } from "antd";
import { useRouter } from "next/navigation";

const { Option } = Select;

export default function TemplateForm() {
  const { cart, removeFromCart, updateQuantity, calculateTotal } =
    useCartStore();
  const [clientOnlyTotal, setClientOnlyTotal] = useState("0");
  const [storeLoading, setStoreLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setClientOnlyTotal(formatVND(calculateTotal()));
  }, [cart]);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {}
  );
  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  //   const handleStoreCheckboxChange = (storeId: string, items: typeof item[]) => {
  //   const isAllChecked = items.every((item) => selectedItems[item.id]);
  //   const newSelected = { ...selectedItems };

  //   items.forEach((item) => {
  //     newSelected[item.id] = !isAllChecked; // nếu tất cả đã chọn thì bỏ chọn, ngược lại thì chọn hết
  //   });

  //   setSelectedItems(newSelected);
  // };

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

  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const fetchStoreList = async (templateId: string): Promise<StoreItem[]> => {
    setStoreLoading(true);
    try {
      const res = await storeApiRequest.getListAndProductCountById({
        productTemplateId: templateId,
      });
      const data: StoreItem[]  = res.data;

      // Map dữ liệu trả về sang định dạng dùng trong cart
      return data.map((store: any) => ({
        id: store.store_id,
        name: store.store_name,
        quantity: store.sale_count, // hoặc tính tùy theo logic bạn cần
      }));
    } catch (error) {
      notifyError(
        "Có lỗi xảy ra khi tải danh sách cửa hàng.",
        "Vui lòng thử lại sau."
      );

      return [];
    } finally {
      setStoreLoading(false);
    }
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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
      <Divider />
      {unassignedItems.length > 0 && (
        <Card
          title="Sản phẩm chưa chọn cửa hàng"
          className="mb-6 border-red-400"
        >
          {unassignedItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name || ""}
                  className="w-16 h-16"
                />
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div>{item.price.toLocaleString()}₫</div>
                  <InputNumber
                    min={1}
                    max={item.storeList
                      ?.map((store) => store.quantity)
                      .reduce((a, b) => Math.max(a, b), 0)}
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

      {/* Phân chia giỏ hàng theo cửa hàng */}
      {Object.entries(cartByStore).map(([storeId, items], index) => (
        <Card
          key={storeId}
          title={
            <div className="flex items-center gap-2">
              {/* <Checkbox
                checked={items.every((item) => selectedItems[item.id])}
                indeterminate={
                  items.some((item) => selectedItems[item.id]) &&
                  !items.every((item) => selectedItems[item.id])
                }
                onChange={() => handleCheckboxChange(storeId)}
              /> */}
              <span>
                Cửa hàng{" "}
                {
                  items[0].storeList?.find((store) => store.id === storeId)
                    ?.name
                }
              </span>
            </div>
          }
          className="mb-6"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 "
            >
              {/* hình ảnh sản phẩm */}
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedItems[item.id] || false}
                  onChange={() => handleCheckboxChange(item.id)}
                />

                <Image
                  style={{ borderRadius: "0.5rem" }}
                  width={96}
                  height={96}
                  src={item.image}
                  // alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg mr-2 sm:pr-0"
                  loading="lazy"
                />
                <div className="h-24 flex flex-col justify-between ">
                  <div className="text-lg font-semibold">{item.name}</div>
                  <div className="font-bold">
                    {item.price.toLocaleString()}₫
                  </div>
                  <InputNumber
                    min={1}
                    max={
                      item.storeList?.find((store) => store.id === item.storeId)
                        ?.quantity
                    }
                    value={item.quantity}
                    onChange={(val) => updateQuantity(item.id, val || 1)}
                  />
                </div>
              </div>
              <div className="h-24 flex flex-col  justify-around  items-end">
                <Select
                  showSearch
                  value={item.storeId}
                  onChange={(val) => handleStoreChange(item.id, val)}
                  optionFilterProp="children"
                  className="w-full"
                >
                  {item.storeList?.map((store) => (
                    <Option
                      key={store.id}
                      value={store.id}
                      disabled={store.quantity < item.quantity}
                    >
                      {store.name}
                    </Option>
                  ))}
                </Select>
                {/* <Button
                  icon={<ReloadOutlined />}
                  onClick={() => reloadStoreList(item.id)}
                /> */}
                <div className="flex justify-between items-center w-full ms-3">
                  <span className="text-sm  text-gray-500">
                    Số lượng sẵn có:{" "}
                    {
                      item.storeList?.find((store) => store.id === item.storeId)
                        ?.quantity
                    }{" "}
                    sản phẩm
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
        <div className="flex flex-col items-center justify-center">
          <Empty description="Giỏ hàng trống" className="mt-10 mb-3" />
          <Link href="/products">
            <Button type="primary"> Tìm mua sản phẩm </Button>
          </Link>
        </div>
      )}

      <Divider />

      {/* <h3 className="text-lg font-semibold text-center sm:text-left">
        Hóa đơn
      </h3>
      <div className="text-right">
        <div className="text-lg font-semibold mb-2">
          Tổng: {clientOnlyTotal}
        </div>
      </div> */}
      {/* Order Summary */}
      <div className="  rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-center sm:text-left">
          Hóa đơn
        </h3>
        <div className="space-y-2">
          {/* <div className="flex justify-between">
              <span>Original price</span>
              <span>$6,592.00</span>
            </div>
            <div className="flex justify-between text-green-500">
              <span>Savings</span>
              <span>-$299.00</span>
            </div> */}
          <div className="flex justify-between">
            <span className="basis-2/3">Mã giảm giá</span>
            <input
              type="text"
              id="standard_success"
              aria-describedby="standard_success_help"
              className="basis-1/2 block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-green-600 appearance-none dark:text-white dark:border-green-500 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder="Nhập mã giảm giá"
            />
          </div>
          <div className="flex justify-between">
            <span>Phí giao hàng</span>
            <span>0₫</span>
          </div>
          {/* <div className="flex justify-between">
              <span>Tax</span>
              <span>$799</span>
            </div> */}
        </div>
        <div className="border-t border-gray-700 pt-4 flex justify-between font-bold text-lg">
          <span>Tổng tiền: </span>
          <span> {calculateTotal().toLocaleString("vi-VN")}₫</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-4">
        <button
          type="button"
          className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Tiếp tục mua hàng
        </button>
        <button
          className={`bg-blue-600 text-white px-6 py-3 rounded-lg ${
            cart.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-500"
          }`}
          disabled={cart.length === 0}
          onClick={() => router.push("/check-out")}
        >
          Tiến hành thanh toán
        </button>
      </div>
    </div>
  );
}
