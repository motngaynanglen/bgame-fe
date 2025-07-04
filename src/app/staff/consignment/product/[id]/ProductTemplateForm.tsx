import { formatVND } from "@/src/lib/utils";
import {
    EditOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Collapse,
    Divider,
    Drawer,
    Empty,
    Image,
    message,
    Row,
    Space,
    Tag,
    Typography,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import EditProductForm from "./EditProductForm";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface DataType {
  key: string;
  id: string;
  product_name: string;
  description: string;
  condition: number;
  missing: string;
  expected_price: number;
  sale_price: number;
  images: string;
  status: string;
  customer_name?: string;
  phone_number?: string;
  email?: string;
  created_at?: string;
  created_by?: string;
}

export default function ProductDetailView({ product }: { product: DataType }) {
  console.log("ProductDetailView", product);
  const [showDetails, setShowDetails] = useState(true);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);
  const router = useRouter();

  useEffect(() => {
  if (product) {
    setCurrentProduct(product);
  }
}, [product]);

  const handleUpdateSuccess = () => {
    // Gọi lại API hoặc cập nhật state nếu cần
    // Ví dụ: fetch lại data hoặc dùng response từ API trả về
    message.success("Dữ liệu đã được cập nhật");
  };

  if (!product) {
    return null;
  }
  const images = product.images?.split("||").filter(Boolean) || [];

  // Format giá tiền và xử lý trường null
  const formatField = (value: any) => {
    if (value === null || value === undefined || value === "") {
      return (
        <Text type="warning">
          <ExclamationCircleOutlined /> Cần bổ sung
        </Text>
      );
    }
    return typeof value === "number" ? formatVND(value) : value;
  };

  // Thông tin cơ bản
  const getConditionTag = (condition: number) => {
    switch (condition) {
      case 0:
        return { color: "green", label: "New in shink" };
      case 1:
        return { color: "darkreen", label: "Chưa qua sử dụng" };
      case 2:
        return { color: "purple", label: "Đã qua sử dụng" };
      case 3:
        return { color: "purple", label: "Tốt" };
      case 3:
        return { color: "purple", label: "Khá" };
      case 5:
        return { color: "purple", label: "Kém" };
      default:
        return { color: "orange", label: "Mẫu" };
    }
  };
  const conditionTag = getConditionTag(product.condition);

  type BasicInfoItem = {
    label: string;
    value: React.ReactNode;
    copyable?: boolean;
  };

  const basicInfo: BasicInfoItem[] = [
    // { label: "Mã sản phẩm", value: product.code, copyable: true },
    { label: "Tên sản phẩm", value: product.product_name },
    // {
    //   label: "Loại sản",
    //   value: <Tag color={conditionTag.color}> {conditionTag.label}</Tag>,
    // },
    {
      label: "Trạng thái",
      value: (
        <Tag color={product.status === "ACTIVE" ? "green" : "red"}>
          {product.status === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động"}
        </Tag>
      ),
    },
    {
      label: "Tình trạng",
      value: <Tag color={conditionTag.color}> {conditionTag.label}</Tag>,
    },
    {
      label: "Thành phần bị thiếu",
      value: product.missing || "Không có thông tin",
    },
  ];

  // Thông tin giá
  //   const priceInfo = [
  //     { label: "Giá bán", value: formatField(product.price) },
  //     { label: "Giá thuê", value: formatField(product.rent_price) },
  //     {
  //       label: "Giá thuê theo giờ",
  //       value: formatField(product.rent_price_per_hour),
  //     },
  //   ];

  // Thông tin khách hàng kí gửi
  const additionalInfo = [
    { label: "Tên người kí gửi", value: formatField(product.customer_name) },
    { label: "Số điện thoại", value: formatField(product.phone_number) },
    {
      label: "Email",
      value: formatField(product.email),
    },
    {
      label: "Ngày tạo",
      value: formatField(
        product.created_at
          ? new Date(product.created_at).toLocaleDateString("vi-VN")
          : null
      ),
    },
    // {
    //   label: "Người tạo",
    //   value: formatField(product.created_by),
    // },
  ];
  const DetailsHeader = () => {
    return (
      /* Header với nút toggle */
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={3}>Chi tiết sản phẩm</Title>
        {/* <Button
                    type="text"
                    icon={showDetails ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? 'Ẩn chi tiết' : 'Hiện chi tiết'}
                </Button> */}
      </div>
    );
  };
  return (
    <div style={{ margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Collapse activeKey={showDetails ? ["details"] : []} bordered={false}>
          <Panel key="details" showArrow={false} header={<DetailsHeader />}>
            <Row gutter={24} align="stretch">
              {/* Cột hình ảnh */}
              <Col xs={24} md={12}>
                <Card style={{ height: "100%" }}>
                  {images.length > 0 ? (
                    <>
                      <Image.PreviewGroup items={images}>
                        <Image
                          src={images[0]}
                          alt="Ảnh đại diện"
                          style={{
                            width: "100%",
                            height: 300,
                            objectFit: "contain",
                            borderRadius: 8,
                            marginBottom: 16,
                          }}
                        />
                      </Image.PreviewGroup>

                      <div style={{ marginTop: "auto" }}>
                        <Image.PreviewGroup items={images}>
                          <Row gutter={8}>
                            {images.slice(1).map((img, index) => (
                              <Col key={index} span={6}>
                                <Image
                                  src={img}
                                  alt={`Ảnh ${index + 2}`}
                                  style={{
                                    width: "100%",
                                    height: 80,
                                    objectFit: "cover",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                  }}
                                />
                              </Col>
                            ))}
                          </Row>
                        </Image.PreviewGroup>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Không có hình ảnh"
                      />
                      <Text type="warning" style={{ marginTop: 8 }}>
                        <ExclamationCircleOutlined /> Cần bổ sung hình ảnh
                      </Text>
                    </div>
                  )}
                  <Divider style={{ margin: "8px 0" }} />
                  {/* Mô tả sản phẩm */}
                  <div>
                    <Title level={5} style={{ marginBottom: 16 }}>
                      Mô tả sản phẩm{" "}
                    </Title>
                    {product.description ? (
                      <Card title="Mô tả sản phẩm" style={{ marginTop: 24 }}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: product.description,
                          }}
                          style={{
                            lineHeight: 1.8,
                            wordBreak: "break-word",
                          }}
                        />
                      </Card>
                    ) : (
                      formatField(product.description)
                    )}
                  </div>
                </Card>
              </Col>

              {/* Cột thông tin */}
              <Col xs={24} md={12}>
                <Card style={{ height: "100%" }}>
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    {/* Thông tin cơ bản */}
                    <div>
                      <Title level={5} style={{ marginBottom: 16 }}>
                        Thông tin sản phẩm
                      </Title>
                      {basicInfo.map((item, index) => (
                        <Paragraph key={index} style={{ marginBottom: 12 }}>
                          <Text strong>{item.label}: </Text>
                          {item.copyable ? (
                            <Text copyable>{item.value}</Text>
                          ) : (
                            <Text>{item.value}</Text>
                          )}
                        </Paragraph>
                      ))}
                    </div>

                    {/* <Divider style={{ margin: '8px 0' }} /> */}

                    {/* Thông tin giá */}
                    {/* <div>
                                            <Title level={5} style={{ marginBottom: 16 }}>Thông tin giá</Title>
                                            {priceInfo.map((item, index) => (
                                                <Paragraph key={index} style={{ marginBottom: 12 }}>
                                                    <Text strong>{item.label}: </Text>
                                                    <Text>{item.value}</Text>
                                                </Paragraph>
                                            ))}
                                        </div> */}

                    <Divider style={{ margin: "8px 0" }} />

                    {/* Thông tin bổ sung */}
                    <div>
                      <Title level={5} style={{ marginBottom: 16 }}>
                        Thông tin khách hàng kí gửi
                      </Title>
                      {additionalInfo.map((item, index) => (
                        <Paragraph key={index} style={{ marginBottom: 12 }}>
                          <Text strong>{item.label}: </Text>
                          <Text>{item.value}</Text>
                        </Paragraph>
                      ))}
                    </div>

                    {/* Nút chỉnh sửa */}
                    <div style={{ marginTop: "auto", textAlign: "right" }}>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => setEditDrawerVisible(true)}
                      >
                        Chỉnh sửa sản phẩm
                      </Button>
                    </div>
                    <Drawer
                      title="Chỉnh sửa sản phẩm"
                      width={720}
                      open={editDrawerVisible}
                      onClose={() => setEditDrawerVisible(false)}
                      destroyOnClose
                    >
                      <EditProductForm
                        product={currentProduct}
                        onClose={() => setEditDrawerVisible(false)}
                        onSuccess={handleUpdateSuccess}
                      />
                    </Drawer>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </Space>
    </div>
  );
}
