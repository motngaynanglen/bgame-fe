"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import bookTableApiRequest from "@/src/apiRequests/bookTable";
import { useAppContext } from "@/src/app/app-provider";
import { useRentalStore } from "@/src/store/rentalStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const hours = Array.from({ length: 28 }, (_, i) =>
  dayjs("07:00", "HH:mm")
    .add(i * 30, "minute")
    .format("HH:mm")
);
const slots = Array.from({ length: 28 }, (_, i) => i + 1); // Slot 1 → 28

// const tables = ["Table 1", "Table 2", "Table 3", "Table 4"];

export type BookingStatus = "available" | "booked" | "locked" | "event";

export interface BookingCell {
  table: string;
  slot: number;
  status: BookingStatus;
}

interface BookingTableProps {
  storeId: string | null;
  bookDate: Date;
}

interface Boards {
  id: string;
  name: string;
  storeId: string;
  capacity: number;
  status: boolean;
  createdAt: string;
  createdBy: string;
  updatedBy: string;
  updatedAt: string;
}
interface BookingList {
  TableID: string;
  TableName: string;
  Capacity: string;
  FromSlot: number;
  ToSlot: number;
}
interface responseModel {
  data: BookingList[];
  message: string;
  statusCode: number;
  paging: null;
}

export default function BookingTable({ storeId, bookDate }: BookingTableProps) {
  const [bookingData, setBookingData] = useState<BookingCell[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<
    { table: string; slot: number }[]
  >([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [payloadData, setPayloadData] = useState();
  const { user } = useAppContext();
  const { cartItems } = useRentalStore();

  const getStatus = (table: string, slot: number): BookingStatus => {
    const found = bookingData.find(
      (b) => b.table === table && b.slot === slot
    );
    return found?.status || "available";
  };

  const handleClickSlot = (
    table: string,
    slot: number,
    status: BookingStatus
  ) => {
    if (status !== "available") return;

    if (selectedSlots.length && selectedSlots[0].table !== table) {
      setSelectedSlots([{ table, slot }]);
    } else {
      const exists = selectedSlots.find(
        (s) => s.slot === slot && s.table === table
      );
      if (exists) {
        setSelectedSlots(
          selectedSlots.filter((s) => !(s.slot === slot && s.table === table))
        );
      } else {
        setSelectedSlots(
          [...selectedSlots, { table, slot }].sort(
            (a, b) => a.slot - b.slot
          )
        );
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      setPayloadData(data);
      return bookListApiRequest.createBookList(data, user?.token);
    },
    mutationKey: ["createBookListByStaff"],
    onSuccess: () => {
      message.success("Đặt bàn thành công!");
      setSelectedSlots([]);
      setCustomerName("");
      setModalOpen(false);
    },
    onError: (error: any) => {
      message.error(`Đặt bàn thất bại. Vui lòng thử lại. ${error.message}`);
      console.error(error);
    },
  });

  const handleConfirmBooking = () => {
    if (!selectedSlots.length) return;

    const tableName = selectedSlots[0].table;
    const tableData = data?.data?.find((t) => t.TableName === tableName);
    const tableID = tableData?.TableID;

    const fromSlot = selectedSlots[0].slot;
    const toSlot = selectedSlots[selectedSlots.length - 1].slot + 1;
    
    const payload = {
      storeId,
      bookDate: bookDate.toISOString(),
      fromSlot,
      toSlot,
      tableIDs: tableID ? [tableID] : [],
      bookListItems : cartItems.map((item) => ({
        productTemplateID: item.productTemplateID,
        quantity: item.quantity,
      })),
    };
  
    mutation.mutate(payload);
  };

  const {
    data,
    isLoading: rentalLoading,
    isError: rentalError,
    error: rentalErrorData,
    isSuccess: rentalSuccess,
  } = useQuery<responseModel>({
    queryKey: ["rentalTimeTable", storeId, bookDate.toISOString()],
    queryFn: async () => {
      const res = await bookTableApiRequest.getBookTableTimeTableByDate({
        storeId,
        bookDate: bookDate.toISOString(),
      });
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
        for (let s = table.FromSlot; s < table.ToSlot; s++) {
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
      <div className="p-4 bg-white flex gap-6 text-sm items-center">
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
        {/* <div className="text-green-700 font-semibold underline cursor-pointer">
            Xem bàn & bảng giá
          </div> */}
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
            {[...new Map(data?.data?.map(item => [item.TableName, item])).values()].map((table, index) => (
              <tr key={'table' + index} className="border-b">
                <td className="bg-green-100 border p-2">{table.TableName}</td>
                {slots.map((slot) => {
                  const status = getStatus(table.TableName, slot);
                  const isSelected = selectedSlots.some(
                    (s) => s.table === table.TableName && s.slot === slot
                  );
                  const bgColor = status === "booked"
                    ? "bg-red-400 cursor-not-allowed"
                    : isSelected
                      ? "bg-green-400"
                      : "bg-white hover:bg-green-100";
                  return (
                    <td
                      key={slot}
                      onClick={() => handleClickSlot(table.TableName, slot, status)}
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
            <strong>{selectedSlots[selectedSlots.length - 1].slot + 1}</strong>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleConfirmBooking}
          >
            Xác nhận đặt bàn
          </button>
        </div>
      )}
      {payloadData && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{JSON.stringify(payloadData, null, 2)}</pre>
        </div>
      )}

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
    </div>
  );
}
