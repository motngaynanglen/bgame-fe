"use client";

import bookListApiRequest from "@/src/apiRequests/bookList";
import { useRentalStore } from "@/src/store/rentalStore";
import { useQuery } from "@tanstack/react-query";
import { Button, Empty } from "antd";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../app-provider";
import { use } from "react";

interface item {
  rent_price: number;
  rent_price_per_hour: number;
}
interface Booklist {
  id: string;
  customer_id: string;
  from: string;
  to: string;
  type: number;
  total_price: number;
  status: string;
  items: item[];
}
interface responseModel {
  data: Booklist[];
  message: string;
  statusCode: number;
  paging: null;
}

const RentalHistory = () => {
  const { cartItems } = useRentalStore();
  const router = useRouter();
  const { user } = useAppContext();

  const { data, isLoading, isError, error } = useQuery<responseModel>({
    queryKey: ["rentalHistory"],
    queryFn: async () => {
      // Hàm gọi API
      const res = await bookListApiRequest.getBookListHistory(
        {
          paging: {
            pageNum: 1,
            pageSize: 10,
          },
        },
        user?.token
      );
      return res.data;
    },
  });

  console.log("RentalHistory", data);
  return (
    <div className=" p-4 w-full bg-white mt-2 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Lịch sử thuê</h2>
      {data?.data.length === 0 ? (
        <Empty description={<span>Bạn chưa có đơn đặt thuê</span>}>
          <Button onClick={() => router.push("/rental")} type="primary">
            Tìm thuê board game
          </Button>
        </Empty>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Tên Board Game</th>
              <th className="border p-2">Ngày/Giờ Thuê</th>
              <th className="border p-2">Phương Thức</th>
              <th className="border p-2">Giá Tiền</th>
            </tr>
          </thead>

          <tbody>
            {/* {cartItems.map((rental, index) => (
              <tr key={index} className="border text-center">
                <td className="border p-2">{rental.title}</td>
                <td className="border p-2">
                  {rental.method === "hours"
                    ? `${rental.startDate} → ${rental.endDate}`
                    : rental.startDate}
                </td>
                <td className="border p-2">
                  {rental.method === "hours"
                    ? "Thuê theo giờ"
                    : "Thuê theo ngày"}
                </td>
                <td className="border p-2">{rental.price.toLocaleString()}đ</td>
              </tr>
            ))} */}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RentalHistory;
