import { Divider } from "antd";
import React from "react";

export default function DetailOnline() {
  return (
    <div className="min-h-screen text-white pt-2 sm:p-4">
      <div className="min-h-screemax-w-5xl mx-auto space-y-8  border-4 border-gray-800 p-4 rounded-lg bg-gray-900">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">
            MÃ ĐƠN Hàng: muốn xem thì gắn api vào còn không có thì hỏi BE để
            giải quyết, thân ái và quyết thắng.
          </h3>{" "}
          <h3 className="tetx-lg font-semibold">Trạng thái: ...</h3>
        </div>
        {/* <Divider style={{ borderColor: "white" }} /> */}
        <div className="grid grid-cols-3 gap-4 ">
          <div className="flex flex-col space-y-4 border-r-2 ">
            <h3 className="text-xl font-bold">Thông tin người nhận</h3>
            <p>Người nhận: Nguyễn Văn A</p>
            <p>Địa chỉ: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</p>
            <p>Số điện thoại: 0123456789</p>
          </div>
          <div className="flex flex-col space-y-4 border-r-2">
            <h3 className="text-xl font-bold ">Thông tin giao hàng</h3>
            <p>Phương thức giao hàng: Giao tận nơi</p>
            <p>Trạng thái giao hàng: chuẩn bị giao</p>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold">Thông tin thanh toán</h3>
            <p>Phương thức thanh toán: Thanh toán khi nhận hàng</p>
            <p>Trạng thái thanh toán: Chưa thanh toán</p>
          </div>
        </div>
        <Divider style={{ borderColor: "white" }} />
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-bold">Chi tiết đơn hàng</h3>
          <table className="min-w-full text-center border-collapse border border-gray-800">
            <colgroup>
              <col className="w-[300px]" />
              <col />
              <col className="w-[80px]" />
              <col className="w-[150px]" />
              <col className="w-[150px]" />
              <col className="w-[200px]" />
            </colgroup>
            <thead>
              <tr>
                <th className="border border-gray-800 p-2">Mã sản phẩm</th>
                <th className="border border-gray-800 p-2">Tên sản phẩm</th>
                <th className="border border-gray-800 p-2">SL</th>
                <th className="border border-gray-800 p-2">Giá</th>
                <th className="border border-gray-800 p-2">Thành tiền</th>
                <th className="border border-gray-800 p-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-800 p-2">SP001</td>
                <td className="border border-gray-800 p-2">Sản phẩm 1</td>
                <td className="border border-gray-800 p-2">1</td>
                <td className="border border-gray-800 p-2">100.000 VNĐ</td>
                <td className="border border-gray-800 p-2">100.000 VNĐ</td>
                <td className="border border-gray-800 p-2">hết hàng trong kho</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <h3 className="text-xl font-bold">Tổng tiền: 100.000 VNĐ</h3>
          </div>
          <div>
            <h3 className="text-xl font-bold">Ghi chú: </h3>
            <p>Đơn hàng này là một đơn hàng mẫu.</p>
            <p>Xin vui lòng không xác nhận đơn hàng này.</p>
          </div>
          <div className="flex justify-end mt-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Xuất hóa đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
