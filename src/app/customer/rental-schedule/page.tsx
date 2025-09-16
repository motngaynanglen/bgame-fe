"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { useAppContext } from "@/src/app/app-provider";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ShopOutlined,
  TableOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Skeleton,
  Tag,
  Typography
} from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;

interface ProductDto {
  id: string;
  template_id: string;
  ProductName: string;
  TemplateImage?: string;
  quantity: number;
}

interface BookingDto {
  id: string;
  code: string;
  customer_id?: string;
  store_id: string;
  store_name: string;
  from: string;
  to: string;
  type: number; // 0: giờ, 1: ngày
  total_price: number;
  total_table: number;
  status: string; // CREATED | PAID | ...
  products: ProductDto[];
  created_at?: string;
}

interface PagingDto {
  pageNum: number;
  pageSize: number;
  pageCount: number;
}

interface BackendResponse {
  statusCode: string;
  message?: string;
  data: BookingDto[];
  paging?: PagingDto | null;
}

const RentalHistoryView = () => {
  const { user } = useAppContext();
  const router = useRouter();

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  // Payment modal (giữ nguyên code cũ, chỉ kẹp confirm trước khi mở)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{
    id: string;
    type: number;
  } | null>(null);

  const handleOpenPayment = (bookingId: string, bookingType: number) => {
    setSelectedBooking({ id: bookingId, type: bookingType });
    setPaymentModalOpen(true);
  };

  const {
    data: bookings,
    isLoading,
    isError,
    refetch,
  } = useQuery<BackendResponse>({
    queryKey: ["rentalHistory", page, pageSize],
    queryFn: async () => {
      const res = await bookListApiRequest.getBookListHistory(
        { paging: { pageNum: page, pageSize } },
        user?.token
      );
      return res as BackendResponse;
    },
    staleTime: 30_000,
  });

  /* ---------- Loading & Error ---------- */
  if (isLoading) {
    return (
      <Card bordered={false} className="w-full rounded-xl">
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card bordered={false} className="w-full rounded-xl">
        <div className="flex items-center justify-between">
          <Title level={4} className="!m-0">
            Lịch sử thuê
          </Title>
          <Button onClick={() => refetch()}>Tải lại</Button>
        </div>
        <div className="mt-3">
          <Text type="danger">Không thể tải lịch sử. Vui lòng thử lại.</Text>
        </div>
      </Card>
    );
  }

  const formatVND = (amount: string | number | bigint) => {
    const numericAmount = typeof amount === "string" ? Number(amount) : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericAmount);
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const STATUS_MAP: Record<string, { text: string; color: string }> = {
  CREATED: { text: "Chưa thanh toán", color: "volcano" },
  PAID: { text: "Đã thanh toán", color: "green" },
  CANCELLED: { text: "Đã hủy", color: "red" },
  STARTED: { text: "Đang thuê", color: "blue" },
  ENDED: { text: "Kết thúc", color: "default" },
  OVERDUE: { text: "Quá hạn", color: "orange" },
  UNKNOWN: { text: "Chờ xác nhận", color: "default" },
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2 text-gray-800">
            📦 Lịch Sử Đặt Thuê
          </Title>
          <Text type="secondary" className="text-lg">
            Xem lại các phiên chơi board game của bạn
          </Text>
        </div>

        {(bookings?.data?.length ?? 0) === 0 ? (
          <Card className="text-center py-16 rounded-2xl shadow-lg border-0">
            <div className="text-6xl mb-4">🎲</div>
            <Title level={4} className="!mb-2 text-gray-600">
              Chưa có lịch sử đặt thuê
            </Title>
            <Text type="secondary">
              Bắt đầu đặt thuê board game để trải nghiệm nào!
            </Text>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings?.data?.map((booking, index) => (
              <Card
                key={booking.code}
                className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <Text strong className="text-blue-600 text-lg">
                      #{booking.code}
                    </Text>
                  </div>
                  <Tag
                    color={STATUS_MAP[booking.status]?.color || STATUS_MAP.UNKNOWN.color}
                    className="!px-4 !py-1 !rounded-full !text-sm"
                  >
                    {STATUS_MAP[booking.status]?.text || STATUS_MAP.UNKNOWN.text}
                  </Tag>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <ShopOutlined className="text-blue-600 text-lg" />
                      <div>
                        <Text strong className="block text-gray-800">
                          {booking.store_name}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          Địa điểm chơi
                        </Text>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarOutlined className="text-green-600" />
                        <Text strong>Ngày chơi</Text>
                      </div>
                      <Text className="block">{formatDate(booking.from)}</Text>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <ClockCircleOutlined className="text-purple-600" />
                        <Text strong>Thời gian</Text>
                      </div>
                      <Text className="block">
                        {formatTime(booking.from)} - {formatTime(booking.to)}
                      </Text>
                    </div>
                  </div>

                  {/* Thông tin board game */}
                  <div className="lg:col-span-2">
                    <div className="mb-4">
                      <Text strong className="text-gray-700 text-lg">
                        🎯 Board Game đã thuê
                      </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {booking.products?.map((product, idx) => (
                        <div
                          key={product.template_id || idx}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <Avatar
                            src={product.TemplateImage || "/default-game.png"}
                            shape="square"
                            size={48}
                            className="rounded-lg shadow-sm"
                            icon={<UserOutlined />}
                          />
                          <div className="flex-1 min-w-0">
                            <Text
                              strong
                              className="block text-gray-800 truncate"
                            >
                              {product.ProductName}
                            </Text>
                            <Text type="secondary" className="text-sm">
                              Số lượng: {product.quantity}
                            </Text>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Divider className="my-4" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-orange-50 rounded-xl">
                        <TableOutlined className="text-orange-600 text-lg mb-1" />
                        <Text strong className="block">
                          {booking.total_table} bàn
                        </Text>
                        <Text type="secondary" className="text-sm">
                          Số lượng bàn
                        </Text>
                      </div>

                      <div className="text-center p-3 bg-red-50 rounded-xl">
                        <DollarOutlined className="text-red-600 text-lg mb-1" />
                        <Text strong className="block text-green-600">
                          {formatVND(booking.total_price)}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          Tổng chi phí
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Text type="secondary" className="text-sm">
                    🕐 Đặt vào: {formatDate(booking.from)} lúc{" "}
                    {formatTime(booking.from)}
                  </Text>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalHistoryView;
