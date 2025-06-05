"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
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
import {
  Button,
  Card,
  Form,
  Modal,
  Radio,
  Space,
  Table,
  message
} from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import StaffBookListSearch from "./StaffBookListSearch";

dayjs.extend(customParseFormat);

interface BoardGame {
  id: string;
  product_name: string;
  product_group_ref_id: string;
  quantity: number;
  price: number;
  status: boolean;
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
  // const [rentalPeriod, setRentalPeriod] = useState({
  //   from: dayjs(),
  //   to: dayjs().add(1, "week"),
  // });

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

  // const handleRentalTypeChange = (type: 0 | 1) => {
  //   setRentalType(type);
  //   const now = dayjs();
  //   setRentalPeriod({
  //     from: now,
  //     to: type === 0 ? now.add(1, "day") : now.add(1, "hour"),
  //   });
  // };

  const resetForm = () => {
    setSelectedProducts([]);
    setSelectedCustomer(null);
    setIsModalVisible(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Tạo đơn thuê sản phẩm</h1>

      {/* Tìm kiếm sản phẩm */}
      <Card title="Tìm sản phẩm" className="mb-6">
        <StaffBookListSearch onAddProduct={handleAddProduct} />

        {/* Danh sách sản phẩm tìm được */}
        {/* <List
          className="mt-4"
          loading={isLoading}
          dataSource={products}
          renderItem={(product: BoardGame) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  onClick={() => {
                    if (product.quantity > 0) {
                      setSelectedProducts([...selectedProducts, product]);
                    } else {
                      message.warning("Sản phẩm đã được thuê");
                    }
                  }}
                >
                  Thêm vào đơn
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <img
                    src={product.image.split("||")[0]}
                    className="w-16 h-16 object-cover"
                  />
                }
                title={product.product_name}
                description={
                  <>
                    <div>Giá: {product.price.toLocaleString()}đ</div>
                    <Tag
                      color={product.status === "AVAILABLE" ? "green" : "red"}
                    >
                      {product.status === "AVAILABLE" ? "Có sẵn" : "Đã thuê"}
                    </Tag>
                  </>
                }
              />
            </List.Item>
          )}
        /> */}
      </Card>

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

            <Button
              type="primary"
              // icon={<ShoppingCartOutlined />}
              className="mt-4"
              onClick={() => setIsModalVisible(true)}
              disabled={!selectedProducts.length}
            >
              Tạo đơn thuê
            </Button>
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
          {/* <Form.Item label="Khách hàng" required>
            <Select
              showSearch
              placeholder="Chọn khách hàng"
              optionFilterProp="children"
              // onChange={(value, option) => setSelectedCustomer(option.customer)}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: "1",
                  label: "Nguyễn Văn A - 0987654321",
                  customer: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    name: "Nguyễn Văn A",
                    phone: "0987654321",
                  },
                },
                // Thêm các khách hàng khác
              ]}
            />
          </Form.Item> */}

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
