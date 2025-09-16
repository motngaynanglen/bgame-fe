"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Steps,
  List,
  Avatar,
  Button,
  Divider,
  Row,
  Col,
  Spin,
  Result,
  QRCode,
  message,
  Card,
  Space,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { useAppContext } from "@/src/app/app-provider";
import transactionApiRequest from "@/src/apiRequests/transaction";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { notifyError } from "@/src/components/Notification/Notification";
import PaymentStatusChecker from "@/src/components/CheckOut/PaymentStatusChecker";
import { formatDateTime, formatDurationText } from "@/src/lib/utils";
import { BookingData, BookingRequestBody } from "./BookTimeTable";
import { PaymentData } from "@/src/schemaValidations/transaction.schema";
import { useRentalStore } from "@/src/store/rentalStore";

const { Title, Text } = Typography;
const { Step } = Steps;

const formatSlot = (slot: number, isFirst: boolean = false) => {
  if (isFirst) slot = slot - 1;
  const hour = Math.floor(slot / 2) + 7;
  const minute = slot % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
};

interface BookingPaymentModalProps {
  open: boolean;
  onClose: () => void;
  bookTables?: BookingData;
  bookingBody?: BookingRequestBody;
}

export default function BookingPaymentModal({
  open,
  onClose,
  bookTables,
  bookingBody
}: BookingPaymentModalProps) {
  const { user, isAuthenticated } = useAppContext();
  const { cartStore, cartItems } = useRentalStore();
  const [step, setStep] = useState(0);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mutation tạo booking
  const createBooking = useMutation({
    mutationFn: async (data: BookingRequestBody) => {
      const res = await bookListApiRequest.createBookList(data, user?.token);

      if (res.statusCode !== "200") {
        // Ném lỗi để React Query xử lý trong onError, Cần config để theo template
        throw new Error(res.message || "Đặt bàn thất bại");
      }

      return res;
    },
    onSuccess: (data) => {

      setPaymentData({ id: data.data });
      handlePaymentAction(data.data);
      setStep(1);
    },
    onError: (err: any) => {
      message.error(`Đặt bàn thất bại: ${err.message}`);
    },
  });
  const handleConfirmBooking = () => {
    if (!user || !isAuthenticated) {
      notifyError("Chưa đăng nhập", "Vui lòng đăng nhập để thực hiện thanh toán.");
      return;
    }
    if (!bookingBody) {
      return;
    }
    createBooking.mutate(bookingBody);
  };
  const handlePaymentAction = async (id: string) => {
    setLoading(true);
    try {
      const res = await transactionApiRequest.performTransaction(
        {
          referenceID: id,
          type: 0,
          isOffline: false,
          isCash: false,
        },
        user?.token
      );
      if (res.statusCode === "200") {
        setPaymentData({
          id,
          qrCode: res.data.qrCode,
          checkoutUrl: res.data.checkoutUrl,
        });
        setStep(2);
      } else {
        notifyError("Lỗi thanh toán", res.message || "Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setStep(0);
      setPaymentData(null);
      setPaymentSuccess(false);
    }
  }, [open]);

  if (!bookTables) return null;

  const { bookDate, fromSlot, toSlot, tables } = bookTables;
  const slotRange = `${formatSlot(fromSlot, true)} - ${formatSlot(toSlot)}`;
  const tableNames = tables.map((table) => table.tableName).join(", ");
  const slotCount = toSlot - fromSlot + 1;
  const totalHours = slotCount / 2; // dùng để tính tiền
  const durationLabel = formatDurationText(slotCount); // dùng để hiển thị

  const products = cartItems.map((item) => ({
    ...item,
    name: item.product_name,
    price: item.price,
    total: item.quantity * (item.price ?? 0) * totalHours,
  }));
  const totalAmount = products.reduce((sum, p) => sum + p.total, 0);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      title={<Title level={4}>Thanh toán đặt bàn</Title>}
    >
      <Steps current={step} size="small" className="mb-4">
        <Step title="Xác nhận" />
        <Step title="Tạo link" />
        <Step title="Thanh toán" />
        <Step title="Hoàn tất" />
      </Steps>

      {step === 0 && (
        <Row gutter={24}>
          <Col span={16}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Thông tin đặt bàn */}
              <Card title="Thông tin đặt bàn" bordered>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text type="secondary">🏬 Cửa hàng</Text>
                    <div className="font-medium">{cartStore?.storeName || "N/A"}</div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">📅 Ngày chơi</Text>
                    <div className="font-medium">
                      {formatDateTime(bookDate, "DATE")}
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">⏰ Khung giờ</Text>
                    <div className="font-medium">{slotRange}</div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">🪑 Bàn</Text>
                    <div className="font-medium">{tableNames}</div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">⏳ Tổng thời gian</Text>
                    <div className="font-medium">{durationLabel}</div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">🎲 Tổng slot</Text>
                    <div className="font-medium">{slotCount} slot</div>
                  </Col>
                </Row>
              </Card>

              {/* Sản phẩm */}
              <Card
                title={`Sản phẩm đã đặt (${products.length})`}
                bordered
                extra={<Text type="secondary">{durationLabel} chơi</Text>}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={products}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            shape="square"
                            size={56}
                            src={item.image}
                            alt={item.name}
                          />
                        }
                        title={<div className="font-medium">{item.name}</div>}
                        description={
                          <>
                            <Text type="secondary">
                              SL: {item.quantity} × {item.price?.toLocaleString()} đ/giờ
                            </Text>
                            <div style={{ color: "#fa541c" }}>
                              {item.total?.toLocaleString()} đ
                            </div>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Space>
          </Col>

          {/* Thanh toán */}
          <Col span={8}>
            <Card title="Thanh toán">
              <div style={{ marginBottom: 16 }}>
                <Text strong>Tổng cộng: </Text>
                <Text strong style={{ fontSize: 20, color: "#fa541c" }}>
                  {totalAmount.toLocaleString()} đ
                </Text>
              </div>
              {user && isAuthenticated ? (
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleConfirmBooking}
                >
                  Đặt đơn & Tạo link thanh toán
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  block
                // onClick={}
                >
                  Đăng nhập để thanh toán
                </Button>
              )}

            </Card>
          </Col>
        </Row>
      )}

      {step === 1 && (
        <div className="text-center py-6">
          <Spin spinning={loading || createBooking.isPending} size="large">
            <Title level={5}>Đang tạo link thanh toán...</Title>
            <Text>Vui lòng chờ trong giây lát</Text>
          </Spin>
        </div>
      )}

      {step === 2 && paymentData && (
        <div className="text-center">
          {paymentData.qrCode && (
            <div className="flex justify-center items-center flex-col">
              <QRCode value={paymentData.qrCode} size={256} />
              <p className="font-bold mt-2">Quét mã để thanh toán</p>
            </div>
          )}

          {paymentData.checkoutUrl && (
            <>
              <p className="italic">Hoặc truy cập:</p>
              <a href={paymentData.checkoutUrl} target="_blank" rel="noopener noreferrer">
                {paymentData.checkoutUrl}
              </a>
            </>
          )}

          <div className="mt-4">
            <Button
              type="primary"
              onClick={() => paymentData.id && handlePaymentAction(paymentData.id)}
              loading={loading}
            >
              Yêu cầu lại mã QR
            </Button>
          </div>

          {paymentData.id && (
            <PaymentStatusChecker
              referenceID={paymentData.id}
              token={user?.token}
              onSuccess={() => {
                setPaymentSuccess(true);
                setStep(3);
              }}
            />
          )}
        </div>
      )}

      {step === 3 && paymentSuccess && (
        <Result
          icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
          title="Thanh toán thành công!"
          subTitle="Cảm ơn bạn đã đặt bàn."
          extra={[
            <Button key="close" type="primary" onClick={onClose}>
              Đóng
            </Button>,
          ]}
        />
      )}
    </Modal>
  );
}
