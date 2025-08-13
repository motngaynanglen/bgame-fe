"use client"
import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Card,
  Typography,
  Divider,
  List,
  Button,
  Row,
  Col,
  Image,
  Steps,
  Spin,
  Result,
  message,
  QRCode,
  Space,
} from "antd";
import { BookingRequestBody } from "./BookTimeTable";
import { formatDateTime } from "@/src/lib/utils";
import { useAppContext } from "../../app-provider";
import transactionApiRequest from "@/src/apiRequests/transaction";
import { notifyError } from "@/src/components/Notification/Notification";
import { PaymentData } from "@/src/schemaValidations/transaction.schema";
import { set } from "zod";
import { a } from "@react-spring/web";
import { useMutation } from "@tanstack/react-query";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { m } from "framer-motion";
import PaymentStatusChecker from "@/src/components/CheckOut/PaymentStatusChecker";

const { Title, Text } = Typography;
const { Step } = Steps;

interface BookingPaymentModalProps {
  open: boolean;
  onClose: () => void;
  bookTables?: BookingRequestBody;
  paymentData?: PaymentData;
  setPaymentData: (data: PaymentData) => void;
}

interface UserInfo {
  name?: string;
  phone?: string;
  email?: string;
}

const formatSlot = (slot: number, isFirst: boolean = false) => {
  if(isFirst) {
    slot = slot - 1; 
  }
  const hour = Math.floor(slot / 2) + 7;
  const minute = (slot) % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
};

export default function BookingPaymentModal({ open, onClose, bookTables }: BookingPaymentModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { user, isAuthenticated } = useAppContext();
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return bookListApiRequest.createBookList(data, user?.token);
    },
    mutationKey: ["createBookListByStaff"],
    onSuccess: (data) => {
      setPaymentData({ id: data.data });
      handlePaymentAction(data.data);
      message.success("Đặt bàn thành công!");
      setCurrentStep(2);
    },
    onError: (error: any) => {
      message.error(`Đặt bàn thất bại. Vui lòng thử lại. ${error.message}`);
      console.error(error);
    },
  });
  // Bước 2 → Bước 3: kiểm tra thanh toán
  // const handleCheckPayment = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     await new Promise((res) => setTimeout(res, 2000)); // Fake API
  //     setPaymentSuccess(true);
  //     setCurrentStep(3);
  //   } catch {
  //     notifyError("Kiểm tra thanh toán", "Thất bại, vui lòng thử lại.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);
  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setPaymentSuccess(false);
      setLoading(false);
    }
  }, [open]);

  if (!bookTables) {
    if (open) {
      message.error("Không có thông tin đặt bàn để thanh toán.");
    }
    return null;
  }
  const { bookDate, fromSlot, toSlot, tableIDs, bookListItems } = bookTables;
  const slotRange = `${formatSlot(fromSlot,true)} - ${formatSlot(toSlot)}`;
  const tables = tableIDs.map((id, idx) => `Bàn ${idx + 1}`);
  const totalHours = (toSlot - fromSlot + 1) / 2;

  const products = bookListItems.map((item) => {
    return {
      ...item,
      name: item.productName,
      price: item.price,
      total: item.quantity * (item.price ?? 0) * totalHours,
    };
  });
  const totalAmount = products.reduce((sum, p) => sum + p.total, 0);

  // Bước 1 → Bước 2: tạo link + QR
  const handleCreatePayment = () => {
    if (!isAuthenticated) {
      message.error("Vui lòng đăng nhập để thực hiện thanh toán.");
      return;
    }
    setCurrentStep(1);
    mutation.mutate(bookTables);
  };

  const handlePaymentAction = async (id: string) => {
    setLoading(true);
    try {      // Gọi API để lấy URL thanh toán
      const res = await transactionApiRequest.performTransaction(
        {
          referenceID: id,
          type: 0, // booking
          isOffline: false,
          isCash: false,
        },
        user?.token
      );
      if (res.statusCode === "200") {
        const data = {
          id: id,
          qrCode: res.data.qrCode,
          checkoutUrl: res.data.checkoutUrl,
        };
        setPaymentData(data);
      } else {
        notifyError("Lỗi thanh toán", res.message || "Vui lòng thử lại sau.");
      }
    } catch (error) {
      notifyError("Lỗi thanh toán", "Có lỗi xảy ra khi xử lý thanh toán.");
      return;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={<Title level={3}>Thanh toán đặt bàn</Title>}
      width={960}
      bodyStyle={{ padding: 24 }}
    >
      <Steps current={currentStep} style={{ marginBottom: 32 }}>
        <Step title="Xác nhận thông tin" />
        <Step title="Tạo link thanh toán" />
        <Step title="Hoàn tất thanh toán" />
      </Steps>

      {currentStep === 0 && (
        <Row gutter={24}>
          <Col span={16}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Card title="Thông tin khách hàng" bordered>
                <Space direction="vertical">
                  <Text><strong>Họ tên:</strong> {user?.name}</Text>
                  <Text><strong>SĐT:</strong> {"user?.phone"}</Text>
                  <Text><strong>Email:</strong> {"user?.email"}</Text>
                </Space>
              </Card>

              <Card title="Chi tiết đặt bàn" bordered>
                <Space direction="vertical">
                  <Text><strong>Ngày:</strong> {formatDateTime(bookDate, "DATE")}</Text>
                  <Text><strong>Khung giờ:</strong> {slotRange}</Text>
                  <Text><strong>Bàn:</strong> {tables.join(", ")}</Text>
                </Space>
              </Card>

              <Card
                title={`Sản phẩm đã đặt (${products.length})`}
                bordered
                extra={<Text type="secondary">{totalHours} giờ chơi</Text>}
              >
                <List
                  dataSource={products}
                  renderItem={(item) => (
                    <List.Item>
                      <Row style={{ width: "100%" }}>
                        <Col span={10}>{item.name}</Col>
                        <Col span={4}>x{item.quantity}</Col>
                        <Col span={10} style={{ textAlign: "right" }}>
                          {item.price?.toLocaleString()} đ/giờ
                        </Col>
                        <Col span={24} style={{ textAlign: "right", color: "#fa541c" }}>
                          {item.total?.toLocaleString()} đ
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              </Card>
            </Space>
          </Col>

          <Col span={8}>
            <Card title="Thanh toán" bordered>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Tổng cộng: </Text>
                <Text strong style={{ fontSize: 18, color: "#fa541c" }}>
                  {totalAmount.toLocaleString()} đ
                </Text>
              </div>
              <Button
                type="primary"
                size="large"
                block
                onClick={handleCreatePayment}
              >
                Đặt đơn & Tạo link thanh toán
              </Button>
            </Card>
          </Col>
        </Row>
      )}
      {currentStep === 1 && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin spinning={loading || mutation.isPending} size="large">
            <Title level={4}>Đang tạo link thanh toán...</Title>
            <Text>Vui lòng chờ trong giây lát</Text>
          </Spin>
        </div>
      )}

      {currentStep === 2 && paymentData && (
        <div style={{ textAlign: "center" }}>
          {paymentData.qrCode && (
            <>
              <div className="justify-center items-center flex flex-col">
                <QRCode value={paymentData.qrCode} size={256} level="H" />
              </div>
              <p className="font-bold" style={{ marginTop: 8 }}>Quét mã để thanh toán</p>
            </>
          )}

          {paymentData.checkoutUrl && (
            <>
              <p className="italic">Hoặc truy cập đường dẫn dưới đây</p>
              <p>
                <a href={paymentData.checkoutUrl} target="_blank" rel="noopener noreferrer">
                  {paymentData.checkoutUrl}
                </a>
              </p>
            </>
          )}
          <div style={{ marginTop: 12 }}>
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
                setCurrentStep(3);
              }}
            />
          )}
        </div>
      )}

      {currentStep === 3 && paymentSuccess && (
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle="Cảm ơn bạn đã đặt bàn. Bạn có thể xem chi tiết trong lịch sử đặt bàn."
          extra={[
            <Button key="history" href="/customer/rental-history">
              Lịch sử đặt bàn
            </Button>,
            // <Button key="detail" href={`/customer/rental-history/${bookDate}`} type="primary">
            //   Xem chi tiết
            // </Button>,
          ]}
        />
      )}
    </Modal>

  );
};

