import { AppstoreOutlined, MailOutlined } from "@ant-design/icons";
import { Checkbox, Menu, MenuProps } from "antd";
import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "sub1",
    label: "Thể loại",
    icon: <MailOutlined />,
    children: [
      {
        key: "family",
        label: (
          <div>
            <Checkbox>Gia Đình</Checkbox>
          </div>
        ),
      },
      {
        key: "party",
        label: (
          <div>
            <Checkbox>Party</Checkbox>
          </div>
        ),
      },
      {
        key: "twoPlayer",
        label: (
          <div>
            <Checkbox>Hai người</Checkbox>
          </div>
        ),
      },
    ],
  },
  {
    key: "sub2",
    label: "Giá tiền",
    icon: <AppstoreOutlined />,
    children: [
      { key: "5", label: "Tất cả" },
      { key: "6", label: "Dưới 100,000đ" },
      { key: "7", label: "100,000đ - 500,000đ" },
      { key: "8", label: "500,000đ - 1,000,000đ" },
      { key: "9", label: "1,000,000đ - 5,000,000đ" },
      { key: "10", label: "5,000,000đ - 10,000,000đ" },
      { key: "11", label: "Trên 10,000,000đ" },
    ],
  },
  // {
  //   type: "divider",
  // },
  {
    key: "sub3",
    label: "Thời gian",
    icon: <AiOutlineClockCircle />,
    children: [
      { key: "15", label: "Tất cả" },
      { key: "16", label: "Dưới 30 phút" },
      { key: "17", label: "30 - 60 phút" },
      { key: "18", label: "60 - 120 phút" },
      { key: "19", label: "Trên 120 phút" },
    ],
  },
  {
    key: "sub4",
    label: "Số người chơi",
    icon: <BsPeople />,
    children: [
      { key: "20", label: "Tất cả" },
      { key: "21", label: "1 người" },
      { key: "22", label: "2 người" },
      { key: "23", label: "2-4 người" },
      { key: "24", label: "5-8 người" },
      { key: "25", label: "8+ người" },
    ],
  },
];

export default function CategoryFilter() {
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };
  return (
    <div className="">
      <Menu
        onClick={onClick}
        // defaultSelectedKeys={["1", "2"]}
        defaultOpenKeys={["sub1", "sub2"]}
        mode="inline"
        items={items}
      />
    </div>
  );
}
