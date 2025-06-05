"use client";
import { orderApiRequest } from "@/src/apiRequests/orders";
import { formatDateTime, formatVND } from "@/src/lib/utils";
import { PagingResType } from "@/src/schemaValidations/common.schema";
import { Button, Empty, message, Modal, notification, Tag } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "../../app-provider";
import OrderCard from "@/src/components/Card/CardOrder";
import transactionApiRequest from "@/src/apiRequests/transaction";
import { notifyError } from "@/src/components/Notification/Notification";
import { set } from "zod";

type OrderStatus = "DELIVERING" | "CREATED" | "PAID" | "CANCELLED" | "SENT" | "PREPARED";

interface DataType {
  key: string;
  id: string;
  transaction_id: string;
  customer_id: string;
  staff_id: string;
  code: string;
  email: string;
  full_name: string;
  phone_number: string;
  address: string;
  total_item: number;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  is_delivery: number;
  delivery_brand: string;
  delivery_code: string;
  transaction: {
    qrCode: string;
    checkoutUrl: string;
  }
}

export default function HistoryOrders({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const [orders, setOrders] = useState<DataType[] | undefined>(undefined);
  const [paging, setPaging] = useState<PagingResType | undefined>(undefined);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const { user } = useAppContext();
  const router = useRouter();
  const apiBody = {
    paging: {
      pageNum: searchParams?.page ?? 1,
      pageSize: 10,
    },
  };
  const fetchTableData = async () => {
    setTableLoading(true);
    if (!user) {
      message.error("Bạn cần đăng nhập để đặt trước.");
      setTableLoading(false);
      return;
    }
    const response = await orderApiRequest.getOrderHistory(apiBody, user.token);
    const data: DataType[] | undefined = response.data?.map(
      (item: DataType) => ({
        ...item,
        key: item.id, // Gán id vào key
      })
    );
    setPaging(response.paging);
    setTableLoading(false);
    return data;
  };
  useEffect(() => {
    fetchTableData().then((result) => {
      setOrders(result);
    });
  }, [searchParams]);

 
  return (
    <div className="w-full flex justify-center " >
      <div className=" p-4 w-full  bg-white mt-2 rounded-lg shadow-md">
        <div className="gap-4 sm:flex sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Đơn hàng của bạn
          </h2>

          <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
            <div>
              <label
                htmlFor="order-type"
                className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Select order type
              </label>
              <select
                id="order-type"
                className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              >
                <option selected>Tất cả</option>
                <option value="pre-order">Pre-order</option>
                <option value="transit">In transit</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <span className="inline-block text-gray-500 dark:text-gray-400">
              {" "}
              Thời gian{" "}
            </span>

            <div>
              <label
                htmlFor="duration"
                className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Select duration
              </label>
              <select
                id="duration"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              >
                <option selected>Tuần này</option>
                <option value="this month">Tháng này</option>
                <option value="last 3 months">3 tháng gần nhất</option>
                <option value="lats 6 months">6 tháng gần nhất</option>
                <option value="this year">năm nay</option>
              </select>
            </div>
          </div>
        </div>
        {orders?.length === 0 ? (
          <Empty description={<span>Bạn chưa có đơn hàng </span>}>
            <Button onClick={() => router.push("/products")} type="primary">
              Tìm mua board game
            </Button>
          </Empty>
        ) : (
          <div>
            {orders?.map((order) => (
              <OrderCard key={order.code} order={order} />
            ))}
          </div>

          // <table className="w-full border-collapse border border-gray-300">
          //   <thead>
          //     <tr className="bg-gray-100">
          //       <th className="border p-2">Mã đơn hàng</th>
          //       <th className="border p-2">Ngày tạo đơn</th>
          //       <th className="border p-2">Phương Thức</th>
          //       <th className="border p-2">Giá Tiền</th>
          //     </tr>
          //   </thead>

          //   <tbody>
          //     {orders?.map((order, index) => (
          //       <tr
          //         key={index}
          //         className="border text-center cursor-pointer hover:bg-gray-100 transition"
          //         onClick={() => router.push(`order/${order.id}`)}
          //       >
          //         <td className="border p-2">{order.code || "Không có mã"}</td>
          //         <td className="border p-2">
          //           {formatDateTime(order.created_at, "DATE")}
          //         </td>
          //         <td className="border p-2">
          //           <Tag>{order.status}</Tag>
          //         </td>
          //         <td className="border p-2">
          //           {formatVND(order.total_price)}
          //         </td>
          //       </tr>
          //     ))}
          //   </tbody>
          // </table>
        )}
      </div>
      {/* <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="py-2  border border-gray-200">Đơn hàng</th>
              <th className="py-2 px-4 border border-gray-200">Ngày</th>
              <th className="py-2 px-4 border border-gray-200">Địa chỉ</th>
              <th className="py-2  border border-gray-200">
                Giá trị đơn hàng
              </th>
              <th className="py-2  border border-gray-200">
                Phương thức thanh toán
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center text-black py-4">Không có đơn hàng nào.</td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </div >
  );
}

