"use client";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  MenuProps,
  Select,
} from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useState } from "react";

import { productModel } from "@/src/schemaValidations/product.schema";
import AddProductTemplate from "./ProductTemplateForm";

const url = {
  home: "/admin",
  list: "/admin/users",
  create: "/admin/users/create",
};
const breadcrumb: BreadcrumbItemType[] = [
  {
    href: url.home,
    title: <HomeOutlined />,
  },
  {
    href: url.list,
    title: (
      <>
        <UserOutlined />
        <span>Danh sách sản phẩm</span>
      </>
    ),
  },
  {
    title: "Nhập BoardGame",
  },
];
const items = [
  {
    value: 0,
    label: <span> Thêm mới hoàn toàn một sản phẩm </span>,
  },
  {
    value: 1,
    label: <span> Thêm một sản phẩm mẫu </span>,
  },
  {
    value: 2,
    label: <span> Thêm số lượng vào sản phẩm đã có </span>,
  },
];

const ProgressBar: React.FC<{ step: number; totalSteps: number }> = ({
  step,
  totalSteps,
}) => {
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          height: "10px",
          background: "#e0e0e0",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progressPercentage}%`,
            height: "100%",
            background: "#76c7c0",
            transition: "width 0.3s ease",
          }}
        ></div>
      </div>
      <p style={{ textAlign: "center", marginTop: "5px" }}>
        Bước {step} trên {totalSteps}
      </p>
    </div>
  );
};

export default function Add() {
  const[mode, setMode] = useState<number>(0);
  const [step, setStep] = useState(1);
  const [createdProduct, setCreatedProduct] = useState<
    productModel | undefined
  >(undefined);

  const handleNext = (product: productModel) => {
    setCreatedProduct(product);
    setStep(2);
    console.log("đã bước qua steff 2 này alo?", step);
    console.log("product: ", product);
  };
  // const handleCancel = () => {
  //     setStep(1);
  //     setCreatedProduct(undefined);
  // };
  // const onChange = (value: number) => {
  //     setMode(value);
  // }
  const pageTitle = () => {
    return (
      <div className="flex justify-between">
        <p>{items[mode].label}</p>

        {/* <Select className="w-75" options={items} onChange={(value) => onChange(value)}
                      menuItemSelectedIcon={<CiSettings />}
                      defaultValue={0} /> */}
      </div>
    );
  };
  return (
    <>
      <Breadcrumb items={breadcrumb} />
      <ConfigProvider prefixCls="form-ant">
        <Card title={pageTitle()}>
          <AddProductTemplate onNext={handleNext} />
        </Card>
      </ConfigProvider>
    </>
  );
}
