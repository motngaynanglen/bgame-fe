"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import bookTableApiRequest from "@/src/apiRequests/bookTable";
import productApiRequest from "@/src/apiRequests/product";
import storeApiRequest from "@/src/apiRequests/stores";
import { useAppContext } from "@/src/app/app-provider";
import CustomDatePicker from "@/src/components/DateRantalPicker/DateRental";
import CustomRangePicker from "@/src/components/DateRantalPicker/HourRental";
import {
    notifyError,
    notifySuccess,
} from "@/src/components/Notification/Notification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, DatePicker, Divider, Form, List, Modal, Radio, Space, Table, Tag, TimePicker, message } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useMemo, useState } from "react";
import StaffBookListSearch from "./StaffBookListSearch";
import BookingTable from "@/src/app/(overview)/rental/BookTimeTable";
import BookingSummary from "./BookingSummary";
import CustomerSelector from "./CustomerSelector";
import { ClockCircleOutlined, TableOutlined } from "@ant-design/icons";

dayjs.extend(customParseFormat);

export type BookingStatus = "available" | "booked" | "locked" | "event";

interface BoardGame {
    id: string;
    product_name: string;
    product_group_ref_id: string;
    productTemplateID: string;
    quantity: number;
    price: number;
    status: string;
    image: string;
    rent_price: number;
    rent_price_per_hour: number;
    publisher: string;
    category: string;
    code: string;
    player: string;
    time: string;
    age: number;
    complexity: number;
    product_type: string;
}

interface Customer {
    id: string;
    name: string;
    phone: string;
}

type Table = {
    TableID: string;
    TableName: string;
    Capacity: string;
    // FromSlot: number;
    // ToSlot: number;
    // Owner: string;
    Status: string;
};

export default function StaffBookingPage() {
    const { user } = useAppContext();
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [selectedTable, setSelectedTable] = useState<any | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [bookDate, setBookDate] = useState(dayjs());
    const [timeRange, setTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
        dayjs().hour(18).minute(0),
        dayjs().hour(20).minute(0),
    ]);

    // Lấy ID cửa hàng khi staff đăng nhập
    const { data: storeId, isLoading: storeLoading } = useQuery({
        queryKey: ["selectedStoreId"],
        queryFn: async () => {
            if (!user?.token) {
                throw new Error("User token is not available");
            }
            const res = await storeApiRequest.getStoreId(user.token);
            return res.data;
        },

        enabled: !!user?.token,
    });


    const { data: tables, isLoading: tablesLoading } = useQuery({
        queryKey: ['tables', storeId, bookDate.format('YYYY-MM-DD'), timeRange],
        queryFn: async () => await bookTableApiRequest.getStoreTableList(
            { storeId },
            user?.token
        ),
        enabled: !!storeId && !!bookDate && !!timeRange, // Chỉ chạy khi có đủ thông tin
    });

    // **API Mutation: Tạo đơn đặt chỗ**
    const mutation = useMutation({
        mutationFn: bookListApiRequest.createBookList,
        onSuccess: (data) => {
            message.success(data.message);
            // Reset form sau khi thành công
            setSelectedCustomer(null);
            setSelectedProducts([]);
            setSelectedTable(null);
        },
        onError: (error: any) => {
            message.error(error.message || "Tạo đơn thất bại!");
        }
    });

    const handleConfirmBooking = () => {
        const payload = {
            storeId,
            customerId: selectedCustomer?.id,
            tableId: selectedTable?.TableID,
            bookDate: bookDate.format('YYYY-MM-DD'),
            fromSlot: timeRange?.[0].format('HH:mm'),
            toSlot: timeRange?.[1].format('HH:mm'),
            items: selectedProducts.map(p => ({ productId: p.id, quantity: 1 })),
        };
        mutation.mutate(payload);
    };

    // Tính toán chi phí và kiểm tra điều kiện đặt bàn
    const totalCost = useMemo(() => {
        return selectedProducts.reduce((acc, p) => acc + (p.rent_price || 0), 0);
    }, [selectedProducts]);

    const isReadyToBook = selectedTable && timeRange && selectedProducts.length > 0 && selectedCustomer;

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Tạo Đơn Đặt Chỗ</h1>
            
            <BookingTable storeId={storeId} staffmode={true} className="my-3"/>
            <div className="flex flex-col lg:flex-row gap-6">

                {/* === CỘT TRÁI - THAO TÁC CHÍNH === */}
                <div className="lg:w-2/3 flex flex-col gap-6">
                    <Card title="Theo dõi bàn thời gian thực">
                        <div className="flex gap-4 mb-4">
                            <DatePicker value={bookDate} onChange={(date) => setBookDate(date || dayjs())} style={{ width: '150px' }} />
                            {/* <TimePicker.RangePicker value={timeRange} onChange={(times) => setTimeRange(times as any)} format="HH:mm" minuteStep={30} /> */}
                        </div>
                        <Divider>Sơ đồ bàn</Divider>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {tablesLoading ? (
                                <div className="col-span-4 flex justify-center items-center py-6">
                                    <p className="text-gray-500 animate-pulse">Đang tải sơ đồ bàn...</p>
                                </div>
                            ) : (
                                tables?.data.map((table: Table) => {
                                    const isSelected = selectedTable?.TableID === table.TableID;
                                    const statusClasses: Record<string, string> = {
                                        ACTIVE: "bg-green-100 border-green-300 hover:bg-green-200 cursor-pointer",
                                        BOOKED: "bg-yellow-100 border-yellow-300 cursor-not-allowed",
                                        OCCUPIED: "bg-red-100 border-red-300 cursor-not-allowed",
                                    };

                                    const baseClass =
                                        "p-4 text-center rounded-lg border-2 transition-all select-none";

                                    return (
                                        <div
                                            key={table.TableID}
                                            onClick={() =>
                                                table.Status === "ACTIVE" && setSelectedTable(table)
                                            }
                                            className={`${baseClass} ${statusClasses[table.Status] ?? ""} ${isSelected ? "!border-blue-500 !bg-blue-100" : ""
                                                }`}
                                        >
                                            <p className="font-bold">{table.TableName}</p>
                                            <p className="text-sm capitalize">{table.Status}</p>
                                            <p className="text-xs text-gray-500">{table.Capacity} chỗ</p>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                    </Card>

                    <Card title="Bước 2: Chọn Sản Phẩm (Board Game)">
                        {/* Đây là nơi bạn đặt component tìm kiếm và thêm sản phẩm */}
                        <StaffBookListSearch onAddProduct={(p) => setSelectedProducts(prev => [...prev, p])} />
                        <Button onClick={() => setSelectedProducts(prev => [...prev, { id: `prod_${Date.now()}`, product_name: 'Sản phẩm mẫu', rent_price: 50000 }])}>
                            Thêm sản phẩm (Test)
                        </Button>
                    </Card>
                </div>

                {/* === CỘT PHẢI - TÓM TẮT ĐƠN HÀNG === */}
                <div className="lg:w-1/3">
                    <div className="sticky top-4">
                        <Card title="Tóm Tắt Đơn Hàng">
                            <CustomerSelector
                                selectedCustomer={selectedCustomer}
                                onSelectCustomer={setSelectedCustomer}
                                onClearCustomer={() => setSelectedCustomer(null)}
                            />

                            <Divider />

                            <div className="space-y-2 mb-4">
                                {timeRange && <p><ClockCircleOutlined className="mr-2" />{bookDate.format('DD/MM/YYYY')}, {timeRange[0].format('HH:mm')} - {timeRange[1].format('HH:mm')}</p>}
                                {selectedTable ?
                                    <p><TableOutlined className="mr-2" />Bàn đã chọn: <Tag color="blue">{selectedTable.TableName}</Tag></p>
                                    : <p className="text-gray-400"><TableOutlined className="mr-2" />Vui lòng chọn bàn còn trống</p>
                                }
                            </div>

                            <Divider>Sản phẩm</Divider>

                            <List
                                dataSource={selectedProducts}
                                renderItem={(item: any, index) => (
                                    <List.Item
                                        actions={[<Button key={`remove-${item.product_id}`} type="text" danger size="small" onClick={() => setSelectedProducts(prev => prev.filter((_, i) => i !== index))}>Xóa</Button>]}
                                    >
                                        <List.Item.Meta title={item.product_name} />
                                        <div>{item.rent_price.toLocaleString()}đ</div>
                                    </List.Item>
                                )}
                                locale={{ emptyText: 'Chưa có sản phẩm nào.' }}
                            />

                            <Divider />

                            <div className="text-right mb-4">
                                <span className="text-gray-600">Tổng cộng: </span>
                                <span className="text-xl font-bold">{totalCost.toLocaleString()}đ</span>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                disabled={!isReadyToBook}
                                loading={mutation.isPending}
                                onClick={handleConfirmBooking}
                            >
                                Xác Nhận Đặt Chỗ
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

