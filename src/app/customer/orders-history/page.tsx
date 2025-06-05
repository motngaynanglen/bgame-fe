"use client";
import { orderApiRequest } from "@/src/apiRequests/orders";
import { formatDateTime, formatVND } from "@/src/lib/utils";
import { PagingResType } from "@/src/schemaValidations/common.schema";
import { Button, Card, Collapse, Empty, message, Modal, notification, Tag } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../app-provider";
import OrderCard from "@/src/components/Card/CardOrder";
import transactionApiRequest from "@/src/apiRequests/transaction";
import { notifyError } from "@/src/components/Notification/Notification";
import { set } from "zod";
const { Panel } = Collapse;
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
  order_type: "SINGLE" | "MULTIPLE" | "MULTIPLE_ITEM";
  group_id: string | null;
  transaction: {
    qrCode: string;
    checkoutUrl: string;
  }
}
interface GroupedOrderType extends DataType {
  subOrders?: DataType[];
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
    filter: {
      status: null,
    },

    paging: {
      pageNum: searchParams?.page ?? 1,
      pageSize: 20,
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

  const groupedOrders = useMemo(() => {
    if (!orders) return [];

    const orderMap = new Map<string, GroupedOrderType>();
    const multipleItems: DataType[] = [];

    // First pass: Populate map with SINGLE and MULTIPLE orders, collect MULTIPLE_ITEM
    orders.forEach(order => {
      if (order.order_type === "MULTIPLE_ITEM") {
        multipleItems.push(order);
      } else {
        orderMap.set(order.id, { ...order }); // Clone to add subOrders later
      }
    });

    // Second pass: Attach MULTIPLE_ITEM orders to their parent MULTIPLE orders
    multipleItems.forEach(item => {
      if (item.group_id) {
        const parentOrder = orderMap.get(item.group_id);
        if (parentOrder && parentOrder.order_type === "MULTIPLE") {
          if (!parentOrder.subOrders) {
            parentOrder.subOrders = [];
          }
          parentOrder.subOrders.push(item);
        }
      }
    });

    // Return only the top-level orders (SINGLE and MULTIPLE parents)
    // Filter out any MULTIPLE_ITEM orders that might not have a parent (though they should)
    return Array.from(orderMap.values()).filter(order => order.order_type !== "MULTIPLE_ITEM");
  }, [orders]);
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
            {groupedOrders?.map((order) => {
              const isMultipleOrder = order.order_type === "MULTIPLE";
              if (!isMultipleOrder && !order.subOrders) {
                return (
                  <div key={order.id} className="mb-4 border rounded-lg p-4 bg-gray-50">
                    <OrderCard key={order.id} order={order} isItem={true} />
                  </div>
                );
              } else {
                return (
                  <div key={order.id} className="mb-4 border rounded-lg p-4 bg-gray-50">
                    <OrderCard order={order} isItem={false} />
                    <Collapse className="mt-2" bordered={false}>
                      <Panel key={`panel-${order.id}`} header={"Chi tiết đơn hàng"}>
                        {order.subOrders?.map((subOrder) => (
                          <OrderCard key={subOrder.id} order={subOrder} isItem={true} />
                        ))}
                      </Panel>
                    </Collapse>
                  </div>
                );
              }

            })}
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

