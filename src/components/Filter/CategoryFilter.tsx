import { AppstoreOutlined, MailOutlined } from "@ant-design/icons";
import { Menu, MenuProps, Button, Tag, Slider } from "antd";
import React, { useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";

type MenuItem = Required<MenuProps>["items"][number];

export default function CategoryFilter() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Hàm xử lý chọn tag
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setSelectedTags((prev) =>
      prev.includes(e.key)
        ? prev.filter((tag) => tag !== e.key)
        : [...prev, e.key]
    );
  };

  // Định nghĩa menu
  const items: MenuItem[] = [
    {
      key: "sub1",
      label: "Thể loại",
      icon: <MailOutlined />,
      children: [
        { key: "Gia đình", label: "Gia đình" },
        { key: "Party", label: "Party" },
        { key: "Hai Người", label: "Hai người" },
      ],
    },
    // {
    //   key: "sub2",
    //   label: "Giá tiền",
    //   icon: <AppstoreOutlined />,
    //   children: [
    //     { key: "money", label: "money" },
    //     {
    //       key: "slider",
    //       label: <PriceRangeSlider />,
    //     },
    //   ],
    //   // children: [
    //   //   // { key: "5", label: "Tất cả" },
    //   //   { key: "Dưới 100,000đ", label: "Dưới 100,000đ" },
    //   //   { key: "100,000đ - 500,000đ", label: "100,000đ - 500,000đ" },
    //   //   { key: "500,000đ - 1,000,000đ", label: "500,000đ - 1,000,000đ" },
    //   //   { key: "1,000,000đ - 5,000,000đ", label: "1,000,000đ - 5,000,000đ" },
    //   //   { key: "5,000,000đ - 10,000,000đ", label: "5,000,000đ - 10,000,000đ" },
    //   //   { key: "Trên 10,000,000đ", label: "Trên 10,000,000đ" },
    //   // ],
    // },
    {
      key: "sub3",
      label: "Thời gian",
      icon: <AiOutlineClockCircle />,
      children: [
        // { key: "15", label: "Tất cả" },
        { key: "Dưới 30 phút", label: "Dưới 30 phút" },
        { key: "30 - 60 phút", label: "30 - 60 phút" },
        { key: "60 - 120 phút", label: "60 - 120 phút" },
        { key: "Trên 120 phút", label: "Trên 120 phút" },
      ],
    },
    {
      key: "sub4",
      label: "Số người chơi",
      icon: <BsPeople />,
      children: [
        { key: "Tất cả", label: "Tất cả" },
        { key: "1 người", label: "1 người" },
        { key: "2 người", label: "2 người" },
        { key: "2-4 người", label: "2-4 người" },
        { key: "5-8 người", label: "5-8 người" },
        { key: "8+ người", label: "8+ người" },
      ],
    },
  ];

  return (
    <div className="relative">
      {/* Phần hiển thị tags đã chọn */}
      <div className="sticky top-0 bg-white p-3 shadow-md z-10">
        <p className="font-semibold">Mục :</p>
        <div className="flex flex-wrap ">
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => (
              <Tag closeIcon key={tag} color="green">
                {tag}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400 text-sm">Chưa chọn</span>
          )}
        </div>
        <Button
          type="primary"
          className="mt-2 w-full"
          onClick={() => console.log("Tags selected:", selectedTags)}
        >
          Áp dụng bộ lọc
        </Button>
      </div>
      <div className="p-2">
        <p className="text-sm text-gray-500 mb-2">Chọn khoảng giá</p>
        <PriceRangeSlider />
      </div>
      {/* Menu */}
      <Menu
        onClick={handleMenuClick}
        defaultOpenKeys={["sub1", "sub2", "sub3", "sub4"]}
        mode="inline"
        items={items}
      />
    </div>
  );
}

export function PriceRangeSlider() {
  const [range, setRange] = useState<[number, number]>([0, 5000000]);

  const handleChange = (value: number[]) => {
    setRange([value[0], value[1]]);
  };

  return (
    <div className="">
      <Slider
        range
        min={0}
        max={5000000}
        step={10000}
        value={range}
        onChange={handleChange}
        tooltip={{ formatter: (value) => `${value?.toLocaleString()}đ` }}
      />

      <div className="flex justify-between text-sm text-gray-700 mt-3">
        <div>
          <strong>Min:</strong> {range[0].toLocaleString()}đ
        </div>
        <div>
          <strong>Max:</strong> {range[1].toLocaleString()}đ
        </div>
      </div>

      <form>
        <input type="hidden" name="min-value" value={range[0]} />
        <input type="hidden" name="max-value" value={range[1]} />
      </form>
    </div>
  );
}
