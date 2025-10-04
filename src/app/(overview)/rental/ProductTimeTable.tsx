"use client";
import bookTableApiRequest from "@/src/apiRequests/bookTable";
import { useAppContext } from "@/src/app/app-provider";
import { Card, DatePicker, Empty, Skeleton } from "antd";
import dayjs, { formatToUTC7 } from "@/src/lib/dayjs";
import { useEffect, useState } from "react";
import { useRentalStore } from "@/src/store/rentalStore";
import { useQuery } from "@tanstack/react-query";
import bookListApiRequest from "@/src/apiRequests/bookList";

const hours = Array.from({ length: 29 }, (_, i) => {
    return dayjs("07:00", "HH:mm").add(i * 30, "minute").format("HH:mm");
});
const slots = Array.from({ length: 29 }, (_, i) => i + 1);

export interface BookingProductData {
    ProductTemplateID: string;
    ProductTemplateName: string;
    From: number;
    To: number;
    Items?: number;
    OnStock: number;
}

interface ResponseModel {
    data: BookingProductData[];
    message: string;
    statusCode: number;
    paging: null;
}

interface PageProps {
    storeId?: string;
    bookDate?: Date;
}
interface SlotState {
    status: "available" | "locked";
    items: number;
    onStock?: number; // Số lượng tồn kho của sản phẩm

}
interface ProductTemplateMap {
    [templateName: string]: {
        templateId: string;
        image?: string;
        slots: { [slot: number]: SlotState };
    };
}

export default function BookingProductTable({ storeId, bookDate }: PageProps) {
    const { user } = useAppContext();
    const [bookingData, setBookingData] = useState<ProductTemplateMap>({});
    const { cartItems, cartStore, bookingInfo } = useRentalStore();
    const [selectedData, setSelectedData] = useState<{
        BookDate: string, StoreId: string, ProductTemplateIds: string[]
    } | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<{
        templateName: string;
        slot: number;
    } | null>(null);


    const getStatus = (templateName: string, slot: number): SlotState => {
        const template = bookingData[templateName];
        const slotInfo = template?.slots[slot];
        let status: "available" | "locked" = "available";
        let items = 0;

        if (slotInfo) {
            status = slotInfo.status;
            items = slotInfo.items;
        } else {
            if (slot < 1 || slot > 28) status = "locked";
            if (selectedData?.BookDate) {
                const isToday = dayjs(selectedData.BookDate).isSame(dayjs(), "day");
                const nowSlot =
                    Math.floor(
                        dayjs().diff(dayjs().startOf("day").hour(7), "minute") / 30
                    ) + 1;
                const isPast = dayjs(selectedData.BookDate).isBefore(dayjs(), "day");
                const isBeforeNowSlot = isToday && slot < nowSlot + 2;

                if (isPast || isBeforeNowSlot) status = "locked";
            }
        }
        return { status, items };
    };

    const { data, isLoading: rentalLoading, isError: rentalError } = useQuery<ResponseModel>({
        queryKey: ["productTimeTable", storeId, bookDate],
        queryFn: async () => {
            const res = await bookListApiRequest.getBookListTimeTableByDate(
                selectedData,
                user?.token
            );
            return res;
        },
        enabled: !!storeId,
    });
    useEffect(() => {
        if (cartItems.length === 0) return;
        else {
            const productIds = cartItems.map((item) => item.productTemplateID);
            const date = bookingInfo?.bookDate ? formatToUTC7(bookingInfo.bookDate) : formatToUTC7(new Date());
            setSelectedData({
                BookDate: date,
                StoreId: cartStore?.storeId || "",
                ProductTemplateIds: productIds,
            });
        }
    }, [cartItems, cartStore, bookingInfo]);
    useEffect(() => {
        if (!data?.data) {
            // Nếu giỏ hàng rỗng thì xóa bảng
            if (cartItems.length === 0) {
                setBookingData({});
            }
            return;
        };

        // Bước 1: Khởi tạo dữ liệu từ `cartItems` làm nguồn chính.
        // Điều này đảm bảo mọi sản phẩm trong giỏ hàng sẽ luôn được hiển thị.
        const newBookingData = cartItems.reduce<ProductTemplateMap>((acc, cartItem) => {
            const templateName = cartItem.product_name;

            if (!acc[templateName]) {
                acc[templateName] = {
                    templateId: cartItem.productTemplateID,
                    image: cartItem.image,
                    slots: {},
                };

                // Tìm thông tin `onStock` tương ứng từ `data.data` (nếu có).
                const apiDataItem = data?.data?.find(d => d.ProductTemplateID === cartItem.productTemplateID);
                const onStock = apiDataItem ? apiDataItem.OnStock : 0; // Mặc định là 0 nếu không tìm thấy trong API response.

                // Khởi tạo tất cả các slot với trạng thái mặc định (items = 0).
                for (const slot of slots) {
                    acc[templateName].slots[slot] = {
                        status: "available",
                        items: 0,
                        onStock: onStock,
                    };
                }
            }
            return acc;
        }, {});
       
         // Bước 2: Cập nhật dữ liệu đặt chỗ thực tế từ API response (`data.data`).
        // Chỉ chạy nếu `data.data` tồn tại.
        if (data?.data) {
            data.data.forEach(item => {
                const templateName = item.ProductTemplateName;

                // Chỉ cập nhật nếu có thông tin đặt hàng (From, To, Items không null).
                if (item.From != null && item.To != null && item.Items != null) {
                    for (let s = item.From; s <= item.To; s++) {
                        // Kiểm tra an toàn trước khi gán để tránh lỗi.
                        if (newBookingData[templateName]?.slots[s]) {
                            newBookingData[templateName].slots[s].items = item.Items;
                        }
                    }
                }
            });
        }
        
        setBookingData(newBookingData);
    }, [data, cartItems]);

    function getTableBgColor(items: number, onStock?: number) {
        if (items === 1) {
            return "bg-yellow-400";
        }
        if (onStock !== undefined && items >= onStock) {
            return "bg-red-400";
        }
        // items === 0
        return "bg-white";
    }
    const shouldShowSkeleton = rentalLoading && Object.keys(bookingData).length === 0;
    const shouldShowEmpty = (rentalError || (!rentalLoading && Object.keys(bookingData).length === 0 && cartItems.length > 0));
    const shouldShowTable = !shouldShowSkeleton && !shouldShowEmpty && Object.keys(bookingData).length > 0;

    return (
        <Card
            className="w-11/12"
            title="Mô hình sản phẩm"

        >
            {/* Legend */}
            <div className="flex gap-4 flex-wrap mb-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border rounded bg-white" /> Trống
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded" /> Đã đặt (1 sản phẩm)
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-400 rounded" /> Đã đặt (trên 2 sản phẩm)
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded" /> Khoá
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto border rounded-md">
                {shouldShowSkeleton && <Skeleton active paragraph={{ rows: cartItems.length || 3 }} />}

                {shouldShowEmpty && <Empty description={rentalError ? "Không thể tải dữ liệu" : "Các sản phẩm trong giỏ hàng của bạn không trùng lịch"} />}

                {shouldShowTable && (
                    <table className="min-w-max table-fixed border-collapse text-xs">
                        {/* Table Head */}
                        <thead>
                            <tr className="bg-cyan-200">
                                <th className="w-[72px] border-b border-gray-300 px-2 py-1 text-left h-8">
                                    <span></span>
                                </th>
                                {hours.map((hour) => (
                                    <th
                                        key={hour}
                                        className="w-[48px] border-b border-gray-300 relative text-center font-normal p-0"
                                    >
                                        <span className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[16px]">
                                            {hour}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {Object.keys(bookingData).map((templateName, index) => (
                                <tr key={index} className="border-b">
                                    <td className="sticky left-0 bg-slate-50 border-r px-2 py-2 font-medium">
                                        {templateName}
                                    </td>
                                    {slots.map((slot) => {
                                        const slotState = getStatus(templateName, slot);
                                        const bgColor = getTableBgColor(slotState.items, slotState.onStock);
                                        return (
                                            <td
                                                key={slot}
                                                className={`h-8 min-w-[32px] border-r transition-all duration-150 relative
                                                ${slotState.status === 'locked' ? 'bg-gray-300 cursor-not-allowed' : bgColor}`}
                                                onMouseEnter={() => setHoveredSlot({ templateName, slot })}
                                                onMouseLeave={() => setHoveredSlot(null)}
                                            >
                                                {(hoveredSlot?.templateName === templateName && hoveredSlot?.slot === slot && slotState.items > 0) && (
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs p-1 rounded-sm min-w-[20px] text-center z-10">
                                                        {`${slotState.items}/${slotState.onStock}`}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
}