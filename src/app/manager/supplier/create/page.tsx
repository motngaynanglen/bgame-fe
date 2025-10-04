"use client";
import React, { useState } from "react";
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
  Upload,
  Select,
} from "antd";
import {
  ShopOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import storeApiRequest from "@/src/apiRequests/stores";
import {
  notifyError,
  notifySuccess,
} from "@/src/components/Notification/Notification";
import supplierApiRequest from "@/src/apiRequests/supplier";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateStorePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Format data theo API requirement
      const supplierData = {
        supplierName: values.storeName,
        address: values.address,
        phoneNumber: values.hotline,
        lattitude: values.lattitude,
        longtitude: values.longtitude,
        email: values.email,
      };

      console.log("Store data to submit:", supplierData);

      //

      try {
        const res = await supplierApiRequest.create(supplierData);
        console.log("status", res);
        if (res.statusCode === "200") {
          notifySuccess(res.message);
        }
        if (res.statusCode === "404") {
          notifyError(res.message);
        }
      } catch (error) {
        console.log("Lỗi đăng ký:", error);
      }

      message.success("Lưu nhà cung cấp thành công!");
      form.resetFields();
      setImageUrl("");
    } catch (error) {
      message.error("Lưu nhà cung cấp thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = () => {
    // Mở Google Maps để chọn tọa độ
    window.open("https://www.google.com/maps", "_blank");
  };

  // Upload handler (optional)
  const handleUpload = (info: any) => {
    // Xử lý upload ảnh ở đây
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">
            Lưu Nhà Cung Cấp Mới
          </Title>
        </div>

        <Card className="rounded-2xl shadow-lg border-0">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="p-6"
          >
            {/* Store Basic Information */}
            <Divider orientation="left">
              <ShopOutlined className="mr-2" />
              Thông tin cơ bản
            </Divider>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="storeName"
                  label="Tên nhà cung cấp"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên nhà cung cấp" },
                    { max: 100, message: "Tên nhà cung cấp không quá 100 ký tự" },
                  ]}
                >
                  <Input
                    prefix={<ShopOutlined />}
                    placeholder="VD: Board Game Hub"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="VD: contact@store.com"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="hotline"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^[0-9+\-() ]+$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="VD: 0123456789"
                size="large"
              />
            </Form.Item>

            {/* Address Information */}
            <Divider orientation="left">
              <EnvironmentOutlined className="mr-2" />
              Địa chỉ và tọa độ
            </Divider>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ" },
                { max: 200, message: "Địa chỉ không quá 200 ký tự" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="VD: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh"
                size="large"
              />
            </Form.Item>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="lattitude"
                  label="Vĩ độ (Latitude)"
                  rules={[
                    { required: true, message: "Vui lòng nhập vĩ độ" },
                    {
                      pattern: /^-?\d+(\.\d+)?$/,
                      message: "Vĩ độ không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    placeholder="VD: 10.823099"
                    size="large"
                    suffix={
                      <Button
                        type="link"
                        size="small"
                        onClick={handleMapClick}
                        icon={<EnvironmentOutlined />}
                      >
                        Lấy tọa độ
                      </Button>
                    }
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="longtitude"
                  label="Kinh độ (Longitude)"
                  rules={[
                    { required: true, message: "Vui lòng nhập kinh độ" },
                    {
                      pattern: /^-?\d+(\.\d+)?$/,
                      message: "Kinh độ không hợp lệ",
                    },
                  ]}
                >
                  <Input placeholder="VD: 106.629662" size="large" />
                </Form.Item>
              </Col>
            </Row>

            {/* Submit Button */}
            <Form.Item className="text-center mt-8">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="min-w-[200px] h-12 text-lg"
              >
                Tạo nhà cung cấp
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 rounded-2xl shadow-sm border-0">
          <Title level={4}>Hướng dẫn</Title>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>Lấy tọa độ:</strong> Nhấn Lấy tọa độ để mở Google Maps
              và chọn vị trí chính xác
            </p>
            <p>
              • <strong>Vĩ độ/Kinh độ:</strong> Sử dụng định dạng số thập phân
              (VD: 10.823099, 106.629662)
            </p>
            <p>
              • <strong>Email:</strong> Sẽ được dùng để nhận thông báo và liên
              hệ
            </p>
            <p>
              • <strong>Số điện thoại:</strong> Khách hàng sẽ gọi đến số này để
              đặt bàn
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateStorePage;
