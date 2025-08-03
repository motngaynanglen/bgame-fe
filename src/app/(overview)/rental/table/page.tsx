"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { useAppContext } from "@/src/app/app-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { message } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const hours = Array.from({ length: 28 }, (_, i) =>
  dayjs("08:00", "HH:mm")
    .add(i * 30, "minute")
    .format("HH:mm")
);

// const tables = ["Table 1", "Table 2", "Table 3", "Table 4"];

export type BookingStatus = "available" | "booked" | "locked" | "event";

export interface BookingCell {
  table: string;
  time: string;
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

interface responseModel {
  data: Boards[];
  message: string;
  statusCode: number;
  paging: null;
}

export default function BookingTable({ storeId, bookDate }: BookingTableProps) {
  const [bookingData, setBookingData] = useState<BookingCell[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<
    { table: string; time: string }[]
  >([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const { user } = useAppContext();

  const getStatus = (table: string, time: string): BookingStatus => {
    const found = bookingData?.find(
      (b) => b.table === table && b.time === time
    );
    return found?.status || "available";
  };

  const handleClickSlot = (
    table: string,
    time: string,
    status: BookingStatus
  ) => {
    if (status !== "available") return;

    if (selectedSlots.length && selectedSlots[0].table !== table) {
      setSelectedSlots([{ table, time }]);
    } else {
      const exists = selectedSlots.find(
        (s) => s.time === time && s.table === table
      );
      if (exists) {
        setSelectedSlots(
          selectedSlots.filter((s) => !(s.time === time && s.table === table))
        );
      } else {
        setSelectedSlots(
          [...selectedSlots, { table, time }].sort(
            (a, b) => hours.indexOf(a.time) - hours.indexOf(b.time)
          )
        );
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return bookListApiRequest.createBookTableByCustomer(data, user?.token);
    },
    mutationKey: ["createBookListByStaff"],
    onSuccess: () => {
      message.success("Đặt bàn thành công!");
      setSelectedSlots([]);
      setCustomerName("");
      setPhone("");
      setModalOpen(false);
    },
    onError: (error: any) => {
      message.error(`Đặt bàn thất bại. Vui lòng thử lại. ${error.message}`);
      console.error(error);
    },
  });

  const handleConfirmBooking = () => {
    if (!selectedSlots.length) return;
    const table = selectedSlots[0].table;
    const startTime = selectedSlots[0].time;
    const endTime = dayjs(selectedSlots[selectedSlots.length - 1].time, "HH:mm")
      .add(30, "minute")
      .format("HH:mm");

    console.log({
      table,
      startTime,
      endTime,
      customerName,
      phone,
    });

    const payload = {
      storeId,
      bookDate: bookDate.toISOString(),
      fromSlot: startTime,
      toSlot: endTime,
      tableIDList: [table],
    };

    // Gọi API đặt bàn ở đây
    mutation.mutate(payload);

    console.log(payload);
    // setModalOpen(false);
    // setSelectedSlots([]);
    // setCustomerName("");
    // setPhone("");
  };

  const {
    data,
    isLoading: rentalLoading,
    isError: rentalError,
    error: rentalErrorData,
  } = useQuery<responseModel>({
    queryKey: ["rentalBoardGames", storeId],
    queryFn: async () => {
      const res = await bookListApiRequest.getListStoreTable({
        storeId,
      });
      return res;
    },
    enabled: !!storeId,
  });
  const tables = data?.data?.map((item) => item.name) || [];
  console.log("Selected:", selectedSlots);
  // console.log("Slot:", `${table}-${hour}`, "Selected:", isSelected);
  console.log("Booking Data:", bookingData);

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
            {tables.map((table) => (
              <tr key={table}>
                <td className="bg-green-100 border p-2">{table}</td>
                {hours.map((hour) => {
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
                      className={`border-b border-r h-8 cursor-pointer transition-all duration-200 ${
                        isSelected ? "bg-red-400" : "bg-white hover:bg-red-100"
                      }`}
                    ></td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlots.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-green-700">
            ✅ Đã chọn: <strong>{selectedSlots[0].table}</strong>, từ{" "}
            <strong>{selectedSlots[0].time}</strong> đến{" "}
            <strong>
              {dayjs(selectedSlots[selectedSlots.length - 1].time, "HH:mm")
                .add(30, "minute")
                .format("HH:mm")}
            </strong>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleConfirmBooking}
          >
            Xác nhận đặt bàn
          </button>
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
