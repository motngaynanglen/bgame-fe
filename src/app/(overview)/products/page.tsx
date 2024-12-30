"use client";
import CardProduct from "@/src/components/Products/CardProduct";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps, Layout, Breadcrumb, Pagination, Rate } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "sub1",
    label: "Category",
    icon: <MailOutlined />,
    children: [
      {
        key: "g1",
        label: "Item 1",
        type: "group",
        children: [
          { key: "1", label: "Option 1" },
          { key: "2", label: "Option 2" },
        ],
      },
      {
        key: "g2",
        label: "Item 2",
        type: "group",
        children: [
          { key: "3", label: "Option 3" },
          { key: "4", label: "Option 4" },
        ],
      },
    ],
  },
  {
    key: "sub2",
    label: "Price",
    icon: <AppstoreOutlined />,
    children: [
      { key: "5", label: "Option 5" },
      { key: "6", label: "Option 6" },
      {
        key: "sub3",
        label: "Submenu",
        children: [
          { key: "7", label: "Option 7" },
          { key: "8", label: "Option 8" },
        ],
      },
    ],
  },
  // {
  //   type: "divider",
  // },
  {
    key: "sub4",
    label: "Rating",
    icon: <SettingOutlined />,
    children: [
      { key: "one", label: <Rate disabled defaultValue={5} /> },
      { key: "two", label: <Rate disabled defaultValue={4} /> },
      { key: "three", label: <Rate disabled defaultValue={3} /> },
      { key: "four", label: <Rate disabled defaultValue={2} /> },
      { key: "five", label: <Rate disabled defaultValue={1} /> },

    ],
  },
  
];

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    size: [],
    color: [],
    priceRange: [0, 100],
  });

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  const sizes = ["Small", "Medium", "Large"];
  const colors = ["Red", "Blue", "Green"];

  return (
    <div className="flex ">
      {/* Sidebar */}
      <Layout>
        <Sider className="h-screen w-20" width={250} theme="light">
          <Menu
            onClick={onClick}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Content>
            <main className=" p-4">
              <div className=" text-white p-4 flex justify-between items-center bg-gradient-to-r from-green-500 to-blue-500 rounded-md mb-2">
                <h1 className="text-xl font-bold">Hot deal</h1>
              </div>
              {/* Product Cards */}
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <CardProduct
                    key={index}
                    image="/assets/images/tqs.jpg"
                    price={800000}
                    title="Tam quốc sát"
                  />
                ))}
              </div>
              {/* Pagination */}
              <Pagination className="m-5" align="center" defaultCurrent={1} total={50} />
            </main>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
