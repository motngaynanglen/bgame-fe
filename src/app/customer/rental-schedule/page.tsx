"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  List,
  Avatar,
  Typography,
  Space,
  Tag,
  Button,
  Empty,
  Row,
  Col,
  Skeleton,
  Pagination,
  Modal,
} from "antd";
import { useRouter } from "next/navigation";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { useAppContext } from "../../app-provider";
import { formatDateTime, formatVND } from "@/src/lib/utils";
import PaymentModal from "@/src/components/CheckOut/PaymentModal";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

/* ---------- Types ---------- */
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

/* ---------- Status map ---------- */
const STATUS_MAP: Record<string, { text: string; color: string }> = {
  CREATED: { text: "Chưa thanh toán", color: "volcano" },
  PAID: { text: "Đã thanh toán", color: "green" },
  CANCELLED: { text: "Đã hủy", color: "red" },
  STARTED: { text: "Đang thuê", color: "blue" },
  ENDED: { text: "Kết thúc", color: "default" },
  OVERDUE: { text: "Quá hạn", color: "orange" },
  UNKNOWN: { text: "Chờ xác nhận", color: "default" },
};

export default function RentalHistoryPage() {
  const { user } = useAppContext();
  const router = useRouter();

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  // Payment modal (giữ nguyên code cũ, chỉ kẹp confirm trước khi mở)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{ id: string; type: number } | null>(null);

  const handleOpenPayment = (bookingId: string, bookingType: number) => {
    setSelectedBooking({ id: bookingId, type: bookingType });
    setPaymentModalOpen(true);
  };

  const confirmBeforePay = (b: BookingDto) => {
    Modal.confirm({
      title: "Xác nhận thanh toán",
      icon: <ExclamationCircleOutlined />,
      okText: "Thanh toán",
      cancelText: "Hủy",
      content: (
        <div className="text-sm leading-6">
          <div>
            Đơn: <b>#{b.code || b.id}</b>
          </div>
          <div>
            Cửa hàng: <b>{b.store_name}</b>
          </div>
          <div className="mt-1">
            Ngày thuê: <b>{formatDateTime(b.from, "DATE")}</b>
          </div>
          <div>
            Giờ: <b>{formatDateTime(b.from, "TIME")}</b> — <b>{formatDateTime(b.to, "TIME")}</b>
          </div>
          <div className="mt-1">
            Tổng tiền: <b>{formatVND(b.total_price)}</b>
          </div>
        </div>
      ),
      onOk: () => handleOpenPayment(b.id, 0), // 0 = type booking
    });
  };

  const { data: raw, isLoading, isError, refetch } = useQuery<BackendResponse>({
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

  const bookings = raw?.data ?? [];
  const paging = raw?.paging ?? null;

  const totalEstimated = useMemo(() => {
    if (!paging) return bookings.length;
    return paging.pageCount * paging.pageSize;
  }, [paging, bookings.length]);

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

  /* ---------- UI ---------- */
  return (
    <>
      <Card bordered className="w-full rounded-2xl p-4 sm:p-6 shadow-sm">
        <Row justify="space-between" align="middle" className="mb-4 sm:mb-5">
          <Col>
            <div className="flex flex-col">
              <Title level={4} className="!m-0">
                Lịch sử thuê
              </Title>
              <Text type="secondary">Các lượt đặt gần đây của bạn</Text>
            </div>
          </Col>
          <Col>
            <Space>
              <Button onClick={() => refetch()}>Làm mới</Button>
              <Button type="primary" onClick={() => router.push("/rental")}>
                Tìm thuê board game
              </Button>
            </Space>
          </Col>
        </Row>

        {bookings.length === 0 ? (
          <div className="py-10">
            <Empty description="Bạn chưa có đơn đặt thuê">
              <Button type="primary" onClick={() => router.push("/rental")}>
                Tìm thuê board game
              </Button>
            </Empty>
          </div>
        ) : (
          <>
            <List
              itemLayout="vertical"
              dataSource={bookings}
              split
              renderItem={(b) => {
                const status = STATUS_MAP[b.status] ?? STATUS_MAP.UNKNOWN;
                return (
                  <List.Item
                    key={b.id}
                    className="!p-2 sm:!p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    style={{ border: "none" }}
                    extra={
                      <div className="min-w-[220px] text-right flex flex-col gap-3 md:gap-3">
                        <div>
                          <Text type="secondary">Tổng tiền</Text>
                          <div className="text-lg font-semibold">{formatVND(b.total_price)}</div>
                        </div>

                        <div>
                          <Text type="secondary">Thời gian thuê</Text>
                          <div className="font-semibold">
                            <CalendarOutlined className="mr-1" />
                            {formatDateTime(b.from, "DATE")}
                          </div>
                          <div className="text-[12px] text-black/60">
                            <ClockCircleOutlined className="mr-1" />
                            Giờ: {formatDateTime(b.from, "TIME")} — {formatDateTime(b.to, "TIME")}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Tag color={status.color} className="self-end">
                            {status.text}
                          </Tag>

                          <div className="flex gap-2 justify-end">
                            <Button
                              size="small"
                              onClick={() => router.push(`/rental/${b.id}`)}
                            >
                              Chi tiết
                            </Button>

                            {b.status === "CREATED" && (
                              <Button
                                type="primary"
                                size="small"
                                onClick={() => confirmBeforePay(b)}
                              >
                                Thanh toán
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5 hover:shadow-md transition-shadow duration-200">
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size={64}
                            src={b.products?.[0]?.TemplateImage}
                            shape="square"
                            className="shadow-sm"
                          />
                        }
                        title={
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                              Mã đơn: <Text strong>#{b.code || b.id}</Text>
                              <Tag>{b.type === 1 ? "Thuê theo ngày" : "Thuê theo giờ"}</Tag>
                              {b.created_at && (
                                <Text type="secondary">{formatDateTime(b.created_at, "DATETIME")}</Text>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-black/80">
                              <ShopOutlined />
                              <span className="font-medium">{b.store_name}</span>
                              <span className="text-black/40">•</span>
                              <span className="text-sm">Số bàn: {b.total_table}</span>
                            </div>
                          </div>
                        }
                        description={
                          <div>
                            <Text type="secondary">Số chủng loại phẩm:</Text>{" "}
                            <Text strong>{b.products?.length ?? 0}</Text>

                            <div className="mt-2">
                              <Space wrap>
                                {b.products?.slice(0, 3).map((p) => (
                                  <Card
                                    key={p.template_id}
                                    size="small"
                                    className="w-[172px] rounded-lg shadow-[0_1px_0_rgba(0,0,0,0.03)]"
                                  >
                                    <div className="flex gap-2">
                                      <img
                                        src={
                                          p.TemplateImage ||
                                          "https://pagedone.io/asset/uploads/1705474774.png"
                                        }
                                        alt={p.ProductName}
                                        className="w-12 h-12 object-cover rounded-md"
                                      />
                                      <div className="min-w-[96px]">
                                        <Text
                                          strong
                                          className="block truncate"
                                          title={p.ProductName}
                                        >
                                          {p.ProductName}
                                        </Text>
                                        <Text type="secondary" className="text-[12px]">
                                          Số lượng: {p.quantity ?? "_"}
                                        </Text>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                                {b.products && b.products.length > 3 && (
                                  <Card
                                    size="small"
                                    className="w-[172px] rounded-lg flex items-center justify-center"
                                  >
                                    <Text type="secondary">
                                      +{b.products.length - 3} khác
                                    </Text>
                                  </Card>
                                )}
                              </Space>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3 md:hidden">
                              <div className="rounded-lg border border-gray-100 p-3">
                                <div className="text-xs text-black/60">Tổng tiền</div>
                                <div className="font-semibold">{formatVND(b.total_price)}</div>
                              </div>
                              <div className="rounded-lg border border-gray-100 p-3">
                                <div className="text-xs text-black/60">Ngày thuê</div>

                                <div className="text-[12px] text-black/60">
                                  Giờ: {formatDateTime(b.from, "TIME")} — {formatDateTime(b.to, "TIME")}
                                </div>
                              </div>
                              <div className="col-span-2 flex justify-end gap-2">
                                <Tag color={status.color}>{status.text}</Tag>
                                <Button size="small" onClick={() => router.push(`/rental/${b.id}`)}>
                                  Chi tiết
                                </Button>
                                {b.status === "CREATED" && (
                                  <Button type="primary" size="small" onClick={() => confirmBeforePay(b)}>
                                    Thanh toán
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  </List.Item>
                );
              }}
            />

            <div className="flex justify-center mt-4">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={totalEstimated}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Card>

      {selectedBooking && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          referenceID={selectedBooking.id}
          type={selectedBooking.type}
          token={user?.token}
        />
      )}
    </>
  );
}
