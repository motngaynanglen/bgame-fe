"use client";
import { orderApiRequest } from "@/src/apiRequests/orders";
import CheckOutSuccess from "@/src/components/CheckOut/CheckOutSuccess";
import {
  notifyError
} from "@/src/components/Notification/Notification";
import { HttpError } from "@/src/lib/httpAxios";
import { useCartStore } from "@/src/store/cartStore";
import { List, Modal, Radio, RadioChangeEvent } from "antd";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../app-provider";

interface FormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
}

interface AddressData {
  province: string;
  districts: {
    district: string;
    wards: string[];
  }[];
}

const data = [
  "Giao hàng tiết kiệm",
  "Giao hàng nhanh",
  "Giao hàng qua Ahamove",
  "Giao hàng qua Viettel Post",
];

export default function CheckOut() {
  const [openResponsive, setOpenResponsive] = useState(false);
  const { cart, calculateTotal, clearCart, buyNowItem  } = useCartStore();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { user } = useAppContext();
  const [value, setValue] = useState(1);
  const productsToCheckout = buyNowItem ? [buyNowItem] : cart;

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>();

  const handleCreateOrder = async (formData: FormData) => {
    const customerID = null;
    const body = {
      customerID,
      orderItems: cart.map((item) => ({
        productTemplateID: item.id,
        quantity: item.quantity,
      })),
      email: formData.email,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
    };

    try {
      const res = await orderApiRequest.createOrder(body, user?.token);
      console.log("Đơn hàng đã được tạo:", body);
      if (res.statusCode == "200") {
        setOpenResponsive(true);
        clearCart(); 

      } else
        notifyError(
          "Đặt trước thất bại!",
          res.message || "Vui lòng thử lại sau."
        );
    } catch (error: any) {
      if (error instanceof HttpError && error.status === 401) {
        notifyError("Đặt trước thất bại!", "bạn cần đăng nhập để tiếp tục");
        // router.push("/login");
      } else {
        // Xử lý lỗi khác nếu có
        console.error("Lỗi khác:", error);
        notifyError(
          "Đặt trước thất bại",
          "Có lỗi xảy ra khi đặt trước sản phẩm. Vui lòng thử lại sau."
        );
      }
    }
  };
  

  return (
    <div className="container mx-auto p-4 bg-sky-50 min-h-screen ">
      <div className="flex flex-col lg:flex-row bg-white shadow-md rounded-lg p-6 ">
        {/* form nhập thông tin giao hàng */}
        <div className="w-full lg:w-2/3 pr-0 lg:pr-4 border-r-2 border-gray-200">
          {/* logo  */}
          <div className="flex justify-center items-center mb-6">
            <img
              src="https://placehold.co/50x50"
              alt="BGImpact logo"
              className="mr-4"
            />
            <h1 className="text-4xl font-bold">BOARD GAME IMPACT</h1>
          </div>
          {/* form nhập thông tin giao hàng */}
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

            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleCreateOrder)}
            >
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                {...register("email", { required: "Email là bắt buộc" })}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full p-2 border border-gray-300 rounded"
                {...register("fullName", { required: "Họ và tên là bắt buộc" })}
              />
              {errors.fullName && (
                <p className="text-red-500">{errors.fullName.message}</p>
              )}
              <input
                type="tel"
                placeholder="Số điện thoại"
                className="w-full p-2 border border-gray-300 rounded"
                {...register("phoneNumber", {
                  required: "Số điện thoại là bắt buộc",
                })}
              />
              {errors.phoneNumber && (
                <p className="text-red-500">{errors.phoneNumber.message}</p>
              )}
              <input
                type="text"
                placeholder="Địa chỉ"
                className="w-full p-2 border border-gray-300 rounded"
                {...register("address", { required: "Địa chỉ là bắt buộc" })}
              />
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
              {/* <div className="flex justify-between space-x-4">
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option>Tỉnh thành</option>
                </select>
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option>Quận huyện (tùy chọn)</option>
                </select>
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option>Phường xã (tùy chọn)</option>
                </select>
              </div> */}

              {/* <textarea
                placeholder="Khách nhập địa chỉ bằng tiếng anh tại đây (tùy chọn)"
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea> */}
              <div className=" font-semibold text-xl mb-4">
                <span>Vận chuyển</span>
              </div>
              <List
                bordered
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item>
                    {" "}
                    <Radio.Group
                      value={value}
                      onChange={onChange}
                      className="flex items-center"
                      options={[{ value: index, label: item }]}
                    />
                  </List.Item>
                )}
              />
              <div className="flex justify-between items-center">
                <a href="/cart" className="text-blue-500">
                  Quay về giỏ hàng
                </a>
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded"
                >
                  ĐẶT HÀNG
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ds sản phẩm, chọn phương thúc thanh toán  */}
        <div className="w-full ps-4 lg:w-1/3 mt-6 lg:mt-0">
          <h2 className="text-xl font-semibold mb-4">
            Đơn hàng 
            {/* ({totalQuantity} sản phẩm) */}
          </h2>
          {productsToCheckout.map((item, index) => {
            const imageUrls = item.image?.split("||") || [];
            return (
              <div key={item.id || index} className="flex items-center mb-4">
                <img
                  src={imageUrls[0]}
                  alt={item.name || "Product image"}
                  className="w-24 h-24 object-cover rounded-lg mr-2 sm:pr-0"
                />
                <div>
                  <p className="text-lg uppercase">{item.name}</p>
                  <p className="font-semibold">
                    {item.price?.toLocaleString() || '0'}đ{" "}
                  </p>
                  <p>Số lượng: {item.quantity }</p>
                </div>
              </div>
            );
          })}
          {/* {cart.map((item, index) => {
            const imageUrls = item.image?.split("||") || [];
            return (
              <div key={item.id || index} className="flex items-center mb-4">
                <img
                  src={imageUrls[0]}
                  alt={item.name || "Product image"}
                  className="w-24 h-24 object-cover rounded-lg mr-2 sm:pr-0"
                />
                <div>
                  <p className="text-lg uppercase">{item.name}</p>

                  <p className="font-semibold">
                    {item.price.toLocaleString()}đ{" "}
                  </p>
                  <p>Số lượng: {item.quantity}</p>
                </div>
              </div>
            );
          })}      */}

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
              <span>{calculateTotal().toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>-</span>
            </div>
          </div>
          <div className="flex justify-between font-semibold text-xl mb-4">
            <span>Tổng cộng</span>
            <span>{calculateTotal().toLocaleString("vi-VN")}₫</span>
          </div>

          <div className="my-6">
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
        closable={false}
      >
        <CheckOutSuccess />
      </Modal>
    </div>
  );
}
