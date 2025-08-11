import { orderApiRequest } from "@/src/apiRequests/orders";
import transactionApiRequest from "@/src/apiRequests/transaction";
import { useAppContext } from "@/src/app/app-provider";
import { Button, Modal, notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notifyError } from "../Notification/Notification";

// type OrderStatus =
//   | "DELIVERING"
//   | "CREATED"
//   | "PAID"
//   | "CANCELLED"
//   | "SENT"
//   | "PREPARED";

interface Order {
  id: string;
  code: string;
  email: string;
  full_name: string;
  phone_number: string;
  address: string;
  total_item: number;
  total_price: number;
  status: string;
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

  const getStatusColor = (status: string) => {
    switch (status) {
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
    switch (status) {
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
          const res = await orderApiRequest.updateOrderToSent(
            {
              orderID: orderId,
            },
            user?.token
          );

          notification.success({
            message: res.message || "Đã nhận đơn sản phẩm",
            description: "Cảm ơn bạn đã mua sản phẩm.",
          });
          router.refresh();
        } catch (error) {
          notifyError(
            "Lỗi nhận đơn",
            "Có lỗi xảy ra khi xử lý yêu cầu nhận đơn."
          );
        }
      },
    });
  };
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
          notifyError(
            "Lỗi hủy đơn",
            "Có lỗi xảy ra khi xử lý yêu cầu hủy đơn."
          );
        }
      },
    });
  };
  console.log("status:", order.status, "isItem:", isItem);
  function setPaymentData(trans: {
    id: string;
    checkoutUrl: any;
    qrCode: any;
  }) {
    order.transaction = {
      qrCode: trans.qrCode,
      checkoutUrl: trans.checkoutUrl,
    };
    window.open(trans.checkoutUrl, "_blank");
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
          const res = await transactionApiRequest.performTransaction({
            referenceID: orderId,
            type: 1, // 1: Thanh toán đơn hàng
          });

          setPaymentData({
            id: orderId,
            checkoutUrl: res.data.checkoutUrl,
            qrCode: res.data.qrCode,
          });
          // handleRedirectToPayment();
          notification.success({
            message: "Thanh toán thành công",
            description: "Đã tạo đơn hàng và lấy thông tin thanh toán.",
          });
        } catch (error) {
          notifyError("Lỗi thanh toán", "Có lỗi xảy ra khi xử lý thanh toán.");
          return;
        }
      },
    });
  };
  return (
    <section className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg shadow-md m-2 transition-colors duration-200">
      <div className="mt-6 flow-root sm:mt-8">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Phần thông tin đơn hàng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {/* Mã đơn */}
            {order.group_id === null && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Mã đơn:
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-white hover:underline">
                  {order.code || "(Không có mã)"}
                </p>
              </div>
            )}

            {/* Ngày đặt */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ngày đặt:
              </p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {formatDate(order.created_at)}
              </p>
            </div>

            {/* Tổng tiền */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng tiền:
              </p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {formatCurrency(order.total_price)}
              </p>
            </div>

            {/* Trạng thái */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Trạng thái:
              </p>
              <div className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </div>
            </div>

            {/* Các nút thao tác */}
            {/* <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 justify-end items-start sm:items-center lg:items-end xl:items-center">
              {order.status === "SENT" && (
                <button
                  type="button"
                  className="w-full sm:w-auto rounded-lg border border-green-700 px-3 py-2 text-center text-sm font-medium text-green-700 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-900"
                >
                  Mua lại
                </button>
              )}

              {order.status === "CREATED" && isItem && (
                <div className="flex gap-2">
                  <Button
                    size="small"
                    onClick={() => handlePerformTransaction(order.id)}
                    className="px-3 py-1.5"
                  >
                    Thanh toán
                  </Button>
                  <button
                    type="button"
                    className="rounded-lg border border-red-700 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Hủy đơn
                  </button>
                </div>
              )}

              {order.status === "DELIVERING" && isItem && (
                <Button
                  size="small"
                  onClick={() => handleReciveOrder(order.id)}
                  className="px-3 py-1.5"
                >
                  Xác nhận đã nhận
                </Button>
              )}

              {isItem && (
                <Link href={`/customer/order/${order.id}`}>
                  <button className="inline-flex justify-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                    Chi tiết
                  </button>
                </Link>
              )}
            </div> */}
          </div>
          {/* phần các nút thao tác */}
          <div className="flex flex-wrap justify-end gap-2 px-6 py-6 mt-2">
            {order.status === "SENT" && (
              <button className="w-full sm:w-auto ...">Mua lại</button>
            )}

            {order.status === "CREATED" && isItem && (
              <>
                <button
                  onClick={() => handlePerformTransaction(order.id)}
                  className="rounded-lg border border-green-700 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-700 hover:text-white ..."
                >
                  Thanh toán
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-red-700 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white ..."
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Hủy đơn
                </button>
              </>
            )}

            {order.status === "DELIVERING" && isItem && (
              <button
                onClick={() => handleReciveOrder(order.id)}
                className="rounded-lg border border-blue-700 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-700 hover:text-white ..."
              >
                Xác nhận đã nhận
              </button>
            )}

            {isItem && (
              <Link href={`/customer/order/${order.id}`}>
                <button className="inline-flex justify-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                  Chi tiết
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
