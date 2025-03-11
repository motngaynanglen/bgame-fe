import { Button, Result } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

export default function CheckOutSuccess() {
  const router = useRouter();

  return (
    <div>
      <Result
        status="success"
        title="Thanh toán thành công !"
        subTitle="Mã đơn hàng: 2017182818828182881."
        extra={[
          <Button onClick={() => router.push("/")} type="primary" key="console">
            Quay lại trang chủ
          </Button>,
          // <Button key="buy">Buy Again</Button>,
        ]}
      />
    </div>
  );
}
