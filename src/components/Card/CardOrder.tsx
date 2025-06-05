import transactionApiRequest from "@/src/apiRequests/transaction";
import { Button, message, Modal, notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { notifyError } from "../Notification/Notification";
import { orderApiRequest } from "@/src/apiRequests/orders";
import { useAppContext } from "@/src/app/app-provider";

type OrderStatus =
  | "DELIVERING"
  | "CREATED"
  | "PAID"
  | "CANCELLED"
  | "SENT"
  | "PREPARED";

interface Order {
  id: string;
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
  order_type: string;
  group_id: string | null;
  transaction: {
    qrCode: string;
    checkoutUrl: string;
  };
}

interface OrderCardProps {
  order: Order;
  isItem?: boolean;
}

export default function OrderCard({ order, isItem = false }: OrderCardProps) {
  const { user } = useAppContext();
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      dateStyle: "medium",
      // timeStyle: "short",
    });
  const router = useRouter();

  const formatCurrency = (price: number) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const getStatusColor = (status: OrderStatus) => {
    switch (status as OrderStatus) {
      case "DELIVERING":
        return "text-yellow-500";
      case "SENT":
      case "PAID":
      case "PREPARED":
        return "text-green-500";
      case "CANCELLED":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };
  const getStatusText = (status: string) => {
    switch (status as OrderStatus) {
      case "DELIVERING":
        return "Đang giao hàng";
      case "SENT":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy";
      case "PAID":
        return "Đang chuẩn bị hàng";
      case "CREATED":
        return "Chờ thanh toán";
      default:
        return "Chuẩn bị gửi hàng";
    }
  };
  const handleReciveOrder = async (orderId: string) => {
    if (orderId === "") {
      notifyError("Lỗi nhận đơn", "Không có dữ liệu đơn hàng.");
      return;
    }
    Modal.confirm({
      title: "Xác nhận đã nhận hàng",
      content: `Bạn có chắn muốn nhận đơn hàng này không? 
      Một khi nhận đơn đồng nghĩa với việc bạn đã nhận được đơn hàng này.`,
      onOk: async () => {
        try {
          // Gọi API để nhận đơn hàng
          const res = await orderApiRequest.updateOrderToSent({
            orderID: orderId,
          }, user?.token);

          notification.success({
            message: res.message || "Đã nhận đơn sản phẩm",
            description: "Cảm ơn bạn đã mua sản phẩm.",
          });
          router.refresh();

        } catch (error) {
          notifyError("Lỗi nhận đơn", "Có lỗi xảy ra khi xử lý yêu cầu nhận đơn.");
        }
      },
    });
  }
  const handleCancelOrder = async (orderId: string) => {
    if (orderId === "") {
      notifyError("Lỗi hủy đơn", "Không có dữ liệu đơn hàng.");
      return;
    }
    Modal.confirm({
      title: "Xác nhận hủy đơn",
      content: `Bạn có chắc chắn muốn hủy đơn hàng này không?`,
      onOk: async () => {
        try {
          // Gọi API để hủy đơn hàng
          const res = await orderApiRequest.cancelOrderByCustomer(
            {
              orderID: orderId,
            },
            user?.token
          );

          notification.success({
            message: res.message || "Đã hủy đơn hàng",
            description: "Đơn hàng đã được hủy thành công.",
          });
          router.refresh();

        } catch (error) {
          notifyError("Lỗi hủy đơn", "Có lỗi xảy ra khi xử lý yêu cầu hủy đơn.");
        }
      },
    });
  }
  function setPaymentData(trans: { id: string; checkoutUrl: any; qrCode: any; }) {
    order.transaction = {
      qrCode: trans.qrCode,
      checkoutUrl: trans.checkoutUrl,
    };
    window.open(trans.checkoutUrl, '_blank');
  }
  const handlePerformTransaction = async (orderId: string) => {
    if (orderId === "") {
      notifyError("Lỗi thanh toán", "Không có dữ liệu thanh toán.");
      return;
    }
    Modal.confirm({
      title: "Xác nhận thanh toán",
      content: `Bạn có chắc chắn muốn thanh toán hóa đơn này không?`,
      onOk: async () => {
        try {
          // Gọi API để lấy URL thanh toán
          const res = await transactionApiRequest.performTransaction(
            {
              referenceID: orderId,
              type: 1, // 1: Thanh toán đơn hàng
            },

          );

          setPaymentData({ id: orderId, checkoutUrl: res.data.checkoutUrl, qrCode: res.data.qrCode });
          // handleRedirectToPayment();
          notification.success({
            message: "Thanh toán thành công",
            description: "Đã tạo đơn hàng và lấy thông tin thanh toán.",
          });
        } catch (error) {
          notifyError("Lỗi thanh toán", "Có lỗi xảy ra khi xử lý thanh toán.");
          return;
        }
      }
    });
  };
  return (
    <section className="bg-white antialiased hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg shadow-md  m-2">
      <div className="mt-6 flow-root sm:mt-8 ">
        <div className="divide-y divide-gray-700 dark:divide-gray-700">

          <div className="flex flex-wrap items-center gap-y-4 p-6 ">
            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1" hidden={order.group_id !== null}>
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400" >
                Mã đơn:
              </dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                <a href="#" className="hover:underline">
                  {order.code || "(Không có mã)"}
                </a>
              </dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                Ngày đặt:
              </dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                {formatDate(order.created_at)}
              </dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                Tổng tiền:
              </dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                {formatCurrency(order.total_price)}
              </dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                Trạng thái:
              </dt>
              <dd className={getStatusColor(order.status)}>
                <span>
                  {getStatusText(order.status)}
                </span>
              </dd>
            </dl>

            <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
              {order.status === "SENT" ? (
                <button
                  type="button"
                  className="w-full rounded-lg border border-green-700 px-3 py-2 text-center text-sm font-medium text-green-700 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-900 lg:w-auto"
                >
                  Mua lại
                </button>
              ) : null}
              {order.status === "CREATED" ? (
                (
                  <div className={!isItem ? "flex flex-col sm:flex-row gap-2 justify-between items-center" : "hidden"}>
                    <Button onClick={() => handlePerformTransaction(order.id)}>
                      Thanh toán
                    </Button>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Hủy đơn
                    </button>
                  </div>
                )
              ) : null}
              {order.status === "DELIVERING" ? (
                (
                  <div className={!isItem ? "flex flex-col sm:flex-row gap-2 justify-between items-center" : "hidden"}>
                    <Button onClick={() => handleReciveOrder(order.id)}>
                      Xác thực đã nhận hàng
                    </Button>

                  </div>
                )
              ) : null}
              {isItem ? (
                <>
                  <Link href={`/customer/order/${order.id}`}>
                    <button
                      // onClick={() => router.push(`order/${order.id}`)}
                      className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
                    >
                      Chi tiết
                    </button>
                  </Link>
                </>
              ) : null}

            </div>
          </div>

        </div>
      </div>
    </section>
    // <div className="bg-white mb-4 shadow-md rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-gray-200">
    //   {/* Thông tin cơ bản */}
    //   <div className="flex-1 space-y-1">
    //     <h3 className="text-lg font-semibold">Mã đơn: {order.code || "(Không có mã)"}</h3>
    //     <p>Người nhận: {order.full_name}</p>
    //     <p>SĐT: {order.phone_number}</p>
    //     <p>Địa chỉ: {order.address}</p>
    //     <p>Email: {order.email}</p>
    //     <p>Số sản phẩm: {order.total_item}</p>
    //   </div>

    //   {/* Thông tin phụ & trạng thái */}
    //   <div className="flex flex-col items-start sm:items-end space-y-1">
    //     <p className="font-medium">Tổng tiền: {formatCurrency(order.total_price)}</p>
    //     <p className={getStatusColor(order.status)}>Trạng thái: {order.status}</p>
    //     <p>Ngày đặt: {formatDate(order.created_at)}</p>
    //     {order.is_delivery === 1 && (
    //       <>
    //         <p>Hãng giao: {order.delivery_brand}</p>
    //         <p>Mã vận đơn: {order.delivery_code}</p>
    //       </>
    //     )}
    //   </div>
    // </div>
  );
}
