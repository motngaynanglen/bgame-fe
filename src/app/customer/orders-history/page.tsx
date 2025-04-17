'use client';
import { PagingResType } from "@/src/schemaValidations/common.schema";
import { useRentalStore } from "@/src/store/rentalStore";
import { Button, Empty, message, Tag } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "../../app-provider";
import { orderApiRequest } from "@/src/apiRequests/orders";
import { formatDateTime, formatVND } from "@/src/lib/utils";

interface DataType {
  key: string;
  id: string;
  transaction_id: string,
  customer_id: string,
  staff_id: string,
  code: string,
  email: string,
  full_name: string,
  phone_number: string,
  address: string,
  total_item: number,
  total_price: string,
  status: string,
  created_at: string,
}

export default function HistoryOrders({ searchParams, }: { searchParams?: { query?: string; page?: string }; }) {
  const [useData, setData] = useState<DataType[] | undefined>(undefined);
  const [paging, setPaging] = useState<PagingResType | undefined>(undefined);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const { user } = useAppContext();
  const router = useRouter();
  const apiBody = {
    paging: {
      pageNum: searchParams?.page ?? 1,
      pageSize: 10,
    },
  };
  const fetchTableData = async () => {
    setTableLoading(true);
    if (!user) {
      message.error("Bạn cần đăng nhập để đặt trước.");
      setTableLoading(false);
      return;
    }
    const response = await orderApiRequest.getOrderHistory(
      apiBody,
      user.token
    );
    const data: DataType[] | undefined = response.data?.map(
      (item: DataType) => ({
        ...item,
        key: item.id, // Gán id vào key
      })
    );
    setPaging(response.paging);
    setTableLoading(false);
    return data;
  };
  useEffect(() => {
    fetchTableData().then((result) => {
      setData(result);
    });
  }, [searchParams]);
  return (
    <div className="min-h-screen">
      <div className=" p-4 w-full max-w-4xl bg-white mt-2 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
        {useData?.length === 0 ? (
          <Empty description={<span>Bạn chưa có đơn hàng </span>}>
            <Button onClick={() => router.push("/products")} type="primary">
              Tìm mua board game
            </Button>
          </Empty>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Mã đơn hàng</th>
                <th className="border p-2">Ngày tạo đơn</th>
                <th className="border p-2">Phương Thức</th>
                <th className="border p-2">Giá Tiền</th>
              </tr>
            </thead>

            <tbody>
              {useData?.map((rental, index) => (
                <tr key={index} className="border text-center">
                  <td className="border p-2">{rental.code || "Không có mã"}</td>
                  <td className="border p-2">
                    {formatDateTime(rental.created_at,"DATE") }
                  </td>
                  <td className="border p-2">
                    <Tag>{rental.status}</Tag>
                  </td>
                  <td className="border p-2">
                    {formatVND(rental.total_price)}
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
