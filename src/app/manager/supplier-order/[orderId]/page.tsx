"use client";
import productApiRequest from "@/src/apiRequests/product";
import supplierApiRequest from "@/src/apiRequests/supplier";
import { useAppContext } from "@/src/app/app-provider";
import {
  FileTextOutlined,
  PrinterOutlined,
  EditOutlined,
  CheckOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Space,
  Table,
  Tag,
  InputNumber,
  Modal,
  Form,
  Select,
  message,
  Input,
  List,
  Avatar,
  Spin,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
  productTemplateID?: string;
}

interface OrderDetail {
  id: string;
  supplier_id: string;
  supplier_name: string;
  title: string;
  total_item: number;
  total_price: number;
  is_paid: boolean;
  status: string;
  items: OrderItem[];
}

interface OrderDetailResponse {
  data: OrderDetail;
  message: string;
  statusCode: number;
}

interface PriceUpdateRequest {
  supplyOrderID: string;
  items: Array<{
    supplyItemID: string;
    price: number;
  }>;
}

interface QuantityUpdateRequest {
  supplyItemID: string;
  productTemplateID: string;
}

interface ProductTemplate {
  id: string;
  product_name: string;
}

interface ProductSearchResponse {
  data: ProductTemplate[];
  message: string;
  statusCode: number;
}

const OrderDetailPage = () => {
  const { user } = useAppContext();
  const { orderId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductTemplate | null>(null);

  const { data: orderData, isLoading } = useQuery<OrderDetailResponse>({
    queryKey: ["supplier-order-detail", orderId],
    queryFn: async () => {
      const res = await supplierApiRequest.getSuppilerOrderDetail(
        orderId,
        user?.token
      );
      return res;
    },
    enabled: !!orderId,
  });

  // API tìm kiếm sản phẩm
  const { data: searchResults, isLoading: searchLoading } =
    useQuery<ProductSearchResponse>({
      queryKey: ["product-search", searchTerm],
      queryFn: async () => {
        if (!searchTerm.trim()) {
          return { data: [], message: "", statusCode: 200 };
        }

        const res = await productApiRequest.productSuggestion(
          { search: searchTerm },
          user?.token
        );
        return res;
      },
      enabled: !!searchTerm.trim() && !!user?.token,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  // Mutation để thêm giá
  const updatePriceMutation = useMutation({
    mutationFn: async (data: PriceUpdateRequest) => {
      await supplierApiRequest.updateSuppilerItemPrice(data, user?.token);
      console.log("Updating prices:", data);
      return Promise.resolve();
    },
    onSuccess: () => {
      message.success("Cập nhật giá thành công");
      setPriceModalVisible(false);
      setSelectedItems({});
      queryClient.invalidateQueries({
        queryKey: ["supplier-order-detail", orderId],
      });
    },
    onError: () => {
      message.error("Cập nhật giá thất bại");
    },
  });

  // Mutation để cập nhật số lượng
  const updateQuantityMutation = useMutation({
    mutationFn: async (data: QuantityUpdateRequest) => {
      await supplierApiRequest.updateProductQuantity(data, user?.token);
      console.log("Updating quantity:", data);
      return Promise.resolve();
    },
    onSuccess: () => {
      message.success("Cập nhật số lượng thành công");
      setQuantityModalVisible(false);
      setEditingItem(null);
      setSelectedProduct(null);
      setSearchTerm("");
      queryClient.invalidateQueries({
        queryKey: ["supplier-order-detail", orderId],
      });
    },
    onError: () => {
      message.error("Cập nhật số lượng thất bại");
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: "orange",
      PROCESSING: "blue",
      FINISHED: "green",
      CANCELLED: "red",
      SHIPPED: "purple",
    };
    return statusColors[status] || "default";
  };

  const getStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      PENDING: "Chờ xử lý",
      PROCESSING: "Đang xử lý",
      FINISHED: "Hoàn thành",
      CANCELLED: "Đã hủy",
      SHIPPED: "Đã giao hàng",
    };
    return statusTexts[status] || status;
  };

  const getPaymentStatus = (isPaid: boolean) => {
    return isPaid
      ? { text: "Đã thanh toán", color: "green" }
      : { text: "Chưa thanh toán", color: "red" };
  };

  const handlePriceUpdate = (itemId: string, price: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: price,
    }));
  };

  const submitPriceUpdates = () => {
    const items = Object.entries(selectedItems).map(
      ([supplyItemID, price]) => ({
        supplyItemID,
        price,
      })
    );

    if (items.length === 0) {
      message.warning("Vui lòng nhập giá cho ít nhất một sản phẩm");
      return;
    }

    const requestData: PriceUpdateRequest = {
      supplyOrderID: orderId as string,
      items,
    };

    updatePriceMutation.mutate(requestData);
  };

  const handleQuantityUpdate = (item: OrderItem) => {
    setEditingItem(item);
    setQuantityModalVisible(true);
    setSearchTerm("");
    setSelectedProduct(null);
  };

  const submitQuantityUpdate = () => {
    if (!editingItem || !selectedProduct) {
      message.warning("Vui lòng chọn sản phẩm mẫu");
      return;
    }

    const requestData: QuantityUpdateRequest = {
      supplyItemID: editingItem.id,
      productTemplateID: selectedProduct.id,
    };

    updateQuantityMutation.mutate(requestData);
  };

  const handleProductSelect = (product: ProductTemplate) => {
    setSelectedProduct(product);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price: number, record: OrderItem) => (
        <div className="flex items-center gap-2">
          <InputNumber
            value={selectedItems[record.id] ?? price}
            onChange={(value) => handlePriceUpdate(record.id, value || 0)}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
            min={0}
            className="w-32"
            size="small"
          />
          <span>đ</span>
        </div>
      ),
      align: "right" as const,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (record: OrderItem) => {
        const price = selectedItems[record.id] ?? record.price;
        return formatCurrency(price * record.quantity);
      },
      align: "right" as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (record: OrderItem) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleQuantityUpdate(record)}
            size="small"
          >
            Cập nhật SL
          </Button>
        </Space>
      ),
    },
  ];

  const paymentStatus = getPaymentStatus(orderData?.data?.is_paid ?? false);
  const hasPriceChanges = Object.keys(selectedItems).length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Chi tiết đơn hàng
              </h1>
              <p className="text-gray-600">
                Mã đơn hàng:{" "}
                <span className="font-mono">{orderData?.data?.id}</span>
              </p>
            </div>
            <Space>
              {hasPriceChanges && (
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={submitPriceUpdates}
                  loading={updatePriceMutation.isPending}
                >
                  Lưu giá
                </Button>
              )}
              <Button icon={<PrinterOutlined />}>In hóa đơn</Button>
              <Button type="primary" icon={<FileTextOutlined />}>
                Xuất PDF
              </Button>
            </Space>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={24}>
            {/* Order Summary */}
            <Card className="rounded-xl shadow-sm mb-4">
              <Descriptions
                title="Thông tin đơn hàng"
                bordered
                column={1}
                labelStyle={{ fontWeight: 600, width: "200px" }}
              >
                <Descriptions.Item label="Mã đơn hàng">
                  {orderData?.data.id}
                </Descriptions.Item>
                <Descriptions.Item label="Nhà cung cấp">
                  {orderData?.data.supplier_name}
                </Descriptions.Item>
                <Descriptions.Item label="Tiêu đề">
                  {orderData?.data.title}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái đơn hàng">
                  <Tag className="text-sm py-1">
                    {getStatusText(orderData?.data.status ?? "")}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái thanh toán">
                  <Tag color={paymentStatus.color} className="text-sm py-1">
                    {paymentStatus.text}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Order Items */}
            <Card
              title={
                <div className="flex justify-between items-center">
                  <span>Sản phẩm trong đơn hàng</span>
                  {hasPriceChanges && (
                    <Tag color="orange">Có thay đổi giá chưa lưu</Tag>
                  )}
                </div>
              }
              className="rounded-xl shadow-sm"
            >
              <Table
                columns={columns}
                dataSource={orderData?.data.items}
                pagination={false}
                rowKey="id"
                summary={() => (
                  <Table.Summary>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={4}>
                        <span className="font-bold">Tổng cộng</span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <span className="font-bold text-lg text-green-600">
                          {formatCurrency(orderData?.data.total_price ?? 0)}
                        </span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Modal cập nhật số lượng */}
        <Modal
          title="Cập nhật số lượng sản phẩm"
          open={quantityModalVisible}
          onCancel={() => {
            setQuantityModalVisible(false);
            setSelectedProduct(null);
            setSearchTerm("");
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setQuantityModalVisible(false);
                setSelectedProduct(null);
                setSearchTerm("");
              }}
            >
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={submitQuantityUpdate}
              loading={updateQuantityMutation.isPending}
              disabled={!selectedProduct}
            >
              Cập nhật
            </Button>,
          ]}
          width={600}
        >
          <div className="space-y-4">
            {/* Thông tin sản phẩm hiện tại */}
            {editingItem && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-2">Sản phẩm cần cập nhật:</h4>
                <p>
                  <strong>Tên:</strong> {editingItem.name}
                </p>
                <p>
                  <strong>Số lượng hiện tại:</strong> {editingItem.quantity}
                </p>
              </div>
            )}

            {/* Tìm kiếm sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm sản phẩm mẫu
              </label>
              <Input
                placeholder="Nhập tên sản phẩm để tìm kiếm..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </div>

            {/* Kết quả tìm kiếm */}
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              {searchLoading ? (
                <div className="flex justify-center p-4">
                  <Spin size="small" />
                </div>
              ) : searchResults?.data && searchResults.data.length > 0 ? (
                <List
                  dataSource={searchResults.data}
                  renderItem={(product) => (
                    <List.Item
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedProduct?.id === product.id
                          ? "bg-blue-50 border-blue-200"
                          : ""
                      }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex justify-between p-2">
                        <span className="font-medium">
                          {product.product_name}
                        </span>
                      </div>
                    </List.Item>
                  )}
                />
              ) : searchTerm ? (
                <div className="text-center py-8 text-gray-500">
                  Không tìm thấy sản phẩm phù hợp
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nhập từ khóa để tìm kiếm sản phẩm
                </div>
              )}
            </div>

            {/* Sản phẩm đã chọn */}
            {selectedProduct && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">
                  Sản phẩm đã chọn:
                </h4>
                <p>
                  <strong>Tên:</strong> {selectedProduct.product_name}
                </p>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default OrderDetailPage;
