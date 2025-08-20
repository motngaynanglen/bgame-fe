"use client";
import { useEffect, useState, useRef } from "react";
import { Button, Spin, Typography } from "antd";
import { notifyError, notifySuccess } from "@/src/components/Notification/Notification";
import transactionApiRequest from "@/src/apiRequests/transaction";

const { Text } = Typography;

interface PaymentStatusCheckerProps {
    referenceID: string;
    token?: string;
    onSuccess: () => void; // callback khi thanh toán thành công
}

export default function PaymentStatusChecker({
    referenceID,
    token,
    onSuccess
}: PaymentStatusCheckerProps) {
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [timeLeft, setTimeLeft] = useState(30);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const checkPaymentStatus = async () => {
        try {
            const res = await transactionApiRequest.getTransactionStatusByRefId({ referenceID }, token);
            if (res?.statusCode == "200" && res?.data?.Status == "SUCCESS") {
                clearInterval(intervalRef.current as NodeJS.Timeout);
                setChecking(false);
                notifySuccess("Đã thanh toán thành công")
                onSuccess();
            }
        } catch (error) {
            notifyError("Kiểm tra thanh toán", "Có lỗi khi kiểm tra trạng thái.");
        }
    };

    const startChecking = () => {
        setChecking(true);
        setTimeLeft(30);

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current as NodeJS.Timeout);
                    setChecking(false);
                    return 0;
                }
                if ((prev - 1) % 3 === 0) {
                    checkPaymentStatus();
                }
                return prev - 1;
            });

        }, 1000);
    };

    useEffect(() => {
        if (checking) startChecking();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: 16 }}>
            {checking ? (
                <>
                    <Spin spinning size="large" />
                    <div>
                        <Text>Đang kiểm tra thanh toán... ({timeLeft}s)</Text>
                    </div>
                </>
            ) : (
                <Button type="primary" onClick={startChecking} loading={loading}>
                    Kiểm tra lại
                </Button>
            )}
        </div>
    );
}
