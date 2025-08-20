import { formatVND } from "@/src/lib/utils";
import { AppstoreOutlined, MailOutlined } from "@ant-design/icons";
import { Menu, MenuProps, Button, Tag, Slider, Checkbox } from "antd";
import { format } from "path";
import React, { useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import dynamic from "next/dynamic";

type MenuItem = Required<MenuProps>["items"][number];

export default function CategoryFilter() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCheckboxChange = (value: string) => {
    setSelectedItems((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Hàm xử lý chọn tag
  // const handleMenuClick: MenuProps["onClick"] = (e) => {
  //   setSelectedTags((prev) =>
  //     prev.includes(e.key)
  //       ? prev.filter((tag) => tag !== e.key)
  //       : [...prev, e.key]
  //   );
  // };

  const filterConfig = [
    {
      key: "available",
      label: "Khả dụng",
      icon: <AppstoreOutlined />,
      options: [
        { value: "available", label: "Còn hàng" },
        // { value: "unavailable", label: "Hết hàng" },
      ],
    },
    {
      key: "play_time",
      label: "Thời gian Chơi",
      icon: <AiOutlineClockCircle />,
      options: [
        { value: "30", label: "30 phút trở xuống" },
        { value: "60", label: "60 phút trở xuống" },
        { value: "120", label: "120 phút trở xuống" },
        { value: "121", label: "Trên 120 phút" },
      ],
    },
    {
      key: "min_players",
      label: "Số người chơi tối thiểu",
      icon: <BsPeople />,
      options: [
        { value: "0", label: "Tất cả" },
        { value: "1", label: "1 người" },
        { value: "2", label: "2 người" },
        { value: "3", label: "3 người" },
        { value: "4", label: "4 người" },
        { value: "5", label: "5 người" },
        { value: "6", label: "6 người" },
        { value: "7", label: "7+ người" },
      ],
    },
    {
      key: "max_players",
      label: "Số người chơi tối đa",
      icon: <BsPeople />,
      options: [
        { value: "0", label: "Tất cả" },
        { value: "1", label: "1 người" },
        { value: "2", label: "2 người" },
        { value: "3", label: "3 người" },
        { value: "4", label: "4 người" },
        { value: "5", label: "5 người" },
        { value: "6", label: "6 người" },
        { value: "7", label: "7+ người" },
      ],
    },
    {
      key: "min_age",
      label: "Độ tuổi tối thiểu",
      icon: <BsPeople />,
      options: [
        { value: "0", label: "Tất cả" },
        { value: "3", label: "3+" },
        { value: "6", label: "6+" },
        { value: "8", label: "8+" },
        { value: "10", label: "10+" },
        { value: "12", label: "12+" },
        { value: "14", label: "14+" },
        { value: "16", label: "16+" },
        { value: "18", label: "18+" },
      ],
    },
  ];

  // Định nghĩa menu
  // const items: MenuItem[] = [
  //   // {
  //   //   key: "sub1",
  //   //   label: "Thể loại",
  //   //   icon: <MailOutlined />,
  //   //   children: [
  //   //     { key: "Gia đình", label: "Gia đình" },
  //   //     { key: "Party", label: "Party" },
  //   //     { key: "Hai Người", label: "Hai người" },
  //   //   ],
  //   // },
  //   // {
  //   //   key: "sub2",
  //   //   label: "Giá tiền",
  //   //   icon: <AppstoreOutlined />,
  //   //   children: [
  //   //     { key: "money", label: "money" },
  //   //     {
  //   //       key: "slider",
  //   //       label: <PriceRangeSlider />,
  //   //     },
  //   //   ],
  //   //   // children: [
  //   //   //   // { key: "5", label: "Tất cả" },
  //   //   //   { key: "Dưới 100,000đ", label: "Dưới 100,000đ" },
  //   //   //   { key: "100,000đ - 500,000đ", label: "100,000đ - 500,000đ" },
  //   //   //   { key: "500,000đ - 1,000,000đ", label: "500,000đ - 1,000,000đ" },
  //   //   //   { key: "1,000,000đ - 5,000,000đ", label: "1,000,000đ - 5,000,000đ" },
  //   //   //   { key: "5,000,000đ - 10,000,000đ", label: "5,000,000đ - 10,000,000đ" },
  //   //   //   { key: "Trên 10,000,000đ", label: "Trên 10,000,000đ" },
  //   //   // ],
  //   // },
  //   {
  //     key: "sub2",
  //     label: "Còn hàng",
  //     icon: <AppstoreOutlined />,
  //   },
  //   {
  //     key: "sub3",
  //     label: "Thời gian Chơi",
  //     icon: <AiOutlineClockCircle />,
  //     children: [
  //       // { key: "15", label: "Tất cả" },
  //       {
  //         key: "30",
  //         label: (
  //           <Checkbox
  //             checked={selectedItems.includes("30")}
  //             onChange={() => handleCheckboxChange("30")}
  //           >
  //             30 phút trở xuống
  //           </Checkbox>
  //         ),
  //       },
  //       { key: "60", label: "60 phút trở xuống" },
  //       { key: "120", label: "120 phút trở xuống" },
  //       { key: "121", label: "Trên 120 phút" },
  //     ],
  //   },
  //   {
  //     key: "sub4",
  //     label: "Số người chơi tối thiểu",
  //     icon: <BsPeople />,
  //     children: [
  //       { key: "0", label: "Tất cả" },
  //       { key: "1", label: "1 người" },
  //       { key: "2", label: "2 người" },
  //       { key: "3", label: "3 người" },
  //       { key: "4", label: "4 người" },
  //       { key: "5", label: "5 người" },
  //       { key: "6", label: "6 người" },
  //       { key: "7", label: "7+ người" },
  //     ],
  //   },
  //   {
  //     key: "sub5",
  //     label: "Số người chơi tối đa",
  //     icon: <BsPeople />,
  //     children: [
  //       { key: "0", label: "Tất cả" },
  //       { key: "1", label: "1 người" },
  //       { key: "2", label: "2 người" },
  //       { key: "3", label: "3 người" },
  //       { key: "4 ", label: "4 người" },
  //       { key: "5", label: "5 người" },
  //       { key: "6", label: "6 người" },
  //       { key: "7", label: "7+ người" },
  //     ],
  //   },
  //   {
  //     key: "sub6",
  //     label: "Độ tuổi tối thiểu",
  //     icon: <BsPeople />,
  //     children: [
  //       { key: "0", label: "Tất cả" },
  //       { key: "3", label: "3+" },
  //       { key: "6", label: "6+" },
  //       { key: "8", label: "8+" },
  //       { key: "10", label: "10+" },
  //       { key: "12", label: "12+" },
  //       { key: "14", label: "14+" },
  //       { key: "16", label: "16+" },
  //       { key: "18", label: "18+" },
  //     ],
  //   },
  // ];

  const menuItems = filterConfig.map((group) => ({
    key: group.key,
    label: group.label,
    icon: group.icon,
    children: group.options.map((option) => ({
      key: option.value,
      label: (
        <Checkbox
          checked={selectedItems.includes(option.value)}
          onChange={() => handleCheckboxChange(option.value)}
        >
          {option.label}
        </Checkbox>
      ),
    })),
  }));

  return (
    <div className="relative">
      {/* Phần hiển thị tags đã chọn */}
      <div className="sticky top-0 bg-white p-3 shadow-md z-10">
        <p className="font-semibold text-2xl text-black-2">Bộ lọc :</p>
        {/* <div className="flex flex-wrap ">
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
        </Button> */}
      </div>
      <div className="p-2">
        <p className="text-sm text-gray-500 mb-2">Chọn khoảng giá</p>
        <DynamicPriceRangeSlider />
      </div>
      {/* Menu */}
      <Menu
        // onClick={handleMenuClick}
        defaultOpenKeys={["sub1", "sub2", "sub3", "sub4"]}
        mode="inline"
        items={menuItems}
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
        tooltip={{ formatter: (value) => `${formatVND(value ?? 0)}` }}
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
const DynamicPriceRangeSlider = dynamic(() => Promise.resolve(PriceRangeSlider), {
  ssr: false,
});