"use client";

import { useRentalStore } from "@/src/store/rentalStore";
import { Button, Empty } from "antd";
import { useRouter } from "next/navigation";

const RentalHistory = () => {
  const { rentals } = useRentalStore();
  const router = useRouter();
  return (
    <div className=" min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Lịch sử thuê</h2>
      {rentals.length === 0 ? (
        <Empty description={<span>Bạn chưa có đơn đặt thuê</span>}>
          <Button onClick={() => router.push('/rental')} type="primary">Tìm thuê board game</Button>
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
            {rentals.map((rental, index) => (
              <tr key={index} className="border">
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RentalHistory;
