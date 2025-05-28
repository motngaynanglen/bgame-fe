import { Button, Result } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

export default function CheckOutSuccess({ id }: { id?: string }) {
  const router = useRouter();

  return (
    <div>
      <Result
        status="success"
        title="Thanh toán thành công !"
        subTitle={"Mã đơn hàng:" + id + "."}
        extra={[
          // <Button onClick={() => router.push("/")} type="primary" key="console">
          //   Quay lại trang chủ
          // </Button>,
          // <Button key="buy">Buy Again</Button>,
          // <Button type="primary" onClick={onClose} key="close">
          //   Đóng
          // </Button>,
        ]}
      />
    </div>
  );
}
