
import { Space, Table, Tag } from "antd";
import React from "react";
import type { TableProps } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns = [
  {
    title: 'Đơn hàng',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Ngày',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Giá trị đơn hàng',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: 'Phương thức thanh toán',
    dataIndex: 'payment',
    key: 'payment',
    
  },
];

export default function HistoryOrders() {
  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black pt-4">
        ĐƠN HÀNG CỦA BẠN
      </h1>
      <Table dataSource={dataSource} columns={columns} />
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
