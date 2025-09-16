"use client";
import bookTableApiRequest from "@/src/apiRequests/bookTable";
import { useAppContext } from "@/src/app/app-provider";
import { Card, DatePicker, Empty, Skeleton } from "antd";
import dayjs, { formatToUTC7 } from "@/src/lib/dayjs";
import { useEffect, useState } from "react";
import { useRentalStore } from "@/src/store/rentalStore";

const hours = Array.from({ length: 29 }, (_, i) => {
    return dayjs("07:00", "HH:mm").add(i * 30, "minute").format("HH:mm");
});
const slots = Array.from({ length: 29 }, (_, i) => i + 1);

export interface BookingProductData {
    ProductTemplateID: string;
    ProductTemplateName: string;
    from: number;
    to: number;
    item?: number;
}

export interface NewResponseModel {
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
}
interface ProductTemplateMap {
    [templateName: string]: {
        templateId: string;
        slots: { [slot: number]: SlotState };
    };
}
const MOCK_DATA = {
    data: [
        {
            "ProductTemplateID": "9640EE63-76E0-424C-B9BA-53A456A3DD2F",
            "ProductTemplateName": "CORTEX CHALLENGE 2 ENG",
            "from": 3,
            "to": 10,
            "item": 1
        },
        {
            "ProductTemplateID": "9640EE63-76E0-424C-B9BA-53A456A3DD2F",
            "ProductTemplateName": "CORTEX CHALLENGE 2 ENG",
            "from": 5,
            "to": 13,
            "item": 2
        },
        {
            "ProductTemplateID": "9640EE63-76E0-424C-B9BA-53A456A3DD2F",
            "ProductTemplateName": "CORTEX CHALLENGE 2 ENG",
            "from": 9,
            "to": 18
        },
        {
            "ProductTemplateID": "9640EE63-76E0-424C-B9BA-53A456A3DD2F",
            "ProductTemplateName": "CORTEX CHALLENGE 2 ENG",
            "from": 11,
            "to": 15,
            "item": 3
        },
        {
            "ProductTemplateID": "A5165A8B-714A-4F86-88BC-B6B41338CD45",
            "ProductTemplateName": "Tam Quoc Sat Quoc Chien",
            "from": 3,
            "to": 10,
            "item": 3
        },
        {
            "ProductTemplateID": "A5165A8B-714A-4F86-88BC-B6B41338CD45",
            "ProductTemplateName": "Tam Quoc Sat Quoc Chien",
            "from": 5,
            "to": 13,
            "item": 1
        },
        {
            "ProductTemplateID": "A5165A8B-714A-4F86-88BC-B6B41338CD45",
            "ProductTemplateName": "Tam Quoc Sat Quoc Chien",
            "from": 11,
            "to": 15,
            "item": 1
        }
    ],
    message: "Success",
    statusCode: 200,
    paging: null
};
export default function BookingProductTable({ bookDate }: PageProps) {
    const { user } = useAppContext();
    const [bookingData, setBookingData] = useState<ProductTemplateMap>({});
    const { cartItems, cartStore } = useRentalStore();
    const [selectedData, setSelectedData] = useState<{
        date: string, storeId: string, productIds: string[]
    } | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<{
        templateName: string;
        slot: number;
    } | null>(null);

    useEffect(() => {
        if (cartItems.length === 0) return;
        else {
            const productIds = cartItems.map((item) => item.productTemplateID);
            setSelectedData({
                date: bookDate ? formatToUTC7(dayjs(bookDate)) : formatToUTC7(dayjs()),
                storeId: cartStore?.storeId || "",
                productIds: productIds,
            });
        }
    }, [cartItems]);
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
            if (selectedData?.date) {
                const isToday = dayjs(selectedData.date).isSame(dayjs(), "day");
                const nowSlot =
                    Math.floor(
                        dayjs().diff(dayjs().startOf("day").hour(7), "minute") / 30
                    ) + 1;
                const isPast = dayjs(selectedData.date).isBefore(dayjs(), "day");
                const isBeforeNowSlot = isToday && slot < nowSlot + 2;

                if (isPast || isBeforeNowSlot) status = "locked";
            }
        }
        return { status, items };
    };

    const { data, isLoading: rentalLoading, isError: rentalError } = {
        data: MOCK_DATA,
        isLoading: false,
        isError: false,
    };

    useEffect(() => {
        if (!data?.data) return;

        const templateNames = Array.from(new Set(data.data.map((item) => item.ProductTemplateName)));
        const result: ProductTemplateMap = {};

        templateNames.forEach((name) => {
            const templateId = data.data.find((item) => item.ProductTemplateName === name)?.ProductTemplateID || "";
            result[name] = {
                templateId: templateId,
                slots: {},
            };
            slots.forEach((slot) => {
                result[name].slots[slot] = {
                    status: "available",
                    items: 0,
                };
            });
        });

        data.data.forEach((item) => {
            const templateName = item.ProductTemplateName;
            if (item.from != null && item.to != null) {
                for (let s = item.from; s <= item.to; s++) {
                    const bookedItems = item.item !== undefined ? item.item : 1;
                    if (result[templateName]?.slots[s]) {
                        result[templateName].slots[s].items += bookedItems;
                    }
                }
            }
        });
        setBookingData(result);
    }, [data]);

    function getTableBgColor(items: number) {
        if (items === 1) {
            return "bg-yellow-400";
        }
        if (items >= 2) {
            return "bg-red-400";
        }
        // items === 0
        return "bg-white";
    }

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
                {rentalLoading ? (
                    <Skeleton active paragraph={{ rows: 6 }} />
                // ) : rentalError ? (
                //     <Empty description="Không thể tải dữ liệu" />
                ) : (
                    <table className="min-w-max table-fixed border-collapse text-xs">
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

                        <tbody>
                            {Object.keys(bookingData).map((templateName, index) => (
                                <tr key={index} className="border-b">
                                    <td className="sticky left-0 bg-slate-50 border-r px-2 py-2 font-medium">
                                        {templateName}
                                    </td>
                                    {slots.map((slot) => {
                                        const slotState = getStatus(templateName, slot);
                                        const bgColor = getTableBgColor(slotState.items);
                                        return (
                                            <td
                                                key={slot}
                                                className={`h-8 min-w-[32px] border-r transition-all duration-150 relative
            ${slotState.status === 'locked' ? 'bg-gray-200' : bgColor}`}
                                                onMouseEnter={() => setHoveredSlot({ templateName, slot })}
                                                onMouseLeave={() => setHoveredSlot(null)}
                                            >
                                                {(hoveredSlot?.templateName === templateName && hoveredSlot?.slot === slot && slotState.items > 0) && (
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs p-1 rounded-sm min-w-[20px] text-center z-10">
                                                        {slotState.items}
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