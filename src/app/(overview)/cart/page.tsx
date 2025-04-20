"use client";
import { useCartStore } from "@/src/store/cartStore";
import { Button, Divider, Empty, Image, Input, InputNumber, Space } from "antd";
import { useRouter } from "next/navigation";
import { IoIosClose } from "react-icons/io";

export default function ShoppingCart() {
  const { cart, removeFromCart, clearCart, calculateTotal, updateQuantity } =
    useCartStore();
  const router = useRouter();
  return (
    <div className="min-h-screen text-white pt-2 sm:p-4">
      <div className="max-w-5xl mx-auto space-y-8  border-4 border-gray-800 p-4 rounded-lg bg-gray-900">
        {/* Shopping Cart Header */}
        <h2 className="text-2xl font-bold ">Giỏ Hàng </h2>
        {/* tiêu đề */}
        <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr_1fr_0.5fr] bg-gray-800 p-4 rounded-lg ">
          <div className="flex items-center justify-start ">
            <h1 className="">Sản phẩm</h1>
          </div>
          <div className="flex items-center justify-center space-x-4">
            Số lượng
          </div>
          <div className="flex items-center justify-center space-x-4">Giá</div>

          <div className="flex items-center justify-center space-x-4">
            Tạm tính
          </div>
          <div className="flex items-center justify-center">
            {/* Để trống, cột delete */}
          </div>
        </div>
        {/* Cart Items */}
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-white">
              <Empty
                description={
                  <span className="text-white">
                    Không có sản phẩm trong giỏ hàng
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button onClick={() => router.push("/products")} type="primary">
                  Tìm mua sản phẩm
                </Button>
              </Empty>
            </div>
          ) : (
            <div>
              {cart.map((item, index) => {
                const imageUrls = item.image?.split("||") || [];
                return (
                  <div
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg mb-4 flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr_1fr_0.5fr] items-center"
                  >
                    {/* image and name */}
                    <div className="flex flex-row sm:items-start sm:justify-around md:items-center md:justify-start">
                      <Image
                        style={{ borderRadius: "0.5rem" }}
                        width={96}
                        height={96}
                        src={imageUrls[0]}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg mr-2 sm:pr-0"
                        loading="lazy"
                      />
                      <Divider type="vertical" className="" />
                      <div className="ml-4 sm:ml-0 mr-4">
                        <h1 className="text-lg font-semibold">{item.name}</h1>
                        <div className="text-blue-400 font-bold sm:hidden">
                          {item.price.toLocaleString("vi-VN")}₫
                        </div>
                        <div className="flex items-center justify-center space-x-4 sm:hidden">
                          <InputNumber min={1} defaultValue={item.quantity} />
                        </div>
                      </div>

                      <button
                        className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 sm:hidden"
                        onClick={() => removeFromCart(item.id)}
                      >
                        {/* Delete icon */}
                      </button>
                    </div>

                    {/* quantity */}
                    <div className="hidden sm:flex items-center justify-center space-x-4">
                      <InputNumber
                        min={1}
                        defaultValue={item.quantity}
                        onChange={(value) =>
                          updateQuantity(item.id, value || 1)
                        }
                      />
                    </div>
                    <div className="hidden sm:flex items-center justify-center space-x-4">
                      {item.price.toLocaleString("vi-VN")}
                    </div>
                    {/* tạm tính */}
                    <div className="hidden sm:flex items-center justify-center space-x-4 ">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}
                    </div>
                    {/* Delete Icon */}
                    <div className="hidden sm:flex items-center justify-center">
                      <button
                        className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <IoIosClose />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
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
        <div className="flex justify-between">
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
    </div>
  );
}
