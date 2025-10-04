"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, DatePicker, Empty, message, Skeleton, Button, Typography } from "antd";
import dayjs from "@/src/lib/dayjs";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Legend from "./Legend"; // Giữ lại component Legend nếu cần
import bookTableApiRequest from "@/src/apiRequests/bookTable"; // Giả sử API request vẫn dùng
import { BookingRequestBody, TableViewModel } from "./types";
import { BookingData } from "@/src/app/(overview)/rental/types";
import BookingPaymentModal from "./PaymentModal";

const { Text } = Typography;

// --- CÁC HẰNG SỐ VÀ KIỂU DỮ LIỆU ---

const hours = Array.from({ length: 29 }, (_, i) => {
    return dayjs("07:00", "HH:mm").add(i * 30, "minute").format("HH:mm");
});
const slots = Array.from({ length: 29 }, (_, i) => i + 1);

type SlotStatus = "available" | "booked" | "locked" | "selected";

// Kiểu dữ liệu trả về cho component cha
export interface SelectedTime {
    tableId: string;
    tableName: string;
    bookDate: string;
    fromSlot: number;
    toSlot: number;
}

// Dữ liệu từ API (giữ nguyên để tương thích)
interface BookingListFromAPI {
    TableID: string;
    TableName: string;
    FromSlot: number;
    ToSlot: number;
}
interface ApiResponse {
    data: BookingListFromAPI[];
}

// Props của component mới
interface TableTimeSelectorProps {
    className?: string;
    storeId: string;
    tableData: TableViewModel | undefined;

    onSelectionChange: (selection: SelectedTime | null) => void;
}

// --- COMPONENT CHÍNH ---

export default function TableTimeSelector({
    storeId,
    tableData,
    className,
    onSelectionChange,
}: TableTimeSelectorProps) {

    // --- STATE ---
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [bookedSlots, setBookedSlots] = useState<number[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
    const [bookingModal, setBookingModal] = useState<{
        open: boolean;
        payload?: BookingRequestBody;
        bookingData?: BookingData;
    }>({ open: false });
    // --- API QUERY ---
    const { data, isLoading, isError } = useQuery<ApiResponse>({
        queryKey: ["tableTimeData", storeId, selectedDate.format("YYYY-MM-DD")],
        queryFn: async () => {
            return await bookTableApiRequest.getBookTableTimeTableByDate({
                storeId,
                bookDate: selectedDate.format(), // Gửi ngày đã chọn
            });
        },
        enabled: !!storeId,
        staleTime: 60_000, // Cache dữ liệu trong 1 phút
    });

    // --- EFFECTS ---
    // Xử lý dữ liệu từ API để lấy ra các slot đã được đặt cho bàn này
    useEffect(() => {
        if (data?.data) {
            const slotsForThisTable = data.data
                .filter(booking => booking.TableID === tableData?.TableId)
                .flatMap(booking => {
                    const range = [];
                    for (let s = booking.FromSlot; s <= booking.ToSlot; s++) {
                        range.push(s);
                    }
                    return range;
                });
            setBookedSlots(slotsForThisTable);
        }
    }, [data, tableData]);

    // Reset lựa chọn khi ngày hoặc bàn thay đổi
    useEffect(() => {
        setSelectedSlots([]);
    }, [selectedDate, tableData]);


    // --- LOGIC HÀM ---
    const getStatus = (slot: number): SlotStatus => {
        if (selectedSlots.includes(slot)) return "selected";
        if (bookedSlots.includes(slot)) return "booked";

        // Logic khóa slot trong quá khứ
        const isToday = selectedDate.isSame(dayjs(), "day");
        const nowSlot = Math.floor(dayjs().diff(dayjs().startOf("day").hour(7), "minute") / 30) + 1;
        const isPastDate = selectedDate.isBefore(dayjs(), "day");
        const isPastSlot = isToday && slot < nowSlot + 2; // Đặt trước 1 giờ

        if (isPastDate || isPastSlot) return "locked";

        return "available";
    };

    const handleClickSlot = (slot: number) => {
        const status = getStatus(slot);
        if (status !== 'available') {
            if (status === 'selected' && selectedSlots.length === 1 && selectedSlots[0] === slot) {
                setSelectedSlots([]); // Hủy chọn nếu click lại slot duy nhất đã chọn
            }
            return;
        }

        if (selectedSlots.length === 0) {
            setSelectedSlots([slot]);
            return;
        }

        const firstSlot = selectedSlots[0];
        const start = Math.min(firstSlot, slot);
        const end = Math.max(firstSlot, slot);

        // Kiểm tra xem có slot nào đã bị đặt trong khoảng đã chọn không
        for (let s = start; s <= end; s++) {
            if (bookedSlots.includes(s)) {
                message.warning("Khoảng thời gian bạn chọn chứa các giờ đã được đặt trước.");
                return;
            }
        }

        const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        setSelectedSlots(range);
    };

    const handleConfirm = () => {
        if (selectedSlots.length === 0) return;
        const tableId = tableData?.TableId ?? "";
        const tableName = tableData?.TableName ?? "";

        const fromSlot = Math.min(...selectedSlots);
        const toSlot = Math.max(...selectedSlots);

        const selection: SelectedTime = {
            tableId,
            tableName,
            bookDate: selectedDate.format(),
            fromSlot,
            toSlot,
        };
        onSelectionChange(selection); // Trả dữ liệu về cho component cha
        message.success(`Đã chọn thời gian cho bàn ${tableName}`);
    };

    const handleCancel = () => {
        setSelectedSlots([]);
        // onSelectionChange(null); // Báo cho component cha là đã hủy chọn
    };
    const handleConfirmBooking = () => {

        const tableID = tableData?.TableId;
        const tableName = tableData?.TableName;
        const rawData = tableData?.BookInfo?.bookData
        if (!rawData) {
            message.error("Hãy chọn ngày đặt bàn.");
            return;
        }
        const fromSlot = rawData?.from_slot;
        const toSlot = rawData?.to_slot;

        const payload: BookingRequestBody = {
            storeId,
            bookDate: selectedDate?.format(),
            fromSlot,
            toSlot,
            tableIDs: tableID ? [tableID] : [],
            bookListItems: rawData?.book_lists[0].products.map((item) => ({
                productID: item.product_id,
            })),
        };
        setBookingModal({ open: true, payload });
        // mutation.mutate(payload);
    };
   
    // --- RENDER ---
    const getCellBgColor = (status: SlotStatus) => {
        switch (status) {
            case "selected": return "bg-green-400";
            case "booked": return "bg-red-400 cursor-not-allowed";
            case "locked": return "bg-gray-200 cursor-not-allowed";
            default: return "bg-white hover:bg-green-100";
        }
    };
    if (!tableData) {
        return;
    }
    return (
        <Card
            className={clsx("w-full", className)}
            title={`Chọn thời gian cho Bàn ${tableData.TableName}`}
            extra={
                <DatePicker
                    value={selectedDate}
                    onChange={(date) => date && setSelectedDate(date)}
                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                />
            }
        >
            <Legend />
            <div className="overflow-auto border rounded-md mt-4">
                {isLoading ? (
                    <Skeleton active paragraph={{ rows: 2 }} />
                ) : isError ? (
                    <Empty description="Không thể tải dữ liệu lịch đặt" />
                ) : (
                    <table className="min-w-max table-fixed border-collapse text-xs">
                        <thead>
                            <tr className="bg-cyan-200">
                                <th className="w-[72px] sticky left-0 bg-cyan-200 z-10 h-8" ></th>
                                {hours.map(hour => (
                                    <th key={hour} className="w-[48px] border-b border-gray-300 relative text-center font-normal p-0">
                                        <span className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[16px]">
                                            {hour}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="sticky left-0 bg-slate-50 border-r px-2 py-2 font-medium z-10">
                                    {tableData.TableName}
                                </td>
                                {slots.map((slot) => {
                                    const status = getStatus(slot);
                                    return (
                                        <td
                                            key={slot}
                                            onClick={() => handleClickSlot(slot)}
                                            className={clsx(
                                                "h-8 min-w-[32px] border-r cursor-pointer transition-all duration-150",
                                                getCellBgColor(status)
                                            )}
                                        />
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>

            {selectedSlots.length > 0 && (
                <Card className="mt-4 border-blue-500 bg-blue-50" size="small">
                    <div className="flex items-center justify-between">
                        <div>
                            <Text strong>Đã chọn:</Text>
                            <Text> Bàn <b>{tableData.TableName}</b> </Text>
                            <Text>
                                từ <b>{hours[Math.min(...selectedSlots) - 1]}</b> đến <b>{hours[Math.max(...selectedSlots)]}</b>
                            </Text>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleCancel}>Hủy chọn</Button>
                            <Button type="primary" onClick={handleConfirm}>Xác nhận</Button>
                        </div>
                    </div>
                </Card>
            )}
            {(tableData?.BookInfo?.bookData.book_lists[0].products) && (
                <>
                    <Card className="mt-4" size="small">
                        <div className="flex items-center justify-end">
                            <Button danger onClick={handleConfirmBooking}>Thanh toán</Button>
                        </div>
                    </Card>

                    {(bookingModal.payload) && (
                        <BookingPaymentModal
                            open={bookingModal.open}
                            onClose={() => setBookingModal({ open: false })}
                            products={tableData?.BookInfo?.bookData.book_lists[0].products}
                            bookingBody={bookingModal.payload}
                        />
                    )}
                </>
            )}


        </Card>
    );
}