'use client';

import React, { useState } from 'react';
import { Drawer, Typography, List, Button, notification, Tag, Empty, Card, Divider, Row, Col, Layout, Space, Descriptions } from 'antd';
import { Table, BookItem } from './types';
import { DeleteOutlined, CheckCircleOutlined, CloseOutlined, ShopOutlined, CalendarOutlined, ClockCircleOutlined, ShoppingCartOutlined, DollarCircleOutlined } from '@ant-design/icons';
import CustomerSelector from './CustomerSelector';
import { Header, Footer } from 'antd/es/layout/layout';

const { Title, Text } = Typography;
const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
};
const InfoCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <Card size="small" style={{ width: '100%' }}>
        <Space align="center" style={{ marginBottom: 12 }}>
            {icon}
            <Text strong>{title}</Text>
        </Space>
        {children}
    </Card>
);
interface OrderDetailsPanelProps {
    table: Table | undefined;
    onUpdateOrders: (tableId: string, newOrders: BookItem[]) => void;
    onClearTable: (tableId: string) => void;
    onClose: () => void;
}
interface Customer {
    id: string;
    name: string;
    phone: string;
}
export default function OrderDetailsPanel({ table, onUpdateOrders, onClearTable, onClose }: OrderDetailsPanelProps) {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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
    const OpenTimeDrawer = () => {
        if (table) {
            onClearTable(table.TableID);
            notification.success({ message: `Thanh toán thành công Bàn ${table.TableName}` });
        }
    };
    const orders = table?.books?.BookItem || [];
    const totalAmount = orders.reduce((sum, item) => sum + (item.rent_price_per_hour || 0), 0);

    const STATUS_MAP: Record<string, { text: string; color: string }> = {
        CREATED: { text: "Chưa thanh toán", color: "volcano" },
        PAID: { text: "Đã thanh toán", color: "green" },
        CANCELLED: { text: "Đã hủy", color: "red" },
        STARTED: { text: "Đang thuê", color: "blue" },
        ENDED: { text: "Kết thúc", color: "default" },
        OVERDUE: { text: "Quá hạn", color: "orange" },
        UNKNOWN: { text: "Chờ xác nhận", color: "default" },
    };

    return (
        <Layout className='h-full'>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className='flex justify-between items-center w-full mx-4'>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <Text strong className="text-blue-600 text-lg">
                                #{table?.TableName || 'Chưa chọn bàn'}
                            </Text>
                        </div>
                        <div className='flex flex-row justify-end gap-3 w-2/4'>
                            <CustomerSelector
                                selectedCustomer={selectedCustomer}
                                onSelectCustomer={setSelectedCustomer}
                                onClearCustomer={() => setSelectedCustomer(null)}
                                layout="horizontal"
                            />
                            <Tag
                                color={STATUS_MAP[table?.Status ?? 'UNKNOWN']?.color || STATUS_MAP.UNKNOWN.color}
                                className="!px-4 !py-1 !rounded-md !text-sm"
                            >
                                {STATUS_MAP[table?.Status ?? 'UNKNOWN']?.text || STATUS_MAP.UNKNOWN.text}
                            </Tag>
                        </div>
                    </div>

                </div>
            </Header>
            {table ? (
                <>
                    <Row className='w-full' gutter={[16, 16]} style={{ padding: '0px 20px' }}>
                        <Col span={7} className='py-2'>
                            <InfoCard title="Thông tin đơn" icon={<ShoppingCartOutlined />}>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Trạng thái">
                                        <Tag color={STATUS_MAP[table.Status]?.color || 'default'}>
                                            {STATUS_MAP[table.Status]?.text || 'Không xác định'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Thời gian">
                                        <Text>{table.books?.from_slot} - {table.books?.to_slot}</Text>
                                    </Descriptions.Item>
                                </Descriptions>
                            </InfoCard>
                            <InfoCard title="Tóm tắt thanh toán" icon={<DollarCircleOutlined />}>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Số món">{orders.length}</Descriptions.Item>
                                    <Descriptions.Item label="Tổng cộng">
                                        <Text strong style={{ fontSize: '1.2em', color: '#52c41a' }}>
                                            {totalAmount.toLocaleString()}₫
                                        </Text>
                                    </Descriptions.Item>
                                </Descriptions>
                            </InfoCard>
                        </Col>
                        <Col span={1}>
                            <Divider type="vertical" style={{ height: '100%' }} />
                        </Col>
                        <Col span={16}>
                            <Card title={`Sản phẩm đã gọi (${orders.length})`}>
                                {orders.length === 0 ? (
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có sản phẩm nào" />
                                ) : (
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={orders}
                                        renderItem={item => (
                                            <List.Item
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
                                                <List.Item.Meta
                                                    title={<Text>{item.product_name}</Text>}
                                                    description={<Text type="secondary">{item.rent_price_per_hour?.toLocaleString()}₫</Text>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                )}
                            </Card>
                        </Col>


                    </Row>

                </>
            ) : (
                <Empty description="Vui lòng chọn một bàn để bắt đầu" />
            )}
            <Footer
                style={{
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1,
                    alignItems: 'center',
                    padding: '10px 20px',
                    background: '',
                }}>
                <div>
                    <Divider className='!mt-1 !mb-3'/>
                    <div className="flex justify-between items-center">
                        <Title className='!p-0 !m-0' level={4}>Kết toán: {totalAmount.toLocaleString()}₫</Title>
                        <div className="flex gap-2">
                             <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                size="large"
                                onClick={handlePayment}
                                disabled={orders.length === 0}
                            >
                                Chọn Thời Gian
                            </Button>
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                size="large"
                                onClick={handlePayment}
                                disabled={orders.length === 0}
                            >
                                Thanh toán
                            </Button>
                            {/* <Button type="primary" onClick={() => notification.info({ message: 'Sử dụng nút "Danh sách sản phẩm" trên Header' })} block>
                                Thanh toán
                            </Button> */}
                            {/* <Button danger onClick={handlePayment} disabled={table.Status === 'empty'} block>
                            Thanh toán
                        </Button> */}
                        </div>
                    </div>

                </div>
            </Footer>
        </Layout>
    );
}