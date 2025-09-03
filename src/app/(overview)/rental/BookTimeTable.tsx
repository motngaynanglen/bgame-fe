"use client";
import bookTableApiRequest from "@/src/apiRequests/bookTable";
import { useAppContext } from "@/src/app/app-provider";
import dayjs from "@/src/lib/dayjs";
import { PaymentData } from "@/src/schemaValidations/transaction.schema";
import { useRentalStore } from "@/src/store/rentalStore";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, message } from "antd";
import { useEffect, useState } from "react";
import BookingPaymentModal from "./PaymentModal";

const hours = Array.from({ length: 28 }, (_, i) =>
  dayjs("07:00", "HH:mm")
    .add(i * 30, "minute")  
    .format("HH:mm")
);
const slots = Array.from({ length: 28 }, (_, i) => i + 1); // Slot 1 → 28


export type BookingStatus = "available" | "booked" | "locked" | "event";

export interface BookingCell {
  table: string;
  slot: number;
  status: BookingStatus;
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
    productName?: string;
    price?: number;
  }[];
}
interface PageProps {
  searchParams: {
    storeId?: string;
    bookDate?: Date;
    cartItems?: {
      productTemplateID: string;
      quantity: number;
      product_name?: string; // Thêm trường product_name
      price?: number;
    }[];
  };
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

export default function BookingTable({
  searchParams: { storeId, bookDate, cartItems = [] },
}: PageProps) {
  const [bookingData, setBookingData] = useState<BookingCell[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<
    { table: string; slot: number }[]
  >([]);
  const [bookingModal, setBookingModal] = useState<{
    open: boolean;
    payload?: BookingRequestBody;
  }>({ open: false });

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(
    dayjs(bookDate || undefined)
  );
  const { user, isAuthenticated } = useAppContext();
  const [paymentData, setPaymentData] = useState<PaymentData | undefined>(
    undefined
  );

  const getStatus = (table: string, slot: number): BookingStatus => {
    const found = bookingData.find((b) => b.table === table && b.slot === slot);
    if (found?.status) return found.status;

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
        productName: item.product_name,
        price: item.price, // Lưu giá sản phẩm
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
  } = useQuery<responseModel>({
    queryKey: ["rentalTimeTable", storeId, selectedDate?.format()],
    queryFn: async () => {
      const res = await bookTableApiRequest.getBookTableTimeTableByDate(
        {
          storeId,
          bookDate: selectedDate?.format() || dayjs().format(),
        },
        user?.token
      );
      return res;
    },
    enabled: !!storeId,
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
  return (
    <div className="space-y-4">
      <div className="flex justify-between p-4 bg-white  ">
        <div className=" bg-white flex gap-6 text-sm items-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border rounded bg-white" /> Trống
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded" /> Đã đặt
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded" /> Khoá
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400 rounded" /> Sự kiện
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" /> Bạn đã đặt
          </div>
          {/* <div className="text-green-700 font-semibold underline cursor-pointer">
            Xem bàn & bảng giá
          </div> */}
        </div>

        <span>
          Ngày:{" "}
          <DatePicker
            type="date"
            value={selectedDate}
            disabledDate={(current) => {
              const today = dayjs().startOf("day");
              const maxDate = today.add(2, "month").endOf("month");
              return current < today || current > maxDate;
            }}
            onChange={(date) => setSelectedDate(date)}
            disabled={rentalLoading || rentalError}
          />
        </span>
      </div>
      <div className="overflow-auto border rounded-md">
        <table className="min-w-max table-fixed border-collapse">
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
            ].map((table, index) => (
              <tr key={"table" + index} className="border-b">
                <td className="bg-green-100 border p-2">{table.TableName}</td>
                {slots.map((slot) => {
                  const status = getStatus(table.TableName, slot);
                  const isSelected = selectedSlots.some(
                    (s) => s.table === table.TableName && s.slot === slot
                  );

                  const bgColor =
                    status === "booked" && table.Owner != null
                      ? "bg-yellow-500"
                      : status === "booked"
                      ? "bg-red-400 cursor-not-allowed"
                      : status === "locked"
                      ? "bg-gray-300 cursor-not-allowed"
                      : isSelected
                      ? "bg-green-400"
                      : "bg-white hover:bg-green-100";
                  return (
                    <td
                      key={slot}
                      onClick={() =>
                        handleClickSlot(table.TableName, slot, status)
                      }
                      className={`border-b border-r h-8 cursor-pointer transition-all duration-200 ${bgColor}`}
                    ></td>
                  );
                })}
                {/* {hours.map((hour) => {
                    const status = getStatus(table, hour);
                    const isSelected = selectedSlots.some(
                      (s) => s.table === table && s.time === hour
                    );
                    return (
                      <td
                        key={hour}
                        onClick={() => handleClickSlot(table, hour, status)}
                        //                     className={`border h-10 cursor-pointer transition-all
                        //   ${status === "available" ? "bg-white hover:bg-red-100" : ""}
                        //   ${status === "booked" ? "bg-red-400 cursor-not-allowed" : ""}
                        //   ${status === "locked" ? "bg-gray-400 cursor-not-allowed" : ""}
                        //   ${status === "event" ? "bg-purple-300 cursor-not-allowed" : ""}
                        //   ${isSelected ? "bg-red-500 text-white" : ""}

                        // `}
                        className={`border-b border-r h-8 cursor-pointer transition-all duration-200 ${isSelected ? "bg-red-400" : "bg-white hover:bg-red-100"
                          }`}
                      ></td>
                    );
                  })} */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlots.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-green-700">
            {/*  <strong>{selectedSlots[0].table}</strong>, từ{" "}
              <strong>{selectedSlots[0].slot}</strong> đến{" "}
              <strong>
                {dayjs(selectedSlots[selectedSlots.length - 1].slot, "HH:mm")
                  .add(30, "minute")
                  .format("HH:mm")}
              </strong> */}
            ✅ Đã chọn: <strong>{selectedSlots[0].table}</strong>, từ slot{" "}
            <strong>{selectedSlots[0].slot}</strong> đến{" "}
            <strong>{selectedSlots[selectedSlots.length - 1].slot}</strong>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleConfirmBooking}
          >
            Xác nhận đặt bàn
          </button>
        </div>
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
                <div className="w-10 h-3 rounded-md bg-[#e6ebed] mb-1"></div>

                <div className="flex items-center">
                  <div className="w-3 h-10 rounded-md bg-[#e6ebed] mr-1"></div>

                  <div className="w-14 h-14 rounded-md bg-[#e6ebed] flex justify-center items-center text-gray-500 text-sm font-sans">
                    {cell.TableName}
                  </div>

                  <div className="w-3 h-10 rounded-md bg-[#e6ebed] ml-1"></div>
                </div>

                <div className="w-10 h-3 rounded-md bg-[#e6ebed] mt-1"></div>
              </div>
            </div>

          </div>
        ))}
      </div> */}
      {/* code này để debug payload data */}
      {/* {data && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{JSON.stringify(bookingModal.payload, null, 2)}</pre>
          <pre>{JSON.stringify(selectedDate?.format(), null, 2)}</pre>
        </div>
      )} */}

      {/* <Modal
          open={modalOpen}
          title="Xác nhận đặt bàn"
          onCancel={() => setModalOpen(false)}
          onOk={handleConfirmBooking}
          okText="Đặt bàn"
        >
          <div className="space-y-4">
            <Input
              placeholder="Họ tên khách"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </Modal> */}
      {bookingModal.payload && (
        <BookingPaymentModal
          open={bookingModal.open}
          onClose={() => setBookingModal({ open: false })}
          bookTables={bookingModal.payload}
          paymentData={paymentData}
          setPaymentData={() => setPaymentData(paymentData)}
        />
      )}
    </div>
  );
}
