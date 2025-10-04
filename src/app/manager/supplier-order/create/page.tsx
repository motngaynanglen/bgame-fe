"use client";
import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Table,
  InputNumber,
  message,
  Row,
  Col,
  Typography,
  Divider,
  Space,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import supplierApiRequest from "@/src/apiRequests/supplier";
import { useAppContext } from "@/src/app/app-provider";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface SupplyOrderItem {
  name: string;
  quantity: number;
}
interface CreateOrderForm {
  storeId: null;
  supplierId: string;
  title: string;
  supplyOrders: SupplyOrderItem[];
}

const CreateOrderPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<SupplyOrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState<SupplyOrderItem>({
    name: "",
    quantity: 1,
  });

  const { user } = useAppContext();

  const apiBody = {
    paging: {
      pageNum: 1,
      pageSize: 10,
    },
  };

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await supplierApiRequest.get(apiBody, user?.token || "");
      return res;
    },
    enabled: !!user?.token,
  });

  const addOrderItem = () => {
    if (!currentItem.name.trim()) {
      message.warning("Vui lòng nhập tên sản phẩm");
      return;
    }

    if (currentItem.quantity <= 0) {
      message.warning("Số lượng phải lớn hơn 0");
      return;
    }

    setOrderItems((prev) => [...prev, currentItem]);
    setCurrentItem({ name: "", quantity: 1 });
    message.success("Đã thêm sản phẩm vào đơn hàng");
  };

  const removeOrderItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
    message.success("Đã xóa sản phẩm khỏi đơn hàng");
  };

  const updateOrderItem = (
    index: number,
    field: keyof SupplyOrderItem,
    value: any
  ) => {
    setOrderItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const onFinish = async (values: any) => {
    if (orderItems.length === 0) {
      message.error("Vui lòng thêm ít nhất một sản phẩm vào đơn hàng");
      return;
    }

    setLoading(true);
    try {
      const orderData: CreateOrderForm = {
        storeId: null,
        supplierId: values.supplierId,
        title: values.title,
        supplyOrders: orderItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
      };

      console.log("Order data to submit:", orderData);

      // Gọi API ở đây
      const res = await supplierApiRequest.createSuppilerOrder(
        orderData,
        user?.token || ""
      );

      message.success("Tạo đơn hàng thành công!");
      form.resetFields();
      setOrderItems([]);
    } catch (error) {
      message.error("Tạo đơn hàng thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: SupplyOrderItem, index: number) => (
        <Input
          value={text}
          onChange={(e) => updateOrderItem(index, "name", e.target.value)}
          placeholder="Nhập tên sản phẩm"
        />
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (quantity: number, record: SupplyOrderItem, index: number) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => updateOrderItem(index, 'quantity', value || 1)}
          className="w-full"
        />
      ),
    },
   {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Popconfirm
          title="Xóa sản phẩm?"
          description="Bạn có chắc chắn muốn xóa sản phẩm này?"
          onConfirm={() => removeOrderItem(index)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button 
            danger 
            type="link" 
            icon={<DeleteOutlined />} 
            size="small"
          />
        </Popconfirm>
      ),
    },
  ];

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">
            Tạo Đơn Hàng Mới
          </Title>
          <Text type="secondary">Tạo đơn hàng nhập kho từ nhà cung cấp</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Card className="rounded-2xl shadow-lg border-0 mb-6">
            <Divider orientation="left">
              <ShoppingCartOutlined className="mr-2" />
              Thông tin đơn hàng
            </Divider>

            <Form.Item
              name="supplierId"
              label="Nhà cung cấp"
              rules={[
                { required: true, message: "Vui lòng chọn nhà cung cấp" },
              ]}
            >
              <Select
                placeholder="Chọn nhà cung cấp"
                size="large"
                showSearch
                optionFilterProp="children"
                // filterOption={(input, option) =>
                //   (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                // }
              >
                {suppliers?.data.map((supplier: any) => (
                  <Option key={supplier.id} value={supplier.id}>
                    {supplier.supplier_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="title"
              label="Tiêu đề đơn hàng"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề đơn hàng" },
                { max: 200, message: "Tiêu đề không quá 200 ký tự" },
              ]}
            >
              <Input
                placeholder="VD: Đơn nhập board game tháng 1/2024"
                size="large"
              />
            </Form.Item>
          </Card>

          {/* Order Items Section */}
          <Card
            title={
              <div className="flex justify-between items-center">
                <span> Danh sách sản phẩm</span>
                <Text type="secondary">Tổng: {totalItems} sản phẩm</Text>
              </div>
            }
            className="rounded-2xl shadow-lg border-0 mb-6"
          >
            {/* Add Item Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <Row gutter={[12, 12]} align="middle">
                <Col xs={24} md={16}>
                  <Input
                    placeholder="Tên sản phẩm"
                    value={currentItem.name}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    size="large"
                    onPressEnter={addOrderItem}
                  />
                </Col>
                <Col xs={12} md={4}>
                  <InputNumber
                    placeholder="Số lượng"
                    min={1}
                    value={currentItem.quantity}
                    onChange={(value) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        quantity: value || 1,
                      }))
                    }
                    className="w-full"
                    size="large"
                  />
                </Col>
                <Col xs={12} md={4}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addOrderItem}
                    size="large"
                    className="w-full"
                  >
                    Thêm
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Items Table */}
            {orderItems.length > 0 ? (
              <Table
                columns={columns}
                dataSource={orderItems}
                pagination={false}
                scroll={{ x: 500 }}
                rowKey="id"
                size="middle"
                className="mb-4"
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCartOutlined className="text-4xl mb-4 block" />
                <p>Chưa có sản phẩm nào trong đơn hàng</p>
                <p className="text-sm">Thêm sản phẩm bằng form bên trên</p>
              </div>
            )}
          </Card>

          {/* Submit Button */}
          <Card className="rounded-2xl shadow-lg border-0">
            <div className="text-center">
              <Space size="large">
                <Button
                  size="large"
                  onClick={() => {
                    form.resetFields();
                    setOrderItems([]);
                    message.info("Đã hủy đơn hàng");
                  }}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  icon={<SaveOutlined />}
                  className="min-w-[200px]"
                  disabled={orderItems.length === 0}
                >
                  Tạo Đơn Hàng
                </Button>
              </Space>
            </div>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default CreateOrderPage;
