"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  List,
  Avatar,
  Typography,
  Space,
  Tag,
  Button,
  Empty,
  Modal,
  Divider,
  Row,
  Col,
  message,
  Skeleton,
  Pagination,
} from "antd";
import { useRouter } from "next/navigation";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { useAppContext } from "../../app-provider";
import { useRentalStore } from "@/src/store/rentalStore";
import transactionApiRequest from "@/src/apiRequests/transaction";
import { formatDateTime, formatVND } from "@/src/lib/utils";
import PaymentModal from "@/src/components/CheckOut/PaymentModal";

const { Title, Text } = Typography;

/* ---------- Types matching backend JSON ---------- */

interface ProductDto {
  id: string;
  template_id: string;
  ProductName: string;
  TemplateImage?: string;
}

interface BookingDto {
  id: string;
  customer_id?: string;
  from: string;
  to: string;
  type: number; // 0: giờ, 1: ngày (theo sample)
  total_price: number;
  status: string; // CREATED | PAID | ...
  products: ProductDto[]; // note: 'products' per sample
  created_at?: string;
}

interface PagingDto {
  pageNum: number;
  pageSize: number;
  pageCount: number; // number of pages
}

interface BackendResponse {
  statusCode: string; // "200"
  message?: string;
  data: BookingDto[];
  paging?: PagingDto | null;
}

/* ---------- Helpers ---------- */

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  CREATED: { text: "Chưa thanh toán", color: "default" },
  PAID: { text: "Đã thanh toán", color: "green" },
  CANCELLED: { text: "Đã hủy", color: "red" },
  STARTED: { text: "Đang thuê", color: "processing" },
  ENDED: { text: "Kết thúc", color: "default" },
  OVERDUE: { text: "Quá hạn", color: "orange" },
  UNKNOWN: { text: "Chờ xác nhận", color: "default" },
};

/* ---------- Component ---------- */

export default function RentalHistoryPage() {
  const { user } = useAppContext();
  const router = useRouter();
  const qc = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10); // default pageSize (matches sample paging.pageSize)

  const [selected, setSelected] = useState<BookingDto | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{ id: string; type: number } | null>(null);

  const handleOpenPayment = (bookingId: string, bookingType: number) => {
    setSelectedBooking({ id: bookingId, type: bookingType });
    setPaymentModalOpen(true);
  };
  const openDetail = useCallback((b: BookingDto) => {
    setSelected(b);
    setDetailVisible(true);
  }, []);
  const closeDetail = useCallback(() => {
    setSelected(null);
    setDetailVisible(false);
  }, []);

  // Query: rental history with paging params
  const { data: raw, isLoading, isError, refetch } = useQuery<BackendResponse>({
    queryKey: ["rentalHistory", page, pageSize],
    queryFn: async () => {
      const res = await bookListApiRequest.getBookListHistory(
        {
          paging: {
            pageNum: page,
            pageSize,
          },
        },
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

  // const payMutation = useMutation({
  //   mutationFn: async (bookingId: string) => {
  //     message.loading({ content: "Đang tạo link thanh toán...", key: "pay" });
  //     const res = await transactionApiRequest.performTransaction(
  //       { referenceId: bookingId },
  //       user?.token
  //     );
  //     return res;
  //   },
  //   mutationKey: ["payBooking"],
  //   onMutate: () => loadingIndicator(),
  //   onSuccess: (res: any) => {
  //     message.success({ content: "Chuyển đến trang thanh toán...", key: "pay" });
  //     const url = res?.data?.checkoutUrl;
  //     if (url) {
  //       window.location.href = url;
  //     } else {
  //       qc.invalidateQueries({ queryKey: ['rentalHistory'] });
  //     }
  //   },
  //   onError: (err: any) => {
  //     message.error({ content: "Không thể tạo link thanh toán", key: "pay" });
  //   },
  // }
  // );

  // const handlePay = (booking: BookingDto) => {
  //   Modal.confirm({
  //     title: "Xác nhận thanh toán",
  //     content: (
  //       <>
  //         <p>Đơn: <b>#{booking.id}</b></p>
  //         <p>Ngày thuê: <b>{formatDateTime(booking.from, "DATE")}</b></p>
  //         <p>Giờ: <b>{formatDateTime(booking.from, "TIME")}</b> — <b>{formatDateTime(booking.to, "TIME")}</b></p>
  //         <p>Tổng tiền: <b>{formatVND(booking.total_price)}</b></p>
  //       </>
  //     ),
  //     okText: "Thanh toán",
  //     cancelText: "Hủy",
  //     onOk: () => payMutation.mutate(booking.id),
  //   });

  // }
  if (isLoading) {
    return (
      <Card bordered={false} className="w-full">
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card bordered={false} title="Lịch sử thuê">
        <Text type="danger">Không thể tải lịch sử. Vui lòng thử lại.</Text>
        <div style={{ marginTop: 12 }}>
          <Button onClick={() => refetch()}>Tải lại</Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card bordered className="w-full">
        <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Lịch sử thuê
            </Title>
            <Text type="secondary">Danh sách các lượt đặt gần đây</Text>
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
          <Empty description="Bạn chưa có đơn đặt thuê">
            <Button type="primary" onClick={() => router.push("/rental")}>
              Tìm thuê board game
            </Button>
          </Empty>
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
                    style={{ padding: 16 }}
                    extra={
                      <div style={{ minWidth: 220, textAlign: "right", display: "flex", flexDirection: "column", gap: 12 }}>
                        <div>
                          <Text type="secondary">Tổng tiền</Text>
                          <div style={{ fontSize: 18, fontWeight: 600 }}>{formatVND(b.total_price)}</div>
                        </div>

                        <div>
                          <Text type="secondary">Ngày thuê</Text>
                          <div>
                            <Text strong>{formatDateTime(b.from, "DATE")}</Text>
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>
                            Giờ: {formatDateTime(b.from, "TIME")} — {formatDateTime(b.to, "TIME")}
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <Tag color={status.color}>{status.text}</Tag>
                          <Button onClick={() => openDetail(b)}>Chi tiết</Button>
                          {b.status === "CREATED" && (
                            <Button
                              type="primary"
                              onClick={() => handleOpenPayment(b.id, 0)} // 0 = type booking
                            >
                              Thanh toán
                            </Button>
                          )}
                        </div>
                      </div>
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar size={64} src={b.products?.[0]?.TemplateImage} shape="square" />}
                      title={
                        <Space direction="vertical" size={0}>
                          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                            <Text strong>#{b.id}</Text>
                            <Tag>{b.type === 1 ? "Thuê theo ngày" : "Thuê theo giờ"}</Tag>
                            <Text type="secondary">{b.created_at ? formatVND(b.created_at) : ""}</Text>
                          </div>
                        </Space>
                      }
                      description={
                        <div>
                          <Text type="secondary">Số sản phẩm:</Text> <Text strong>{b.products?.length ?? 0}</Text>
                          <div style={{ marginTop: 8 }}>
                            <Space wrap>
                              {b.products?.slice(0, 3).map((p) => (
                                <Card key={p.template_id} size="small" style={{ width: 160 }}>
                                  <div style={{ display: "flex", gap: 8 }}>
                                    <img
                                      src={p.TemplateImage || "https://pagedone.io/asset/uploads/1705474774.png"}
                                      alt={p.ProductName}
                                      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
                                    />
                                    <div style={{ minWidth: 80 }}>
                                      <Text strong style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {p.ProductName}
                                      </Text>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                              {b.products && b.products.length > 3 && (
                                <Card size="small" style={{ width: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <Text type="secondary">+{b.products.length - 3} khác</Text>
                                </Card>
                              )}
                            </Space>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />

            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={totalEstimated}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
              />
            </div>

            {/* Detail Modal */}
            {/* <Modal
              open={detailVisible}
              onCancel={closeDetail}
              title={selected ? `Chi tiết đơn #${selected.id}` : "Chi tiết đơn"}
              footer={[
                <Button key="close" onClick={closeDetail}>
                  Đóng
                </Button>,
                selected && selected.status !== "PAID" && selected.status !== "CANCELLED" ? (
                  <Button key="pay" type="primary" loading={payMutation.isPending} onClick={() => handlePay(selected)}>
                    Thanh toán
                  </Button>
                ) : null,
              ]}
              width={800}
            >
              {selected ? (
                <>
                  <Row gutter={[16, 12]}>
                    <Col span={12}>
                      <Text type="secondary">Ngày thuê</Text>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>{formatDateTime(selected.from, "DATE")}</div>
                      <div style={{ color: "rgba(0,0,0,0.65)" }}>
                        Giờ thuê: <b>{formatDateTime(selected.from, "TIME")}</b>
                      </div>
                      <div style={{ color: "rgba(0,0,0,0.65)" }}>
                        Giờ kết thúc: <b>{formatDateTime(selected.to, "TIME")}</b>
                      </div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Trạng thái</Text>
                      <div style={{ marginTop: 6 }}>
                        <Tag color={(STATUS_MAP[selected.status] ?? STATUS_MAP.UNKNOWN).color}>
                          {(STATUS_MAP[selected.status] ?? STATUS_MAP.UNKNOWN).text}
                        </Tag>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <Text type="secondary">Tổng tiền</Text>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{formatVND(selected.total_price)}</div>
                      </div>
                    </Col>
                  </Row>

                  <Divider />

                  <List
                    dataSource={selected.products}
                    renderItem={(p) => (
                      <List.Item key={p.template_id}>
                        <List.Item.Meta avatar={<Avatar shape="square" size={64} src={p.TemplateImage} />} title={<Text strong>{p.ProductName}</Text>} description={<Text type="secondary">Template ID: {p.template_id}</Text>} />
                      </List.Item>
                    )}
                  />

                  <Divider />

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <Button onClick={() => router.push(`/rental/${selected.id}`)}>Xem trang chi tiết</Button>
                    {selected.status === "CREATED" && <Button type="primary" onClick={() => handlePay(selected)}>Thanh toán</Button>}
                  </div>
                </>
              ) : (
                <Skeleton active />
              )}
            </Modal> */}
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