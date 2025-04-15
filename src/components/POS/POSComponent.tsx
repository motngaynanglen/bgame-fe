import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Input,
  InputNumber,
  QRCode,
  Select,
  Space,
  Table,
} from "antd";
import React from "react";
import type { TableProps } from "antd";
import TypedInputNumber from "antd/es/input-number";

interface DataType {
  key: string;
  name: string;
  quantity: number;
  price: string;
  total: string;
}

// const columns: TableProps<DataType>["columns"] = [
//   {
//     title: "STT",
//     dataIndex: "key",
//     width: 50,
//   },
//   {
//     title: "Tên hàng",
//     dataIndex: "name",
//   },
//   {
//     title: "SL",
//     dataIndex: "quantity",
//     width: 100,
//   },
//   {
//     title: "Đơn giá",
//     dataIndex: "price",
//     width: 150,
//   },
//   {
//     title: "Thành tiền",
//     dataIndex: "total",
//     width: 150,
//   },
//   {
//     title: "",
//     key: "action",
//     width: 100,
//     render: (_, record) => (
//       <Space size="middle">
//         <a>Delete</a>
//       </Space>
//     ),
//   },
// ];

const dataSource = [
  {
    key: "1",
    name: "Nana",
    quantity: 1,
    price: "350.000",
    total: "350,000",
  },
  {
    key: "2",
    name: "Catan",
    quantity: 1,
    price: "500.000",
    total: "500.000",
  },
];

export default function POSComponent() {
  const [data, setData] = React.useState<DataType[]>(dataSource);
  const columns: TableProps<DataType>["columns"] = [
    { title: "STT", dataIndex: "key", width: 50 },
    { title: "Tên hàng", dataIndex: "name" },
    {
      title: "SL",
      dataIndex: "quantity",
      width: 100,
      render: (value, record) => (
        <InputNumber
          min={1}
          value={value}
          onChange={(newQuantity) =>
            handleQuantityChange(record.key, newQuantity)
          }
        />
      ),
    },
    { title: "Đơn giá", dataIndex: "price", width: 150 },
    { title: "Thành tiền", dataIndex: "total", width: 150 },
    {
      title: "",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const handleQuantityChange = (key: string, newQuantity: number | null) => {
    if (newQuantity !== null) {
      setData((prevData) =>
        (prevData ?? []).map((item) =>
          item.key === key ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {/* Left Panel - Sản phẩm */}
        <div className="col-span-2 ">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm sản phẩm hoặc nhập mã"
            className="mb-2"
          />
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            size="small"
            locale={{ emptyText: <Empty description="No Data"></Empty> }}
          />
        </div>

        {/* Right Panel - Thanh toán */}
        <div className="bg-white border rounded p-4 shadow-sm">
          <div className="mb-2">
            <span className="font-medium text-xl">Tên khách hàng:</span>
            <Input placeholder="Khách lẻ" size="middle" className="mt-1" />
          </div>
          <div className="mb-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-xl">Tổng SL hàng:</span>{" "}
              <span className="text-xl">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl">Giảm giá:</span>{" "}
              <input
                type="text"
                id="standard_success"
                aria-describedby="standard_success_help"
                className="basis-1/5 block text-end w-full text-xl text-black bg-transparent border-0 border-b-2 border-green-600 appearance-none dark:text-white dark:border-green-500 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder="0"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-xl">Thực thu:</span>{" "}
              <span className="text-xl">18,000</span>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <h2 className="text-xl font-semibold mb-2">Thanh toán</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="radio" name="payment" className="mr-2" />
                <label className="text-lg">Tiền mặt</label>
                <i className="fas fa-money-bill-wave ml-2"></i>
              </div>
              <div className="flex items-center">
                <input type="radio" name="payment" className="mr-2" />
                <label className="text-lg">Chuyển khoản</label>
                <i className="fas fa-money-bill-wave ml-2"></i>
              </div>
            </div>
          </div>
          <div className="flex justify-center my-4">
            <QRCode value="https://momo.vn/payment" size={128} />
          </div>
          <Button type="primary" block size="large">
            THANH TOÁN
          </Button>
        </div>
      </div>
    </div>
  );
}
