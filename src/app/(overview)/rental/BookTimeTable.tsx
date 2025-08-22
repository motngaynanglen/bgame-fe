"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import bookTableApiRequest from "@/src/apiRequests/bookTable";
import { useAppContext } from "@/src/app/app-provider";
import { useRentalStore } from "@/src/store/rentalStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Collapse, DatePicker, Empty, message, Skeleton } from "antd";
import dayjs, { formatToUTC7 } from "@/src/lib/dayjs";
import { useEffect, useState } from "react";
import BookingPaymentModal from "./PaymentModal";


const hours = Array.from({ length: 29 }, (_, i) => {
  return dayjs("07:00", "HH:mm").add(i * 30, "minute").format("HH:mm");
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

  storeId?: string;
  bookDate?: Date;

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

export default function BookingTable({ storeId, bookDate }: PageProps) {
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

  const { cartStore, cartItems } = useRentalStore();

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
      const isBeforeNowSlot = isToday && slot < nowSlot;

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
  const convertPayloadToBookingData = (payload: BookingRequestBody): BookingData | undefined => {
    if (!data?.data) return;

    return {
      bookDate: payload.bookDate,
      fromSlot: payload.fromSlot,
      toSlot: payload.toSlot,
      tables: payload.tableIDs.map((tableId) => ({
        tableId: tableId,
        tableName: data.data.find((t) => t.TableID === tableId)?.TableName || "", // Lấy tên bàn từ dữ liệu
      })),
    };
  };
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
      title="Đặt bàn"
      extra={
        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date!)}
          disabledDate={(current) => {
            const today = dayjs().startOf("day");
            const maxDate = today.add(2, "month").endOf("month");
            return current < today || current > maxDate;
          }}
        />
      }
    >
      {/* Legend */}
      <div className="flex gap-4 flex-wrap mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border rounded bg-white" /> Trống
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-400 rounded" /> Đã đặt
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded" /> Bạn đã đặt
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded" /> Khoá
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-400 rounded" /> Sự kiện
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 rounded" /> Bạn đang chọn
        </div>
      </div>

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
              {[...new Map(data?.data?.map((item) => [item.TableName, item])).values()].map(
                (table: BookingList, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="sticky left-0 bg-slate-50 border-r px-2 py-2 font-medium">
                      {table.TableName}
                    </td>
                    {slots.map((slot) => {
                      const status = getStatus(table.TableName, slot);
                      const isSelected = selectedSlots.some(
                        (s) => s.table === table.TableName && s.slot === slot
                      );
                      const bgColor = getTableBgColor(status, isSelected, table.Owner);
                      return (
                        <td
                          key={slot}
                          onClick={() => handleClickSlot(table.TableName, slot, status)}
                          className={`h-8 min-w-[32px] border-r cursor-pointer transition-all duration-150 ${bgColor}`}
                        />
                      );
                    })}
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Actions */}
      {selectedSlots.length > 0 && (
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
      )}

      {/* Debug */}
      {data && (
        <Collapse className="mt-4" items={[{
          key: "1", label: "Debug Payload", children: (
            <pre className="text-xs">{JSON.stringify(bookingModal.payload, null, 2)}</pre>
          )
        }]} />
      )}

      {/* <div className="grid grid-cols-4 gap-4">
        {[
          ...new Map(
            data?.data?.map((item) => [item.TableName, item])
          ).values(),
        ].map((cell, index) => (
          <div key={index}>
            <div
              key={index}
              className={`p-4 rounded cursor-pointer text-center `}
            >
              <div
                key={cell.TableID}
                className="col-span-1 flex flex-col items-center"
              >
                // Thanh trên 
                <div className="w-10 h-3 rounded-md bg-[#e6ebed] mb-1"></div>

                // Dòng chứa thanh trái, ô giữa và thanh phải 
                <div className="flex items-center">
                  // Thanh trái
                  <div className="w-3 h-10 rounded-md bg-[#e6ebed] mr-1"></div>

                  // Ô vuông chính giữa
                  <div className="w-14 h-14 rounded-md bg-[#e6ebed] flex justify-center items-center text-gray-500 text-sm font-sans">
                    {cell.TableName}
                  </div>

                  // Thanh phải
                  <div className="w-3 h-10 rounded-md bg-[#e6ebed] ml-1"></div>
                </div>

                // Thanh dưới
                <div className="w-10 h-3 rounded-md bg-[#e6ebed] mt-1"></div>
              </div>
            </div>

          </div>
        ))}
      </div> 
      */}
      {/* code này để debug payload data */}
       

      {/* Modal */}
      {bookingModal.payload && (
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
