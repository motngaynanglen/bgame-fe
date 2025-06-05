"use client";
import POSComponent from "@/src/components/POS/POSComponent";
import CustomTabs from "@/src/components/Tabs/CustomTabs";
import { usePOSStore } from "@/src/store/posStore";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Modal, notification } from "antd";
import { useEffect, useMemo } from "react";

const POSPageTitle = ({ onAdd, disabled }: { onAdd: () => void; disabled: boolean }) => (
  <div className="pos-header flex justify-between items-center">
    <h1 className="text-xl font-semibold">Quản lý bán hàng</h1>
    <Button type="primary" icon={<PlusOutlined />} onClick={onAdd} disabled={disabled}>
      Thêm hóa đơn
    </Button>
  </div>
);
export default function POSPage() {
  const { bills, createBill, deleteBill, setActiveBill, activeBillIndex } = usePOSStore();

  useEffect(() => {
    if (bills.length === 0) {
      createBill();
    }
  }, [bills]);

  const tabItems = useMemo(
    () =>
      bills.map((bill, index) => ({
        label: `Hóa đơn ${index + 1}`,
        children: <POSComponent />,
        key: `bill_${index}`,
        closable: bills.length > 1,
      })),
    [bills]
  );

  const handleAddTab = () => {
    if (bills.length >= 10) {
      notification.warning({
        message: "Giới hạn tab",
        description: "Bạn chỉ có thể mở tối đa 10 hóa đơn cùng lúc",
      });
      return;
    }
    createBill();
  };

  const handleRemoveTab = (targetKey: string) => {
    const index = parseInt(targetKey.split('_')[1]);
    const bill = bills[index];
    if (bill.items.length > 0) {
      Modal.confirm({
        title: "Xác nhận xoá",
        content: "Hóa đơn này đang có sản phẩm. Bạn có chắc chắn muốn xoá?",
        onOk: () => deleteBill(index),
      });
    } else {
      deleteBill(index);
    }
  };

  const handleTabChange = (activeKey: string) => {
    const index = parseInt(activeKey.split('_')[1]);
    if (!isNaN(index) && index >= 0 && index < bills.length) {
      setActiveBill(index);
    }
  };

  return (
    <div className="pos-page-container">
      <Card className="pos-card" title={<POSPageTitle onAdd={handleAddTab} disabled={bills.length >= 10} />}>
        <CustomTabs
          tabItems={tabItems}
          activeKey={activeBillIndex !== null ? `bill_${activeBillIndex}` : undefined}
          onTabAdd={handleAddTab}
          onTabRemove={handleRemoveTab}
          onChange={handleTabChange}
          className="pos-tabs"
          hideAdd={false} // Ẩn nút thêm trên tabs vì đã có nút bên ngoài
        />
      </Card>

    </div>
  );
}