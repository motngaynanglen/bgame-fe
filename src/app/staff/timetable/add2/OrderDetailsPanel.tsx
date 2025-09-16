'use client';

import React from 'react';
import { Drawer, Typography, List, Button, notification, Tag, Empty, Card } from 'antd';
import { Table, BookItem } from './types';
import { DeleteOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface OrderDetailsPanelProps {
    table: Table | undefined;
    onUpdateOrders: (tableId: string, newOrders: BookItem[]) => void;
    onClearTable: (tableId: string) => void;
    onClose: () => void;
}

export default function OrderDetailsPanel({ table, onUpdateOrders, onClearTable, onClose }: OrderDetailsPanelProps) {

    const handleRemoveItem = (productId: string) => {
        if (table && table.books) {
            const newOrders = table.books.BookItem.filter(item => item.product_id !== productId);
            onUpdateOrders(table.TableID, newOrders);
            notification.info({ message: `Đã xóa một món` });
        }
    };

    const handlePayment = () => {
        if (table) {
            onClearTable(table.TableID);
            notification.success({ message: `Thanh toán thành công Bàn ${table.TableName}` });
        }
    };

    const orders = table?.books?.BookItem || [];
    const totalAmount = orders.reduce((sum, item) => sum + (item.price || 0), 0);

    return (
        <Card>
            {table ? (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <Text>
                            Trạng thái: **{table.Status === 'occupied' ? 'Đang chơi' : 'Trống'}**
                        </Text>
                    </div>

                    <Text strong>Danh sách sản phẩm</Text>
                    {orders.length === 0 ? (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có sản phẩm" style={{ margin: '20px 0' }} />
                    ) : (
                        <List
                            bordered
                            dataSource={orders}
                            renderItem={item => (
                                <List.Item
                                    key={item.product_id}
                                    actions={[
                                        <Button
                                            key={`remove-${item.product_id}`}
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveItem(item.product_id)}
                                        />
                                    ]}
                                >
                                    <List.Item.Meta title={item.product_name} description={`${item.price?.toLocaleString()}₫`} />
                                </List.Item>
                            )}
                        />
                    )}

                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <Title level={4}>Tổng cộng: {totalAmount.toLocaleString()}₫</Title>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <Button type="primary" onClick={() => notification.info({ message: 'Sử dụng nút "Danh sách sản phẩm" trên Header' })} block>
                            Thêm sản phẩm
                        </Button>
                        <Button danger onClick={handlePayment} disabled={table.Status === 'empty'} block>
                            Thanh toán
                        </Button>
                    </div>
                </>
            ) : (
                <Empty description="Vui lòng chọn một bàn để bắt đầu" />
            )}
        </Card>
    );
}