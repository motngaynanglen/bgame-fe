"use client";
import React, { useEffect, useState } from "react";
import { Button, QRCode, Spin, Typography } from "antd";
import transactionApiRequest from "@/src/apiRequests/transaction";
import { notifyError } from "@/src/components/Notification/Notification";
import PaymentStatusChecker from "@/src/components/CheckOut/PaymentStatusChecker";

const { Paragraph } = Typography;

interface PaymentFlowProps {
  referenceID: string;
  type: number;
  token?: string;
  onSuccess?: () => void;
}

export default function PaymentFlow({ referenceID, type, token, onSuccess }: PaymentFlowProps) {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");

  const createPayment = async () => {
    setLoading(true);
    try {
      const res = await transactionApiRequest.performTransaction(
        {
          referenceID,
          type,
          isOffline: false,
          isCash: false,
        },
        token
      );

      if (res.statusCode === "200") {
        setQrCode(res.data.qrCode);
        setCheckoutUrl(res.data.checkoutUrl);
      } else {
        notifyError("Lỗi thanh toán", res.message || "Vui lòng thử lại sau.");
      }
    } catch {
      notifyError("Lỗi thanh toán", "Có lỗi xảy ra khi xử lý thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (referenceID) {
      createPayment();
    }
  }, [referenceID]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Spin size="large" />
        <p>Đang tạo link thanh toán...</p>
      </div>
    );
  }

  // if (!qrCode) return null;

  return (
    <div style={{ textAlign: "center" }}>
      <div className="justify-center items-center flex flex-col">
        <QRCode value={qrCode} size={256} level="H" />
      </div>
      <p className="font-bold" style={{ marginTop: 8 }}>Quét mã để thanh toán</p>
      <p className="italic">Hoặc truy cập đường dẫn dưới đây</p>
      {checkoutUrl && (
        <Paragraph copyable={{ text: checkoutUrl }}>
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
            {checkoutUrl}
          </a>
        </Paragraph>
      )}
      <div style={{ marginTop: 12 }}>
        <Button type="primary" onClick={createPayment} loading={loading}>
          Yêu cầu lại mã QR
        </Button>
      </div>

      <PaymentStatusChecker
        referenceID={referenceID}
        token={token}
        onSuccess={() => onSuccess && onSuccess()}
      />
    </div>
  );
}
