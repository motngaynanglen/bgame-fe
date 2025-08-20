"use client";
import { useAppContext } from "@/src/app/app-provider";
import { useRentalStore } from "@/src/store/rentalStore";
import { Badge, Button, Card, Empty, InputNumber, Typography } from "antd";
import { IoIosClose } from "react-icons/io";
import {
  ShoppingCartOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

export default function CartRental({
  forceOpen,
  showBookingTable,
  onChooseTable,
}: {
  forceOpen?: boolean;
  showBookingTable?: boolean;
  onChooseTable: (value: boolean) => void;
}) {
  const { cartItems, cartStore, removeFromCart, updateQuantity } = useRentalStore();
  const { user } = useAppContext();
  const [open, setOpen] = useState(true);
  const handleChooseTable = (value: boolean) => {
    onChooseTable?.(value);
  };
  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
    }
    else {
      setOpen(false);
    }
  }, [forceOpen]);
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  return (
    <div className="fixed top-20 right-0 z-50 transition-all duration-300">
      <div
        className={`${open ? "w-[21rem] bg-white" : "w-10 bg-white/70 backdrop-blur-sm"
          } shadow-lg border rounded-l-lg h-[70vh] flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-2 border-b">
          {open ? (
            <>
              <Title level={5} className="!mb-0">
                🛒 Giỏ hàng
              </Title>
              <Badge count={totalQuantity} size="small" />
            </>
          ) : (
            <Badge count={totalQuantity} size="small">
              <ShoppingCartOutlined className="text-lg" />
            </Badge>
          )}
        </div>

        {/* Body scroll riêng */}
        {open && (
          <div className="flex-1 px-2 py-2 overflow-y-auto">
            <Text type="secondary" className="block text-sm mb-2">
              {cartStore?.storeId ? `🏬 Cửa hàng: ${cartStore.storeName ? cartStore.storeName : "Chưa tải được tên"}` : "Chưa chọn cửa hàng"}
            </Text>

            <div className="space-y-3">
              {cartItems.length === 0 ? (
                <Empty
                  description="Không có sản phẩm"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                cartItems.map((item, index) => {
                  const imageUrls = item.image?.split("||") || [];
                  return (
                    <Card
                      key={index}
                      size="small"
                      className="rounded-lg shadow-sm"
                      bodyStyle={{ padding: "8px 12px" }}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={imageUrls[0]}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <Text strong className="block truncate" title={item.name}>
                            {item.name}
                          </Text>
                          <div className="flex items-center gap-2">
                            <Text type="secondary" className="text-sm">
                              SL:
                            </Text>
                            <InputNumber
                              size="small"
                              min={1}
                              max={99}
                              value={item.quantity}
                              onChange={(val) =>
                                updateQuantity(item.productTemplateID, val || 1)
                              }
                            />
                          </div>
                        </div>
                        <Button
                          type="text"
                          danger
                          shape="circle"
                          icon={<IoIosClose size={18} />}
                          onClick={() => removeFromCart(item.productTemplateID)}
                        />
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Footer fix cứng */}
        {open && (
          <div className="border-t px-3 py-2 bg-white sticky bottom-0">
            <div className="flex justify-between items-center mb-3">
              <Text strong>Tổng số lượng:</Text>
              <Text>{totalQuantity}</Text>
            </div>
            {!showBookingTable ? (
              <Button
                type="primary"
                block
                onClick={() => {
                  onChooseTable(true);
                  setOpen(false);
                }}
                disabled={cartItems.length === 0}
              >
                Chọn bàn
              </Button>
            ) : (
              <Button
                type="primary"
                block
                onClick={() => handleChooseTable(false)}
                disabled={cartItems.length === 0}
              >
                Chọn thêm sản phẩm
              </Button>
            )}
          </div>
        )}

        {/* Toggle Button */}
        <button
          className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white border shadow-md w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100"
          onClick={() => setOpen(!open)}
        >
          {open ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
        </button>
      </div>

    </div>
  );
}
