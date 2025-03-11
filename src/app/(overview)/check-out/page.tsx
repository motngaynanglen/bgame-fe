"use client";
import CheckOutSuccess from "@/src/components/CheckOut/CheckOutSuccess";
import { Modal } from "antd";
import Link from "next/link";
import React, { useState } from "react";

export default function CheckOut() {
  const [openResponsive, setOpenResponsive] = useState(false);

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row bg-white shadow-md rounded-lg p-6 ">
        <div className="w-full lg:w-2/3 pr-0 lg:pr-6">
          <div className="flex items-center mb-6">
            {/* logo  */}
            <img
              src="https://placehold.co/50x50"
              alt="BGImpact logo"
              className="mr-4"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-4 text-black-2">
                Thông tin nhận hàng
              </h2>
              <Link href={"/login"}>
                {" "}
                <h2>Đăng nhập</h2>
              </Link>
            </div>

            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <input
                type="text"
                placeholder="Địa chỉ"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>Tỉnh thành</option>
              </select>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>Quận huyện (tùy chọn)</option>
              </select>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>Phường xã (tùy chọn)</option>
              </select>
              <textarea
                placeholder="Khách nhập địa chỉ bằng tiếng anh tại đây (tùy chọn)"
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </form>
          </div>
        </div>
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
          <h2 className="text-xl font-semibold mb-4">Đơn hàng (1 sản phẩm)</h2>
          <div className="flex items-center mb-4">
            <img
              src="https://placehold.co/50x50"
              alt="Exploding Kittens product image"
              className="mr-4"
            />
            <div>
              <p>
                Exploding Kittens - Phiên bản Mèo nổ CHÍNH THỨC ĐỘC QUYỀN tại
                Việt Nam
              </p>
              <p className="font-semibold">199.000đ</p>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button className="bg-green-500 text-white p-2 rounded mt-2 w-full">
              Áp dụng
            </button>
          </div>
          <div className="mb-4">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>199.000đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>-</span>
            </div>
          </div>
          <div className="flex justify-between font-semibold text-lg mb-4">
            <span>Tổng cộng</span>
            <span>199.000đ</span>
          </div>
          <div className="flex justify-between">
            <a href="#" className="text-blue-500">
              Quay về giỏ hàng
            </a>
            <button className="bg-green-500 text-white p-2 rounded" onClick={() => setOpenResponsive(true)}>
              ĐẶT HÀNG
            </button>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Thanh toán</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="radio" name="payment" className="mr-2" />
                <label>Chuyển khoản</label>
                <i className="fas fa-money-bill-wave ml-2"></i>
              </div>
              <div className="flex items-center">
                <input type="radio" name="payment" className="mr-2" />
                <label>Thu hộ (COD)</label>
                <i className="fas fa-money-bill-wave ml-2"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

    {/* cai nay la hien thong bao thanh toan thanh */}
      <Modal
        title="Thông báo"
        centered
        open={openResponsive}
        footer={null}
      >
        <CheckOutSuccess />
      </Modal>
    </div>
  );
}
