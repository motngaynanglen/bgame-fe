"use client";
import { orderApiRequest } from "@/src/apiRequests/orders";
import { useQuery } from "@tanstack/react-query";
import { Divider } from "antd";
import { useParams } from "next/navigation";
import React from "react";

interface OrderItem {
  order_item_id: string;
  product_id: string;
  template_product_name: string;
  product_template_id: string;
  template_image: string;
  current_price: number;
  image: string;
}

interface OrderDetail {
  order_status: string;
  full_name: string;
  address: string;
  phone_number: string;
  total_price: number;
  total_item: number;
  order_code: string;
  order_id: string;
  email: string;
  order_created_at: string;
  order_items: OrderItem[];
}

export default function DetailOrder() {
  const { id } = useParams();

  const { data, isLoading } = useQuery<OrderDetail>({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await orderApiRequest.getOrderById({
        orderID: id,
      });
      return res.data;
    },
  });

  console.log("data", data);
  console.log("data order", data?.order_items);

  if (isLoading || !data) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 border-2 border-gray-400 rounded-lg ">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary mb-6">
          Chi tiết đơn hàng {data.order_code}
        </h2>
        {/* Order Status (vẫn ở hàng riêng) */}
        <div className="flex mb-6">
          <h3 className="font-semibold text-gray-900 ">
            Trạng thái đơn hàng:{" "}
          </h3>
          <span className={`px-2 rounded-full  font-medium`}>
            {data.order_status === "DELIVERING" && "Đang giao hàng"}
            {data.order_status === "SENT" && "Đã giao hàng"}
            {data.order_status === "CANCELLED" && "Đã huỷ"}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row border-t pt-6 gap-6">
        {/* LEFT: Info */}
        <div className="w-full md:w-1/2 space-y-8">
          {/* Shipping & Billing và Payment/Shipping chung một hàng 2 cột */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            {/* Shipping & Billing Info */}
            <div>
              <div className="space-y-8">
                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                  <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                    Tên người nhận
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                    {data.full_name}
                  </dd>
                </dl>
                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                  <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                    Địa chỉ
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                    {data.address}
                  </dd>
                </dl>
                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                  <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                    {data.email}
                  </dd>
                </dl>
                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                  <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                    Số điện thoại
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                    {data.phone_number}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="space-y-8">
              {/* Payment Method */}
              <div className="space-y-8">
                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                  <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                    Phương thức thanh toán
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                    Chuyển khoản
                  </dd>
                </dl>
              </div>

              {/* Shipping Method */}
              <div className="space-y-8">
                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                  <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                    Thời gian giao hàng dự kiến:
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                    (1-3 ngày làm việc)
                  </dd>
                </dl>
                <p className="mt-2 text-sm text-gray-500">
                  Please notify me once the order has been shipped, and provide
                  the tracking information for my reference.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Products */}
        <div className="w-full md:w-1/2 border-l pl-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Danh sách sản phẩm
          </h3>
          <div className="space-y-4">
            {" "}
            {data.order_items.map((item) => {
              const image = item.template_image.split("||")[0];
              return (
                <div
                  key={item.order_item_id}
                  className="flex gap-4 items-start"
                >
                  <img
                    src={image}
                    alt={item.template_product_name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {item.template_product_name}
                    </p>
                    <p className="text-sm text-gray-500">Qty: 1</p>
                  </div>
                  <p className="text-violet-600 font-semibold">
                    {(item.current_price).toLocaleString()}đ
                  </p>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="border-t mt-4 pt-4 text-right text-lg font-bold text-violet-600">
            Tổng tiền: {(data.total_price).toLocaleString()}đ
          </div>
        </div>
      </div>
    </div>
    // <div className="min-h-screen text-white pt-2 sm:p-4">
    //   <div className="min-h-screemax-w-5xl mx-auto space-y-8  border-4 border-gray-800 p-4 rounded-lg bg-gray-900">
    //     <div className="flex justify-between items-center">
    //       <h3 className="text-xl font-bold">Mã đơn Hàng: {id}</h3>{" "}
    //       <h3 className="tetx-lg font-semibold">Trạng thái: {data.order_status}</h3>
    //     </div>
    //     {/* <Divider style={{ borderColor: "white" }} /> */}
    //     <div className="grid grid-cols-3 gap-4 ">
    //       <div className="flex flex-col space-y-4 border-r-2 ">
    //         <h3 className="text-xl font-bold">Thông tin người nhận</h3>
    //         <p>Người nhận: {data.full_name}</p>
    //         <p>Địa chỉ: {data.address}</p>
    //         <p>Số điện thoại: {data.phone_number}</p>
    //       </div>
    //       <div className="flex flex-col space-y-4 border-r-2">
    //         <h3 className="text-xl font-bold ">Thông tin giao hàng</h3>
    //         <p>Phương thức giao hàng: Giao tận nơi</p>
    //         <p>Trạng thái giao hàng: chuẩn bị giao</p>
    //       </div>
    //       <div className="flex flex-col space-y-4">
    //         <h3 className="text-xl font-bold">Thông tin thanh toán</h3>
    //         <p>Phương thức thanh toán: Thanh toán khi nhận hàng</p>
    //         <p>Trạng thái thanh toán: Chưa thanh toán</p>
    //       </div>
    //     </div>
    //     <Divider style={{ borderColor: "white" }} />
    //     <div className="flex flex-col space-y-4">
    //       <h3 className="text-xl font-bold">Chi tiết đơn hàng</h3>
    //       <table className="min-w-full text-center border-collapse border border-gray-800">
    //         <colgroup>
    //           <col className="w-[300px]" />
    //           <col />
    //           <col className="w-[80px]" />
    //           <col className="w-[150px]" />
    //           <col className="w-[150px]" />
    //         </colgroup>
    //         <thead>
    //           <tr>
    //             <th className="border border-gray-800 p-2">Mã sản phẩm</th>
    //             <th className="border border-gray-800 p-2">Tên sản phẩm</th>
    //             <th className="border border-gray-800 p-2">SL</th>
    //             <th className="border border-gray-800 p-2">Giá</th>
    //             <th className="border border-gray-800 p-2">Thành tiền</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           <tr>
    //             <td className="border border-gray-800 p-2">SP001</td>
    //             <td className="border border-gray-800 p-2">Sản phẩm 1</td>
    //             <td className="border border-gray-800 p-2">1</td>
    //             <td className="border border-gray-800 p-2">100.000 VNĐ</td>
    //             <td className="border border-gray-800 p-2">100.000 VNĐ</td>
    //           </tr>
    //         </tbody>
    //       </table>
    //       <div className="flex justify-end mt-4">
    //         <h3 className="text-xl font-bold">Tổng tiền: {data.total_price}</h3>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
