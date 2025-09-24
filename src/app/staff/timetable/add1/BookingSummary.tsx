// src/components/BookingSummary/BookingSummary.tsx
import { Card, Button, List, Tag, Divider } from "antd";
import { ClockCircleOutlined, UserOutlined, TableOutlined } from "@ant-design/icons";

interface BookingSummaryProps {
    selectedCustomer: any; // Thay bằng type Customer
    selectedTable: any; // Thay bằng type Table
    selectedProducts: any[]; // Thay bằng type Product[]
    bookingTime: { start: string, end: string };
    totalCost: number;
    onConfirm: () => void;
}

const BookingSummary = ({
    selectedCustomer,
    selectedTable,
    selectedProducts,
    bookingTime,
    totalCost,
    onConfirm,
}: BookingSummaryProps) => {
    const isReadyToBook = selectedTable && bookingTime.start && selectedProducts.length > 0;

    return (
        <Card title="Tóm tắt đơn thuê" className="sticky top-4">
            {selectedCustomer && (
                <p><UserOutlined /> <strong>Khách hàng:</strong> {selectedCustomer.name}</p>
            )}

            {bookingTime.start && (
                <p><ClockCircleOutlined /> <strong>Thời gian:</strong> {bookingTime.start} - {bookingTime.end}</p>
            )}

            {selectedTable && (
                 <p><TableOutlined /> <strong>Bàn:</strong> <Tag color="blue">{selectedTable.TableName}</Tag></p>
            )}

            <Divider />

            <h4 className="font-semibold mb-2">Sản phẩm đã chọn:</h4>
            {selectedProducts.length > 0 ? (
                 <List
                    dataSource={selectedProducts}
                    renderItem={(item: any) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.product_name}
                                description={`Giá thuê: ${item.rent_price.toLocaleString()}đ`}
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <p className="text-gray-500">Chưa chọn sản phẩm nào.</p>
            )}


            <Divider />

            <div className="text-right">
                <p className="text-lg font-bold">Tổng cộng: {totalCost.toLocaleString()}đ</p>
            </div>

            <Button
                type="primary"
                size="large"
                block
                className="mt-4"
                onClick={onConfirm}
                disabled={!isReadyToBook}
            >
                Xác nhận đặt chỗ
            </Button>
        </Card>
    );
}

export default BookingSummary;