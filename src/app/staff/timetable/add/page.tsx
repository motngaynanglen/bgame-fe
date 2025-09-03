"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import bookTableApiRequest from "@/src/apiRequests/bookTable";
import productApiRequest from "@/src/apiRequests/product";
import storeApiRequest from "@/src/apiRequests/stores";
import { useAppContext } from "@/src/app/app-provider";
import CustomDatePicker from "@/src/components/DateRantalPicker/DateRental";
import CustomRangePicker from "@/src/components/DateRantalPicker/HourRental";
import {
  notifyError,
  notifySuccess,
} from "@/src/components/Notification/Notification";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Form, Modal, Radio, Space, Table, message } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import StaffBookListSearch from "./StaffBookListSearch";
import BookingTable from "@/src/app/(overview)/rental/BookTimeTable";

dayjs.extend(customParseFormat);

export type BookingStatus = "available" | "booked" | "locked" | "event";

interface BoardGame {
  id: string;
  product_name: string;
  product_group_ref_id: string;
  productTemplateID: string;
  quantity: number;
  price: number;
  status: string;
  image: string;
  rent_price: number;
  rent_price_per_hour: number;
  publisher: string;
  category: string;
  code: string;
  player: string;
  time: string;
  age: number;
  complexity: number;
  product_type: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
}

type Table = {
  TableID: string;
  TableName: string;
  Capacity: string;
  FromSlot: number;
  ToSlot: number;
  Owner: string;
};

const StaffRentalPage = () => {
  // State quản lý
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<BoardGame[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedOption, setSelectedOption] = useState<"days" | "hours">(
    "days"
  );

  const [bookDate, setBookDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [fromSlot, setFromSlot] = useState("18:00");
  const [toSlot, setToSlot] = useState("20:00");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);

  const toggleGame = (id: string) => {
    setSelectedGames((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const payload = {
      bookListItems: selectedGames.map((g) => ({ productID: g })),
      fromSlot,
      toSlot,
      bookDate: dayjs(bookDate).toISOString(),
      tableIDs: selectedTable ? [selectedTable] : [],
    };

    console.log("Booking payload:", payload);
    // TODO: gọi API tại đây
    alert("Đặt bàn & boardgame thành công!");
  };

  const [selectedDate, setSelectedDate] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  const handleAddProduct = (product: BoardGame) => {
    if (product.quantity <= 0) {
      message.warning("Sản phẩm không khả dụng để thuê");
      return;
    }
    setSelectedProducts([...selectedProducts, product]);
  };

  const [rentalType, setRentalType] = useState<0 | 1>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useAppContext().user;

  // Lấy ID cửa hàng khi staff đăng nhập
  const { data: storeId, isLoading: storeLoading } = useQuery({
    queryKey: ["selectedStoreId"],
    queryFn: async () => {
      if (!user?.token) {
        throw new Error("User token is not available");
      }
      const res = await storeApiRequest.getStoreId(user.token);
      return res.data;
    },

    enabled: !!user?.token,
  });

  console.log("storeId", storeId);

  // Lấy danh sách bàn
  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables", storeId],
    queryFn: async () => {
      if (!storeId) {
        throw new Error("Store ID is not available");
      }
      const res = await bookTableApiRequest.getBookTableTimeTableByDate(
        { storeId, bookDate },
        user?.token
      );
      return res.data;
    },
    enabled: !!storeId,
  });

  // Tìm kiếm sản phẩm
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", searchQuery],
    queryFn: async () => {
      const res = await productApiRequest.getListByStoreId({
        storeId: storeId,
        isRent: true,
        paging: {
          pageNum: 1,
          pageSize: 20,
        },
      });
      return res.data;
    },
    enabled: searchQuery.length > 0,
  });

  const options: CheckboxGroupProps<string>["options"] = [
    { label: "Thuê theo ngày", value: "days" },
    { label: "Thuê theo giờ", value: "hours" },
  ];

  console.log("products", products);
  // Tạo đơn thuê
  const handleCreateRental = async () => {
    try {
      const body = {
        customerId: null, // lấy từ context
        bookListItems: selectedProducts.map((p) => ({ productID: p.id })),
        from: selectedDate ? selectedDate[0]?.toISOString() : "", // Chuyển thời gian sang định dạng ISO
        to: selectedDate ? selectedDate[1]?.toISOString() : "", // Chuyển thời gian sang định dạng ISO
        bookType: selectedOption === "days" ? 1 : 0, // 1 = theo ngày, 0 = theo giờ
      };

      const response = await bookListApiRequest.createBookListByStaff(
        body,
        user?.token
      );
      console.log("Tại vì sao", body);
      if (response.statusCode == "200") {
        notifySuccess(
          "Đặt trước thành công!",
          "Chúc bạn có những phút giây vui vẻ với sản phẩm của chúng tôi."
        );
      } else
        notifyError(
          "Đặt trước thất bại!",
          response.message || "Vui lòng thử lại sau."
        );

      resetForm();
    } catch (error) {
      message.error("Tạo đơn thuê thất bại");
      console.error(error);
    }
  };

  const resetForm = () => {
    setSelectedProducts([]);
    setSelectedCustomer(null);
    setIsModalVisible(false);
  };

  const getTableStatus = (table: Table): string => {
    if (table.Owner !== null) {
      return "occupied"; // Đang sử dụng (có chủ sở hữu)
    } else if (table.FromSlot !== null && table.ToSlot !== null) {
      return "booked"; // Đã đặt trước (có khung giờ nhưng chưa có chủ)
    } else {
      return "available"; // Trống (không có thông tin gì)
    }
  };
  // const mockTables: Table[] = [
  //   { id: "1", name: "Bàn 1", status: "available" },
  //   { id: "2", name: "Bàn 2", status: "booked" },
  //   { id: "3", name: "Bàn 3", status: "occupied" },
  //   { id: "4", name: "Bàn 4", status: "available" },
  // ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Tạo đơn thuê sản phẩm</h1>

      {/* Tìm kiếm sản phẩm */}
      <Card title="Tìm sản phẩm" className="mb-6">
        <StaffBookListSearch onAddProduct={handleAddProduct} />
      </Card>

      <BookingTable
        searchParams={{
          storeId: storeId,
          bookDate: new Date(),
          cartItems: selectedProducts,
        }}
      />
      {/* test giao dien chon ban */}
      <div className="p-6 grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <h2 className="text-xl font-semibold mb-4">Sơ đồ bàn</h2>
          <div className="grid grid-cols-4 gap-4">
            {tables?.map((table: Table) => {
              const status = getTableStatus(table); // Tính toán trạng thái

              return (
                <div
                  key={table.TableID}
                  onClick={() => setSelectedTable(table)}
                  className={`cursor-pointer rounded-xl p-4 text-center shadow-md transition
              ${status === "available" ? "bg-green-200 hover:bg-green-300" : ""}
              ${status === "booked" ? "bg-yellow-200 hover:bg-yellow-300" : ""}
              ${status === "occupied" ? "bg-red-200 hover:bg-red-300" : ""}
            `}
                >
                  <p className="font-bold">{table.TableName}</p>
                  <p className="text-sm">
                    {status === "available" && "Trống"}
                    {status === "booked" && "Đã đặt trước"}
                    {status === "occupied" && "Đang sử dụng"}
                  </p>
                  {table.Capacity && (
                    <p className="text-xs text-gray-600">
                      {table.Capacity} chỗ
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-1 border-l pl-4">
          <h2 className="text-xl font-semibold mb-4">Chi tiết bàn</h2>
          {selectedTable ? (
            <div>
              <p className="mb-2 font-bold">{selectedTable.TableName}</p>
              <p className="mb-4">
                Trạng thái:{" "}
                <span className="capitalize">
                  {getTableStatus(selectedTable) === "available" && "Trống"}
                  {getTableStatus(selectedTable) === "booked" && "Đã đặt trước"}
                  {getTableStatus(selectedTable) === "occupied" &&
                    "Đang sử dụng"}
                </span>
              </p>

              {getTableStatus(selectedTable) === "available" && (
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Đặt bàn
                </button>
              )}

              {getTableStatus(selectedTable) === "booked" && (
                <div className="text-sm text-gray-700">
                  <p>
                    Khung giờ: {selectedTable.FromSlot} - {selectedTable.ToSlot}
                  </p>
                  <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    Check-in
                  </button>
                </div>
              )}

              {getTableStatus(selectedTable) === "occupied" && (
                <div className="text-sm text-gray-700">
                  <p>Chủ sở hữu: {selectedTable.Owner}</p>
                  <p>
                    Khung giờ: {selectedTable.FromSlot} - {selectedTable.ToSlot}
                  </p>
                  <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                    Check-out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Chọn bàn để xem chi tiết</p>
          )}
        </div>
      </div>

      {/* Giỏ hàng thuê */}
      <Card title="Sản phẩm đã chọn" className="mb-6">
        {selectedProducts.length > 0 ? (
          <>
            <Table
              dataSource={selectedProducts}
              columns={[
                { title: "Tên sản phẩm", dataIndex: "product_name" },
                {
                  title: "Giá",
                  dataIndex: "price",
                  render: (price) => `${price.toLocaleString()}đ`,
                },
                {
                  title: "Thao tác",
                  render: (_, record) => (
                    <Button
                      danger
                      onClick={() =>
                        setSelectedProducts(
                          selectedProducts.filter((p) => p.id !== record.id)
                        )
                      }
                    >
                      Xóa
                    </Button>
                  ),
                },
              ]}
              rowKey="id"
              pagination={false}
            />

            {/* <Button
              type="primary"
              // icon={<ShoppingCartOutlined />}
              className="mt-4"
              onClick={() => setIsModalVisible(true)}
              disabled={!selectedProducts.length}
            >
              Tạo đơn thuê
            </Button> */}
          </>
        ) : (
          <div className="text-gray-500">Chưa có sản phẩm nào được chọn</div>
        )}
      </Card>

      {/* Modal tạo đơn thuê */}
      <Modal
        title="Tạo đơn thuê"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreateRental}
        okText="Xác nhận"
        cancelText="Hủy"
        width={700}
      >
        <Form layout="vertical">
          <Form.Item label="Thời gian thuê" required>
            <Space.Compact>
              <div className="flex-col items-center">
                <Radio.Group
                  options={options}
                  defaultValue="days"
                  optionType="button"
                  buttonStyle="solid"
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <p className="mt-4 text-black-2">Chọn thời gian thuê: </p>
                {selectedOption === "days" && (
                  <div>
                    <CustomDatePicker
                      onChange={(date) =>
                        setSelectedDate(date ? [date, date] : null)
                      }
                    />
                  </div>
                )}
                {selectedOption === "hours" && (
                  <div>
                    <CustomRangePicker
                      onChange={(dates) => setSelectedDate(dates)}
                    />
                  </div>
                )}
              </div>
            </Space.Compact>
          </Form.Item>

          <Form.Item label="Danh sách sản phẩm">
            <ul>
              {selectedProducts.map((product) => (
                <li key={product.id}>{product.product_name}</li>
              ))}
            </ul>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffRentalPage;
