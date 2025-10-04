'use client';

import React, { useMemo, useState } from 'react';
import { Typography, List, Button, notification, Tag, Empty, Card, Divider, Row, Col, Layout, Space, Descriptions, message } from 'antd';
import { TableViewModel, BookViewModel, BookItemViewModel } from './types'; // Giữ nguyên các types
import { DeleteOutlined, CheckCircleOutlined, ShoppingCartOutlined, DollarCircleOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons';
import CustomerSelector from './CustomerSelector';
import { Header, Footer } from 'antd/es/layout/layout';
import confirm from 'antd/es/modal/confirm';
import bookListApiRequest from '@/src/apiRequests/bookList';
import { HttpError } from '@/src/lib/httpAxios';
import { notifyError } from '@/src/components/Notification/Notification';
import { useAppContext } from '@/src/app/app-provider';

const { Title, Text } = Typography;

// --- Components phụ giữ nguyên ---
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
    table: TableViewModel | undefined;
    onOpenDrawer: () => void;
    onUpdateOrders: (tableId: string, newOrders: any[]) => void;
    onClearTable: (tableId: string) => void;
    onClose: () => void;
    viewMode?: boolean
}
interface Customer {
    id: string;
    name: string;
    phone: string;
}

export default function OrderDetailsPanel({ table, onUpdateOrders, onOpenDrawer, onClearTable, onClose, viewMode = false,  }: OrderDetailsPanelProps) {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const {user} = useAppContext();
    // ✅ Lấy BookViewModel từ BookInfo
    const currentBookViewModel: BookViewModel | undefined = useMemo(() => {
        // Sử dụng table?.BookInfo?.bookData để xác định đơn đã tồn tại
        return table?.BookInfo?.bookData;
    }, [table]);

    const currentBookList: BookItemViewModel | undefined = useMemo(() => {
        // Lấy BookList đầu tiên (giả định đơn giản)
        return currentBookViewModel?.book_lists ? currentBookViewModel.book_lists[0] : undefined;
    }, [currentBookViewModel]);

    // ✅ PHƯƠNG THỨC 1 & 2: Xác định chế độ hoạt động
    const isExistingOrder = !!table?.BookInfo?.deadline;
    // Nếu có deadline, tức là đơn đã được tạo và chỉ ở chế độ hiển thị

    // Nếu là đơn đã tồn tại, lấy sản phẩm từ BookList. Ngược lại, danh sách sản phẩm là rỗng cho đến khi thêm mới.
    const orders: any[] = currentBookList?.products || [];

    // Lấy tổng tiền, nếu không có đơn thì là 0
    const totalAmount = currentBookList?.total_price || 0;

    const handleRemoveItem = () => {
        // ✅ CHỈ CHO PHÉP CẬP NHẬT/XÓA SẢN PHẨM NẾU ĐƠN CHƯA TỒN TẠI
        if (isExistingOrder) {
            notification.warning({ message: "Không thể xóa sản phẩm khỏi đơn đã được tạo." });
            return;
        }

        if (table && orders.length > 0) {
            onUpdateOrders(table.TableId, []);
            notification.info({ message: `Đã xóa` });
        }
    };

    const handlePayment = () => {
        if (!table) return;

        // ✅ CHỈ THỰC HIỆN KHI Ở CHẾ ĐỘ TẠO/CẬP NHẬT ĐƠN MỚI HOẶC CHUYỂN TRẠNG THÁI
        // Giả định: Thanh toán sẽ gọi onClearTable (giải phóng bàn) sau khi thanh toán thành công qua API khác.
        // Nút Thanh toán chỉ khả dụng khi có orders và đang ở chế độ tạo đơn (chưa có BookViewModel) 
        // HOẶC khi đơn hàng đã tồn tại nhưng có thể thanh toán.
        if (isExistingOrder) {
            // Logic Thanh toán đơn đã tồn tại (Chuyển trạng thái PAID)
            // Cần thêm API call ở Home.tsx cho việc này.
            // Tạm thời dùng onClearTable để giả lập kết thúc
            onClearTable(table.TableId);
            notification.success({ message: `Đơn hàng Bàn ${table.TableName} đã được thanh toán.` });
        } else if (orders.length > 0) {
            // Logic Thanh toán đơn mới (Tạo đơn -> PAID)
            notification.info({ message: "Thực hiện tạo đơn và thanh toán..." });
            // Cần gọi API tạo đơn ở Home.tsx
        }
    };

    // Nút Chọn Thời Gian
    const OpenTimeDrawer = () => {
        if (isExistingOrder) {
            notification.warning({ message: "Đơn hàng đã tồn tại. Không thể chọn lại thời gian." });
            return;
        }
        onOpenDrawer();
        notification.info({ message: "Mở hộp thoại chọn thời gian cho đơn hàng mới..." });
    };
    const handleConfirmStart = (bookingId: string | undefined) => {
        if (!bookingId) {
            message.error("Id không tồn tại, dữ liệu không hợp lệ")
            return
        }

        confirm({
            title: "Xác nhận bắt đầu",
            content: "Bạn có chắc muốn bắt đầu đơn này không?",
            okText: "Bắt đầu",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    await bookListApiRequest.startBookList({ bookListId: bookingId },user?.token);
                    notification.success({ message: "Đã bắt đầu" });
                } catch (error) {
                    if (error instanceof HttpError) notifyError(error.message);
                }
            },
        });
    };

    const handleConfirmEnd = (bookingId: string | undefined) => {
        if (!bookingId) {
            message.error("Id không tồn tại, dữ liệu không hợp lệ")
            return
        }
        confirm({
            title: "Xác nhận kết thúc",
            content: "Bạn có chắc muốn kết thúc đơn này không?",
            okText: "Kết thúc",
            cancelText: "Hủy",
            onOk: async () => {
                // Gọi API kết thúc
                try {
                    await bookListApiRequest.endBookList({ bookListId: bookingId }, user?.token);
                    notification.success({ message: "Đã kết thúc" });
                } catch (error) {
                    if (error instanceof HttpError) notifyError(error.message);
                }
            },
        });
    };
    const STATUS_MAP: Record<string, { text: string; color: string }> = {
        EMPTY: { text: "Trống", color: "green" },
        OCCUPIED: { text: "Đang sử dụng", color: "blue" },
        RESERVED: { text: "Đã đặt", color: "orange" },
        ENDED: { text: "Đã kết thúc", color: "orange" },
        UNKNOWN: { text: "Không xác định", color: "default" },
    };
    const tableStatus = table?.TableStatus ?? 'UNKNOWN';

    // Xác định trạng thái nút dựa trên chế độ hoạt động
    const isPaymentDisabled = orders.length === 0 || (!isExistingOrder && orders.length === 0) || currentBookList?.status == 'CREATED';
    const isTimeSelectorDisabled = isExistingOrder;


    return (
        <Layout className='h-full'>
            {/* --- HEADER --- */}
            <Header
                style={{
                    position: 'sticky', top: 0, zIndex: 1, width: '100%',
                    display: 'flex', alignItems: 'center',
                }}
            >
                <div className='flex justify-between items-center w-full mx-4'>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 ${isExistingOrder ? 'bg-red-500' : 'bg-green-500'} rounded-full`}></div>
                            <Text strong className="text-blue-600 text-lg">
                                #{table?.TableName || 'Chưa chọn bàn'}
                            </Text>
                            <Tag color={isExistingOrder ? 'red' : 'green'}>
                                {isExistingOrder ? 'CHẾ ĐỘ HIỂN THỊ' : 'CHẾ ĐỘ TẠO'}
                            </Tag>
                        </div>
                        <div className='flex flex-row justify-end gap-3 w-2/4'>
                            <CustomerSelector
                                selectedCustomer={selectedCustomer}
                                onSelectCustomer={setSelectedCustomer}
                                onClearCustomer={() => setSelectedCustomer(null)}
                                layout="horizontal"
                                // Khách hàng chỉ có thể được chọn khi tạo đơn mới
                                disabled={isExistingOrder}
                            />
                            <Tag
                                color={STATUS_MAP[tableStatus]?.color || STATUS_MAP.UNKNOWN.color}
                                className="!px-4 !py-1 !rounded-md !text-sm"
                            >
                                {STATUS_MAP[tableStatus]?.text || STATUS_MAP.UNKNOWN.text}
                            </Tag>
                        </div>
                    </div>
                </div>
            </Header>
            {/* --- CONTENT --- */}
            {table ? (
                <>
                    <Row className='w-full' gutter={[16, 16]} style={{ padding: '0px 20px' }}>
                        <Col span={7} className='py-2'>
                            {/* Thông tin đặt bàn (BookTable) */}
                            <InfoCard title={`Thông tin đơn hàng`} icon={<ShoppingCartOutlined />}>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Trạng thái đơn">
                                        <Tag color={'blue'}>{currentBookViewModel?.status || 'Đang tạo...'}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Thời gian">
                                        <Text>{currentBookViewModel?.from_slot || '?'} - {currentBookViewModel?.to_slot || '?'} (Slot)</Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Tổng thời gian">
                                        <Text>{currentBookViewModel?.total_time || 0} phút</Text>
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
                            <Card title={
                                <span className='flex justify-between items-center'>
                                    <Text>Sản phẩm đã gọi ({orders.length}) </Text>
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveItem()}
                                        disabled={isPaymentDisabled}
                                    />
                                </span>
                            }>
                                {orders.length === 0 ? (
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có sản phẩm nào" />
                                ) : (
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={orders}
                                        renderItem={item => (
                                            <List.Item
                                                actions={[

                                                ]}
                                            >
                                                <List.Item.Meta
                                                    title={<Text>{item.product_name}</Text>}
                                                    description={<Text type="secondary">Giá: {item.rent_price_per_hour?.toLocaleString() || item.price?.toLocaleString()}₫/ giờ</Text>}
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
            )
            }
            {/* --- FOOTER (Nút hành động) --- */}
            <Footer hidden={viewMode}
                style={{
                    position: 'sticky', bottom: 0, zIndex: 1, alignItems: 'center',
                    padding: '10px 20px', background: 'white',
                }}>
                <div>
                    <Divider className='!mt-1 !mb-3' />
                    <div className="flex justify-between items-center">
                        <Title className='!p-0 !m-0' level={4}>Tổng thanh toán: {totalAmount.toLocaleString()}₫</Title>
                        <div className="flex gap-2">
                            {
                                (table?.BookInfo?.bookData.book_lists[0].book_id) &&
                                (<>
                                    {table?.BookInfo?.bookData.book_lists[0].status == "PAID" && (
                                        <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => handleConfirmStart(table?.BookInfo?.bookData.book_lists[0].book_id)}>
                                            Start
                                        </Button>
                                    )}
                                    {table?.BookInfo?.bookData.book_lists[0].status == "STARTED" && (
                                        <Button type="primary" icon={<StopOutlined />} onClick={() => handleConfirmEnd(table?.BookInfo?.bookData.book_lists[0].book_id)}>
                                            End
                                        </Button>
                                    )}
                                </>)
                            }



                            {/* Nút Chọn Thời Gian */}
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                size="large"
                                onClick={OpenTimeDrawer}
                            // ✅ CHỈ KÍCH HOẠT KHI ĐANG TẠO ĐƠN
                            // disabled={isTimeSelectorDisabled}
                            >
                                Chọn Thời Gian
                            </Button>
                            {/* Nút Thanh toán */}
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                size="large"
                                onClick={handlePayment}
                                disabled={isPaymentDisabled && !isExistingOrder}
                            >
                                {isExistingOrder ? 'Thanh toán' : 'Tạo & Thanh toán'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Footer>
        </Layout >
    );
}