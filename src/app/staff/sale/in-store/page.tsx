"use client";
import { useEffect } from "react";
import CustomTabs from "@/src/components/Tabs/CustomTabs";
import POSComponent from "@/src/components/POS/POSComponent";
import { usePOSStore } from "@/src/store/posStore";
import { Button, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function POSPage() {
  const { bills, createBill, deleteBill, setActiveBill, activeBillIndex } = usePOSStore();

  useEffect(() => {
    if (bills.length === 0) {
      createBill();
    }
    console.log("bills", bills);
  }, [bills.length, createBill]);

  

  const tabItems = bills.map((bill, index) => ({
    label: `Hóa đơn ${index + 1}`,
    children: <POSComponent />,
    key: `bill_${index}`,
    closable: bills.length > 1,
  }));

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
    if (!isNaN(index) && index >= 0 && index < bills.length) {
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
      <div className="pos-header">
        <h1>Quản lý bán hàng</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddTab}
          disabled={bills.length >= 10}
        >
          Thêm hóa đơn
        </Button>
      </div>

      <CustomTabs
        tabItems={tabItems}
        activeKey={activeBillIndex !== null ? `bill_${activeBillIndex}` : undefined}
        onTabAdd={handleAddTab}
        onTabRemove={handleRemoveTab}
        onChange={handleTabChange}
        className="pos-tabs"
        hideAdd={false} // Ẩn nút thêm trên tabs vì đã có nút bên ngoài
      />
    </div>
  );
}