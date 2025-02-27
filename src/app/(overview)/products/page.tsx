"use client";
import CategoryFilter from "@/src/components/Filter/CategoryFilter";
import CardProduct from "@/src/components/Products/CardProduct";
import {
  AppstoreOutlined,
  FilterOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Drawer, MenuProps, Pagination } from "antd";
import { use, useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
// import axios from "axios";

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

export default function ProductsPage() {
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };
  const [boardgames, setBoardgames] = useState<BoardGame[]>([]); // sau khi fetch xong sẽ set vào đây

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
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
    <div className="flex ">
      <main className="pt-4">
        <div className=" mb-4">
          <Button type="primary" icon={<FilterOutlined />} onClick={showDrawer}>
            Bộ Lọc
          </Button>
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
          <Drawer title="Bộ Lọc" placement="left" onClose={onClose} open={open}>
            <CategoryFilter />
          </Drawer>
          {/* Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {boardgames.map((boardgame, index) => (
              <CardProduct
                key={index}
                id={boardgame.id}
                image={boardgame.image}
                price={boardgame.price}
                title={boardgame.title}
                time={boardgame.time}
                player={boardgame.player}
                age={boardgame.age}
                complexity={boardgame.complexity}
                soldOut={boardgame.status}
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
  );
}
