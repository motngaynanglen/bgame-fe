"use client";
import { useCartStore } from "@/src/store/cartStore";
import { Button, Empty, InputNumber, Typography } from "antd";
import Link from "next/link";
import React from "react";

const items = [
  { name: 'Tam quốc sát"', price: 1499, quantity: 1 },
  { name: "Catan", price: 1998, quantity: 1 },
  { name: "Splendor", price: 898, quantity: 1 },
  { name: 'Nana"', price: 4499, quantity: 1 },
  { name: "Rummikub", price: 499, quantity: 1 },
];

export default function ShoppingCart() {
  const { cart, removeFromCart, clearCart } = useCartStore();

  return (
    <div className="min-h-screen bg-sky-50 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8  border-4 border-gray-800 p-8 rounded-lg bg-gray-900">
        {/* Shopping Cart Header */}
        <h2 className="text-2xl font-bold">Giỏ Hàng </h2>
        <div className="grid grid-cols-5 bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-start ">
            <h1 className="">Tên sản phẩm</h1>
          </div>
          <div className="flex items-center justify-center space-x-4">
            Số lượng
          </div>
          <div className="flex items-center justify-center space-x-4">Giá</div>

          <div className="flex items-center justify-center space-x-4">
            Giá sau khi giảm
          </div>
        </div>
        {/* Cart Items */}
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-white">
              <Empty
                description="No items in cart"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary">Tìm mua sản phẩm</Button>
              </Empty>
            </div>
          ) : (
            <div>
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 bg-gray-800 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-start">
                    <h1>{item.name}</h1>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <InputNumber min={1} defaultValue={item.quantity} />
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    {item.price}
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    {item.price * item.quantity}
                  </div>
                  {/* Delete Icon */}
                  <div className="flex items-center justify-center">
                    <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600" onClick={() => removeFromCart(item.id)}>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Order summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Original price</span>
              <span>$6,592.00</span>
            </div>
            <div className="flex justify-between text-green-500">
              <span>Savings</span>
              <span>-$299.00</span>
            </div>
            <div className="flex justify-between">
              <span>Store Pickup</span>
              <span>$99</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$799</span>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>$7,191.00</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
            Continue Shopping
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
