"use client";
import React, { useState, useEffect, use } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Typography,
  Divider,
  Descriptions,
  Switch,
  Spin,
  Tabs,
  Modal,
} from "antd";
import {
  ShopOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import storeApiRequest from "@/src/apiRequests/stores";
import { useAppContext } from "@/src/app/app-provider";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface StoreData {
  id: string;
  storeName: string;
  address: string;
  hotline: string;
  lattitude: string;
  longtitude: string;
  email: string;
  isActive?: boolean;
  description?: string;
  openingHours?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface responseModel {
  data: StoreData;
  message: string;
  statusCode: number;
  paging: null;
}

const StoreDetailPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const { storeId } = useParams();
  const { user } = useAppContext();
  console.log("storeId from params:", storeId);

  // Fetch store data
  useEffect(() => {
    fetchStoreData();
  }, [storeId]);

  const fetchStoreData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      const mockData: StoreData = {
        id: storeId as string,
        storeName: "Board Game Hub",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        hotline: "0123456789",
        lattitude: "10.823099",
        longtitude: "106.629662",
        email: "contact@boardgamehub.com",
        isActive: true,
        description:
          "Cửa hàng board game lớn nhất TP.HCM với hơn 1000 tựa game",
        openingHours: "8:00 - 22:00 (Thứ 2 - Chủ nhật)",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-15",
      };
      setStoreData(mockData);
      form.setFieldsValue(mockData);
    } catch (error) {
      message.error("Không thể tải thông tin cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  // const { data, isLoading, isError, error } = useQuery<responseModel>({
  //   queryKey: ["boardgameByID", storeId],
  //   queryFn: async () => {
  //     if (!user?.token) {
  //       throw new Error("User token is not available");
  //     }
  //     return await storeApiRequest.getStoreId(user.token, storeId as string);
  //   },
  //   enabled: !!storeId && !!user?.token,
  // });

  // console.log("Fetched store data:", data);

  // if (isError) {
  //   message.error("Lỗi khi tải dữ liệu cửa hàng: " + (error as Error).message);
  // }

  const handleSave = async (values: any) => {
    setSaving(true);
    try {
      // API call to update store
      const updateData = {
        ...values,
        id: storeId,
      };

      console.log("Update data:", updateData);
      // await updateStoreApi(updateData);

      message.success("Cập nhật thông tin thành công!");
      setEditing(false);
      setStoreData((prev) => ({ ...prev, ...values }));
    } catch (error) {
      message.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    form.setFieldsValue(storeData);
    setEditing(false);
  };

  const handleStatusChange = async (checked: boolean) => {
    try {
      // await updateStoreStatusApi(storeId, checked);
      setStoreData((prev) => (prev ? { ...prev, isActive: checked } : null));
      message.success(
        checked ? "Đã kích hoạt cửa hàng" : "Đã vô hiệu hóa cửa hàng"
      );
    } catch (error) {
      message.error("Thay đổi trạng thái thất bại");
    }
  };

  const handleDeleteStore = () => {
    Modal.confirm({
      title: "Xác nhận xóa cửa hàng",
      content:
        "Bạn có chắc chắn muốn xóa cửa hàng này? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // await deleteStoreApi(storeId);
          message.success("Đã xóa cửa hàng thành công");
          // navigate back to stores list
        } catch (error) {
          message.error("Xóa cửa hàng thất bại");
        }
      },
    });
  };

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Text type="secondary">Không tìm thấy cửa hàng</Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="!mb-1">
              {storeData.storeName}
            </Title>
            <Text type="secondary">Quản lý thông tin cửa hàng</Text>
          </div>

          <div className="flex gap-2">
            <Switch
              checkedChildren="Hoạt động"
              unCheckedChildren="Tạm đóng"
              checked={storeData.isActive}
              onChange={handleStatusChange}
              className="mr-2"
            />

            {!editing ? (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setEditing(true)}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button icon={<CloseOutlined />} onClick={handleCancelEdit}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={saving}
                  onClick={() => form.submit()}
                >
                  Lưu thay đổi
                </Button>
              </>
            )}

            {/* <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeleteStore}
            >
              Xóa
            </Button> */}
          </div>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* Tab Chi tiết */}
          <TabPane tab=" Thông tin chi tiết" key="details">
            <Card className="rounded-2xl shadow-lg border-0">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                disabled={!editing}
              >
                <Row gutter={[24, 0]}>
                  <Col xs={24} lg={12}>
                    {/* Store Basic Info */}
                    <Divider orientation="left">Thông tin cơ bản</Divider>

                    <Form.Item
                      name="storeName"
                      label="Tên cửa hàng"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên cửa hàng",
                        },
                      ]}
                    >
                      <Input prefix={<ShopOutlined />} size="large" />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} size="large" />
                    </Form.Item>

                    <Form.Item
                      name="hotline"
                      label="Số điện thoại"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                      ]}
                    >
                      <Input prefix={<PhoneOutlined />} size="large" />
                    </Form.Item>

                    <Form.Item name="openingHours" label="Giờ mở cửa">
                      <Input size="large" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={12}>
                    {/* Location Info */}
                    <Divider orientation="left">Địa chỉ và tọa độ</Divider>

                    <Form.Item
                      name="address"
                      label="Địa chỉ"
                      rules={[
                        { required: true, message: "Vui lòng nhập địa chỉ" },
                      ]}
                    >
                      <TextArea rows={3} size="large" />
                    </Form.Item>

                    <Row gutter={[12, 0]}>
                      <Col xs={12}>
                        <Form.Item
                          name="lattitude"
                          label="Vĩ độ"
                          rules={[
                            { required: true, message: "Vui lòng nhập vĩ độ" },
                          ]}
                        >
                          <Input size="large" />
                        </Form.Item>
                      </Col>
                      <Col xs={12}>
                        <Form.Item
                          name="longtitude"
                          label="Kinh độ"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập kinh độ",
                            },
                          ]}
                        >
                          <Input size="large" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name="description" label="Mô tả cửa hàng">
                      <TextArea rows={4} size="large" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </TabPane>

          {/* Tab Xem trước */}
          <TabPane tab=" Xem trước" key="preview">
            <Card className="rounded-2xl shadow-lg border-0">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Tên cửa hàng">
                  {storeData.storeName}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {storeData.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {storeData.hotline}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {storeData.address}
                </Descriptions.Item>
                <Descriptions.Item label="Tọa độ">
                  {storeData.lattitude}, {storeData.longtitude}
                </Descriptions.Item>
                <Descriptions.Item label="Giờ mở cửa">
                  {storeData.openingHours || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                  {storeData.description || "Chưa có mô tả"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <span
                    className={
                      storeData.isActive ? "text-green-600" : "text-red-600"
                    }
                  >
                    {storeData.isActive ? "Đang hoạt động" : "Tạm đóng"}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {storeData.createdAt}
                </Descriptions.Item>
                <Descriptions.Item label="Cập nhật cuối">
                  {storeData.updatedAt}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </TabPane>
        </Tabs>

        {/* Map Preview */}
        <Card className="mt-6 rounded-2xl shadow-lg border-0">
          <Title level={4} className="!mb-4">
            <EnvironmentOutlined className="mr-2" />
            Vị trí trên bản đồ
          </Title>
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <Text type="secondary">
              <EyeOutlined className="mr-2" />
              Bản đồ sẽ hiển thị tại đây ({storeData.lattitude},{" "}
              {storeData.longtitude})
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StoreDetailPage;
