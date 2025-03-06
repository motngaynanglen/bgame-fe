"use client";
import CardProduct from "@/src/components/Products/CardProduct";
import {
  Button,
  Checkbox,
  Drawer,
  Layout,
  Menu,
  MenuProps,
  Pagination,
  Select,
  Space,
} from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import {
  AppstoreOutlined,
  FilterOutlined,
  MailOutlined,
} from "@ant-design/icons";
import CategoryFilter from "@/src/components/Filter/CategoryFilter";
import CardProductRent from "@/src/components/Products/CardProductRent";
import { useEffect, useState } from "react";

type MenuItem = Required<MenuProps>["items"][number];

// const boardgames = [
//   {
//     id: 1,
//     name: "Tam quốc sát",
//     price: 800000,
//     image: "/assets/images/tqs.jpg",
//     soldOut: false,
//   },
//   {
//     id: 2,
//     name: "Catan",
//     price: 800000,
//     image: "/assets/images/tqs.jpg",
//     soldOut: false,
//   },
//   {
//     id: 3,
//     name: "Splendor",
//     price: 800000,
//     image: "/assets/images/tqs.jpg",
//     soldOut: false,
//   },
//   {
//     id: 4,
//     name: "Nana",
//     price: 800000,
//     image: "/assets/images/tqs.jpg",
//     soldOut: false,
//   },
//   {
//     id: 5,
//     name: "Rummikub",
//     price: 800000,
//     image: "/assets/images/tqs.jpg",
//     soldOut: false,
//   },
//   {
//     id: 6,
//     name: "Arcadia Quest",
//     price: 800000,
//     image: "/assets/images/tqs.jpg",
//     soldOut: true,
//   },
//   {
//     id: 7,
//     name: "Root",
//     price: 800000,
//     image: "/assets/images/tqs.jpg",
//     soldOut: false,
//   },
//   {
//     id: 8,
//     name: "7 Wonders",
//     price: 800000,
//     image: "/assets/images/tqs.jpg",
//     soldOut: true,
//   },
// ];

interface BoardGame {
  id: string;
  title: string;
  price: number;
  status: boolean;
  image: string;
  publisher: string;
  category: string;
  player: string;
  time: string;
  age: number;
  complexity: number;
}

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

export default function BoardGameRental() {
  const [boardgames, setBoardgames] = useState<BoardGame[]>([]); // sau khi fetch xong sẽ set vào đây

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  const fetchBoardGames = async () => {
    try {
      const res = await fetch(
        "https://677fbe1f0476123f76a7e213.mockapi.io/BoardGame"
      );
      const data = await res.json();
      console.log(data);
      setBoardgames(data);
    } catch (error) {
      console.error("lỗi nè: " + error);
    }
  };

  useEffect(() => {
    fetchBoardGames();
  }, []);
  return (
    <div>
      <Breadcrumb />
      <div className="flex ">
        <main className="pt-4">
          <div className=" mb-4">
            <div className="flex ">
              <Space wrap>
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  onClick={showDrawer}
                >
                  Bộ Lọc
                </Button>

                {/* <Select
                  defaultValue="lucy"
                  style={{ width: 120 }}
                  // onChange={handleChange}
                  options={[
                    { value: "CN1", label: "Jack" },
                    { value: "", label: "Lucy" },
                    { value: "Yiminghe", label: "yiminghe" },
                    { value: "disabled", label: "Disabled", disabled: true },
                  ]}
                /> */}
                <p className="text-black font-semibold">
                Địa điểm cửa hàng cho thuê:
                </p>
                
                <Select
                  defaultValue="145-147-149 Hùng Vương, Tp.Thủ Đức"
                  style={{ width: 400  }}
                  // onChange={handleChange}
                  options={[
                    { value: "CN1", label: "9 Nguyễn Tất Thành, Quận 1, Tp.HCM",  },
                    { value: "CN2", label: "81c Nguyễn Văn Tư, Quận 2, Tp.HCM" },
                    { value: "CN3", label: "121 Phạm Văn Thuận, Quận 5, Tp.HCM" },
                    { value: "CN4", label: "145-147-149 Hùng Vương, Tp.Thủ Đức" },
                  ]}
                />
              </Space>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row">
            {/* Filter */}
            {/* <div className="hidden lg:block lg:basis-1/4 pr-4">
              <CategoryFilter />
            </div> */}
            {/* <div className="block lg:hidden mb-4">
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={showDrawer}
              >
                Bộ Lọc
              </Button>
            </div> */}

            {/* Drawer cho mobile */}
            <Drawer
              title="Bộ Lọc"
              placement="left"
              onClose={onClose}
              open={open}
            >
              <CategoryFilter />
            </Drawer>
            {/* Product Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {boardgames.map((boardgame, index) => (
                <CardProductRent
                  key={index}
                  id={boardgame.id}
                  image={boardgame.image}
                  price={boardgame.price}
                  title={boardgame.title}
                  isRented={boardgame.status}
                  complexity={boardgame.complexity}
                  age={boardgame.age}
                  time={boardgame.time}
                  player={boardgame.player}
                />
              ))}
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            className="m-5"
            align="center"
            defaultCurrent={1}
            total={50}
          />
        </main>
      </div>
    </div>
  );
}
