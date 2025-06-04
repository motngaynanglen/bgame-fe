"use client";
import { Button, Col, Form, Input, Row, Space, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { useState } from "react";
import { RcFile, UploadFile } from "antd/es/upload";

interface StoreFormValues {
  code: string;
  store_name: string;
  imageFiles?: UploadFile[];
  address: string;
  hotline: string;
  longitude: string;
  latitude: string;
  email: string;
  status: string;
  max_slot_per_day: number;
  created_by: string;
  updated_by: string;
  image: string;
}

const defaultValues: StoreFormValues = {
  code: "",
  store_name: "",
  imageFiles: [],
  image: "",
  address: "",
  hotline: "",
  longitude: "",
  latitude: "",
  email: "",
  status: "",
  max_slot_per_day: 0,
  created_by: "",
  updated_by: "",
};

function ManagerInfoForm({ control }: { control: any }) {
  return (
    <>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <FormItem control={control} name="created_by" label="Người tạo" layout="vertical">
            <Input disabled />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem control={control} name="updated_by" label="Người cập nhật" layout="vertical">
            <Input disabled />
          </FormItem>
        </Col>
      </Row>
    </>
  );
}

function StoreInfoForm({ control, watch, setValue }: { control: any, watch: any, setValue: any }) {
  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setValue("imageFiles", fileList);
  };

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <FormItem control={control} name="store_name" label="Tên cửa hàng" layout="vertical">
            <Input />
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem control={control} name="code" label="Mã cửa hàng" layout="vertical">
            <Input />
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem control={control} name="hotline" label="Hotline" layout="vertical">
            <Input />
          </FormItem>
        </Col>

        <Col span={12}>
          <FormItem control={control} name="address" label="Địa chỉ" layout="vertical">
            <Input />
          </FormItem>
        </Col>

        <Col span={6}>
          <FormItem control={control} name="longitude" label="Kinh độ" layout="vertical">
            <Input />
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem control={control} name="latitude" label="Vĩ độ" layout="vertical">
            <Input />
          </FormItem>
        </Col>

        <Col span={6}>
          <FormItem control={control} name="email" label="Email" layout="vertical">
            <Input />
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem control={control} name="status" label="Trạng thái" layout="vertical">
            <Input />
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem control={control} name="max_slot_per_day" label="Số lượt chơi tối đa mỗi ngày" layout="vertical">
            <Input type="number" />
          </FormItem>
        </Col>

        <Col span={24}>
          <Controller
            name="imageFiles"
            control={control}
            render={({ field }) => (
              <Form.Item label="Hình ảnh" layout="vertical">
                <Upload
                  listType="picture"
                  multiple
                  maxCount={10}
                  fileList={field.value}
                  onChange={handleFileChange}
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith("image/");
                    if (!isImage) {
                      message.error("Chỉ được upload ảnh.");
                      return Upload.LIST_IGNORE;
                    }
                    return true;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
              </Form.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
}