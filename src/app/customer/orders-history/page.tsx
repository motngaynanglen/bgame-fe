'use client';
import { useRentalStore } from "@/src/store/rentalStore";
import { Button, Empty } from "antd";
import { useRouter } from "next/navigation";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street",
  },
  {
    key: "2",
    name: "John",
    age: 42,
    address: "10 Downing Street",
  },
];

const columns = [
  {
    title: "Đơn hàng",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Ngày",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Giá trị đơn hàng",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Phương thức thanh toán",
    dataIndex: "payment",
    key: "payment",
  },
];

export default function HistoryOrders() {
  const { rentals } = useRentalStore();
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <div className=" p-4 w-full max-w-4xl bg-white mt-2 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
        {rentals.length === 0 ? (
          <Empty description={<span>Bạn chưa có đơn hàng </span>}>
            <Button onClick={() => router.push("/products")} type="primary">
              Tìm mua board game
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
              {rentals.map((rental, index) => (
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
                  <td className="border p-2">
                    {rental.price.toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="py-2  border border-gray-200">Đơn hàng</th>
              <th className="py-2 px-4 border border-gray-200">Ngày</th>
              <th className="py-2 px-4 border border-gray-200">Địa chỉ</th>
              <th className="py-2  border border-gray-200">
                Giá trị đơn hàng
              </th>
              <th className="py-2  border border-gray-200">
                Phương thức thanh toán
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center text-black py-4">Không có đơn hàng nào.</td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </div>
  );
}
