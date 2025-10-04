"use client";
import bookTableApiRequest from "@/src/apiRequests/bookTable";
import { useAppContext } from "@/src/app/app-provider";
import dayjs, { formatToUTC7 } from "@/src/lib/dayjs";
import { useRentalStore } from "@/src/store/rentalStore";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  DatePicker,
  Empty,
  message,
  Skeleton
} from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Legend from "./Legend";
import BookingPaymentModal from "./PaymentModal";

const hours = Array.from({ length: 29 }, (_, i) => {
  return dayjs("07:00", "HH:mm")
    .add(i * 30, "minute")
    .format("HH:mm");
});
const slots = Array.from({ length: 29 }, (_, i) => i + 1); // Slot 1 → 29
// Cơ bản có 28 slot tương ứng 7h tới 21h (14h). Số Slot = (số giờ)  x2 + 1
// Hiển thị nội dung thead lệch về bên trái nên phải; điễn giải slot 1 tương ứng 7h - 7h30 nên phải theo n+1
// Nếu để 28 slot thì thời gian cuối cùng sẽ không được hiển thị.

export type BookingStatus = "available" | "booked" | "locked" | "event";

export interface BookingCell {
  table: string;
  slot: number;
  status?: BookingStatus;
}
export interface BookingRequestBody {
  storeId: string;
  bookDate: string;
  fromSlot: number;
  toSlot: number;
  tableIDs: string[];
  bookListItems: {
    productTemplateID: string;
    quantity: number;
  }[];
}
interface TableData {
  tableId: string;
  tableName: string;
}
export interface BookingData {
  bookDate: string;
  fromSlot: number;
  toSlot: number;
  tables: TableData[];
}
interface PageProps {
  className?: string;
  storeId?: string;
  bookDate?: Date;
  staffmode?: boolean;
}

interface BookingList {
  TableID: string;
  TableName: string;
  Capacity: string;
  FromSlot: number;
  ToSlot: number;
  Owner: string;
}
interface responseModel {
  data: BookingList[];
  message: string;
  statusCode: number;
  paging: null;
}

export default function BookingTable({ storeId, bookDate, className, staffmode = false }: PageProps) {
  const { user, isAuthenticated } = useAppContext();

  const [bookingData, setBookingData] = useState<BookingCell[]>([]);
  const initialDate = bookDate ? dayjs(bookDate) : dayjs();
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const [selectedSlots, setSelectedSlots] = useState<BookingCell[]>([]);
  const [bookingModal, setBookingModal] = useState<{
    open: boolean;
    payload?: BookingRequestBody;
    bookingData?: BookingData;
  }>({ open: false });

  const { cartStore, cartItems, setBookingInfo } = useRentalStore();

  const getStatus = (table: string, slot: number): BookingStatus => {
    const found = bookingData.find((b) => b.table === table && b.slot === slot);
    if (found?.status) return found.status;
    if (slot < 1 || slot > 28) return "locked";
    if (selectedDate) {
      const isToday = selectedDate.isSame(dayjs(), "day");
      const nowSlot =
        Math.floor(
          dayjs().diff(dayjs().startOf("day").hour(7), "minute") / 30
        ) + 1;

      const isPast = selectedDate.isBefore(dayjs(), "day");
      const isBeforeNowSlot = isToday && slot < nowSlot + 2; //đặt trước 30 phuts tu khi choi

      if (isPast || isBeforeNowSlot) return "locked";
    }

    return "available";
  };
  const handleClickSlot = (
    table: string,
    slot: number,
    status: BookingStatus
  ) => {
    if (status !== "available") return;

    // Nếu đang chọn từ bàn khác → reset
    if (selectedSlots.length && selectedSlots[0].table !== table) {
      setSelectedSlots([{ table, slot }]);
      return;
    }
    // Nếu click lại chính slot đầu tiên → hủy chọn
    if (
      selectedSlots.length === 1 &&
      selectedSlots[0].table === table &&
      selectedSlots[0].slot === slot
    ) {
      setSelectedSlots([]);
      return;
    }
    // Nếu chưa chọn gì → chọn slot đầu tiên
    if (selectedSlots.length === 0) {
      setSelectedSlots([{ table, slot }]);
      return;
    }

    // Nếu chọn 2 slot → chọn hết khoảng
    const firstSlot = selectedSlots[0].slot;
    const start = Math.min(firstSlot, slot);
    const end = Math.max(firstSlot, slot);

    // Kiểm tra dải slot hợp lệ
    for (let s = start; s <= end; s++) {
      if (getStatus(table, s) !== "available") {
        message.warning("Một số slot trong khoảng đã bị đặt hoặc bị khóa.");
        return;
      }
    }

    const range = Array.from({ length: end - start + 1 }, (_, i) => ({
      table,
      slot: start + i,
    }));

    setSelectedSlots(range);
  };

  const handleConfirmBooking = () => {
    if (selectedSlots.length < 3) {
      message.warning("Vui lòng chọn ít nhất ba slot để đặt bàn.");
      return;
    }
    if (!selectedSlots.length) return;

    if (storeId === undefined) {
      message.error("Vui lòng chọn cửa hàng trước khi đặt bàn.");
      return;
    }
    if (!selectedDate) {
      message.error("Vui lòng chọn ngày đặt bàn.");
      return;
    }
    const tableName = selectedSlots[0].table;
    const tableData = data?.data?.find((t) => t.TableName === tableName);
    const tableID = tableData?.TableID;

    const fromSlot = selectedSlots[0].slot;
    const toSlot = selectedSlots[selectedSlots.length - 1].slot;

    const payload: BookingRequestBody = {
      storeId,
      bookDate: selectedDate?.format(),
      fromSlot,
      toSlot,
      tableIDs: tableID ? [tableID] : [],
      bookListItems: cartItems.map((item) => ({
        productTemplateID: item.productTemplateID,
        quantity: item.quantity,
      })),
    };
    setBookingModal({ open: true, payload });
    // mutation.mutate(payload);
  };

  const {
    data,
    isLoading: rentalLoading,
    isError: rentalError,
    error: rentalErrorData,
    isSuccess: rentalSuccess,
    refetch: rentalRefetch,
  } = useQuery<responseModel>({
    queryKey: ["rentalTimeTable", storeId, selectedDate?.format()],
    queryFn: async () => {
      const date = formatToUTC7(selectedDate);
      const res = await bookTableApiRequest.getBookTableTimeTableByDate(
        {
          storeId,
          bookDate: date,
        },
        user?.token
      );
      return res;
    },
    enabled: !!storeId,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!data?.data) return;

    const result: BookingCell[] = [];

    data.data.forEach((table) => {
      if (
        table.FromSlot != null &&
        table.ToSlot != null &&
        typeof table.TableName === "string"
      ) {
        for (let s = table.FromSlot; s <= table.ToSlot; s++) {
          result.push({
            table: table.TableName,
            slot: s,
            status: "booked",
          });
        }
      }
    });

    setBookingData(result);
  }, [data]);
  const convertPayloadToBookingData = (
    payload: BookingRequestBody
  ): BookingData | undefined => {
    if (!data?.data) return;

    return {
      bookDate: payload.bookDate,
      fromSlot: payload.fromSlot,
      toSlot: payload.toSlot,
      tables: payload.tableIDs.map((tableId) => ({
        tableId: tableId,
        tableName:
          data.data.find((t) => t.TableID === tableId)?.TableName || "", // Lấy tên bàn từ dữ liệu
      })),
    };
  };
  function setBookDate(date: dayjs.Dayjs) {
    if (date && storeId) {
      setSelectedDate(date);
      setBookingInfo(date.toDate(), bookingModal?.payload?.fromSlot ?? 0, bookingModal?.payload?.toSlot ?? 0);
    }
  }
  function getTableBgColor(status: string, isSelected: boolean, owner?: any) {
    if (status === "booked" && owner != null) {
      return "bg-yellow-400";
    }
    if (status === "booked") {
      return "bg-red-400 cursor-not-allowed";
    }
    if (status === "locked") {
      return "bg-gray-200 cursor-not-allowed";
    }
    if (isSelected) {
      return "bg-green-400";
    }
    return "bg-white hover:bg-green-100";
  }

  return (
    <Card
      className={clsx("w-full", className)}
      title="Đặt bàn"
      extra={
        <DatePicker
          value={selectedDate}
          onChange={(date) => setBookDate(date)}
          disabledDate={(current) => {
            const today = dayjs().startOf("day");
            const maxDate = today.add(2, "month").endOf("month");
            if (staffmode) {
              return current > maxDate;
            }
            return current < today || current > maxDate;
          }}
        />
      }
    >
      {/* Legend */}
      <Legend />

      {/* Table */}
      <div className="overflow-auto border rounded-md">
        {rentalLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : rentalError ? (
          <Empty description="Không thể tải dữ liệu" />
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
                    className="w-[48px] border-b border-gray-300 relative text-center  font-normal p-0"
                  >
                    <span className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2  whitespace-nowrap text-[16px]">
                      {hour}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[
                ...new Map(
                  data?.data?.map((item) => [item.TableName, item])
                ).values(),
              ].map((table: BookingList, index: number) => (
                <tr key={index} className="border-b">
                  <td className="sticky left-0 bg-slate-50 border-r px-2 py-2 font-medium">
                    {table.TableName}
                  </td>
                  {slots.map((slot) => {
                    const status = getStatus(table.TableName, slot);
                    const isSelected = selectedSlots.some(
                      (s) => s.table === table.TableName && s.slot === slot
                    );
                    const bgColor = getTableBgColor(
                      status,
                      isSelected,
                      table.Owner
                    );
                    return (
                      <td
                        key={slot}
                        onClick={() =>
                          handleClickSlot(table.TableName, slot, status)
                        }
                        className={`h-8 min-w-[32px] border-r cursor-pointer transition-all duration-150 ${bgColor}`}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Actions */}
      {selectedSlots.length > 0 && (
        <Card className="mt-4 border-blue-500 bg-blue-50" style={{padding: '5px'}}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-bold text-base">Thông tin đặt bàn</h4>
              <p>Bàn: <b>{selectedSlots[0].table}</b></p>
              <p>
                Thời gian: <b>{hours[selectedSlots[0].slot - 1]}</b> đến <b>{hours[selectedSlots[selectedSlots.length - 1].slot]}</b>
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setSelectedSlots([])}>Hủy chọn</Button>
              <Button type="primary" onClick={handleConfirmBooking}>
                Xác nhận
              </Button>
            </div>
          </div>
        </Card>
      )}
      {/* {selectedSlots.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm">
            ✅ Đã chọn: <b>{selectedSlots[0].table}</b> từ slot{" "}
            <b>{selectedSlots[0].slot}</b> đến slot{" "}
            <b>{selectedSlots[selectedSlots.length - 1].slot}</b>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setSelectedSlots([])}>Hủy chọn</Button>
            <Button type="primary" onClick={handleConfirmBooking}>
              Xác nhận đặt bàn
            </Button>
          </div>
        </div>
      )} */}

      {/* Debug */}
      {/* {data && (
        <Collapse
          className="mt-4"
          items={[
            {
              key: "1",
              label: "Debug Payload",
              children: (
                <pre className="text-xs">
                  {JSON.stringify(bookingModal.payload, null, 2)}
                </pre>
              ),
            },
          ]}
        />
      )} */}

      {/* Modal */}

      {(bookingModal.payload && !staffmode) && (
        <BookingPaymentModal
          open={bookingModal.open}
          onClose={() => setBookingModal({ open: false })}
          bookTables={convertPayloadToBookingData(bookingModal.payload)}
          bookingBody={bookingModal.payload}
        />
      )}
    </Card>
  );
}
