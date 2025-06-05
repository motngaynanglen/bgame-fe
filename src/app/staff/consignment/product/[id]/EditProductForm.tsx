"use client";
import consignmentApiRequest from "@/src/apiRequests/consignment";
import { useAppContext } from "@/src/app/app-provider";
import { Button, Form, Input, message, Select } from "antd";
import React, { useState } from "react";
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

export default function EditProductForm({
  product,
  onClose,
  onSuccess,
}: {
  product: DataType;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState(product);
  const [loading, setLoading] = useState(false);
  const { user } = useAppContext();

  console.log("EditProductForm", product);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await consignmentApiRequest.updateConsignment(formData, user?.token);
      message.success("Cập nhật sản phẩm thành công");
      onSuccess();
      onClose();
    } catch (error) {
      message.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Tên sản phẩm">
        <Input
          defaultValue={formData?.product_name}
          onChange={(e) =>
            setFormData({ ...formData, product_name: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item label="Tình trạng">
        <Select
          value={formData?.condition}
          onChange={(value) => setFormData({ ...formData, condition: value })}
        >
          <Select.Option value={0}>New in Shrink</Select.Option>
          <Select.Option value={1}>Chưa qua sử dụng</Select.Option>
          <Select.Option value={2}>Đã qua sử dụng</Select.Option>
          <Select.Option value={3}>Tốt</Select.Option>
          <Select.Option value={4}>Khá</Select.Option>
          <Select.Option value={5}>Kém</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Thành phần bị thiếu">
        <Input
          value={formData?.missing}
          defaultValue={product?.missing}
          onChange={(e) =>
            setFormData({ ...formData, missing: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item label="Giá dự kiến">
        <Input
          type="number"
          value={formData?.expected_price}
          defaultValue={product?.expected_price}
          onChange={(e) =>
            setFormData({ ...formData, expected_price: +e.target.value })
          }
        />
      </Form.Item>
      <Form.Item label="Giá bán">
        <Input
          type="number"
          value={formData?.sale_price}
          defaultValue={product?.sale_price}
          onChange={(e) =>
            setFormData({ ...formData, sale_price: +e.target.value })
          }
        />
      </Form.Item>

      <Form.Item label="Hình ảnh">
        <Input
          value={formData?.images}
          defaultValue={product?.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          placeholder="Nhập URL hình ảnh"
        />
      </Form.Item>

      <Form.Item label="Trạng thái">
        <Select
          value={formData?.status}
          onChange={(value) => setFormData({ ...formData, status: value })}
        >
          <Select.Option value="available">Có sẵn</Select.Option>
          <Select.Option value="sold">Đã bán</Select.Option>
          <Select.Option value="pending">Đang chờ</Select.Option>
          <Select.Option value="cancelled">Đã hủy</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Tên khách hàng">
        <Input
          value={formData?.customer_name}
          defaultValue={product?.customer_name}
          onChange={(e) =>
            setFormData({ ...formData, customer_name: e.target.value })
          }
          placeholder="Nhập tên khách hàng"
        />
      </Form.Item>

      <Form.Item label="Số điện thoại">
        <Input
          value={formData?.phone_number}
          defaultValue={product?.phone_number}
          onChange={(e) =>
            setFormData({ ...formData, phone_number: e.target.value })
          }
          placeholder="Nhập số điện thoại"
        />
      </Form.Item>

      <Form.Item label="Email">
        <Input
          value={formData?.email}
          defaultValue={product?.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Nhập email"
        />
      </Form.Item>

      <Form.Item label="Mô tả">
        <Input.TextArea
          rows={4}
          value={formData?.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </Form.Item>

      <div style={{ textAlign: "right" }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          Hủy
        </Button>
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          Lưu thay đổi
        </Button>
      </div>
    </Form>
  );
}
