"use client";
import { useCartStore } from "@/src/store/cartStore";
import type { MenuProps } from "antd";
import { Badge, Menu } from "antd";
import Link from "next/link";
import { BsBag, BsPersonCircle, BsSearch } from "react-icons/bs";
import AccountMenu from "./AccountMenu";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Hàng mới về",
    key: "newRelease",
  },
  {
    label: "Hàng đặt trước",
    key: "preOrder",
  },
  {
    label: "Board Game",
    key: "boardGame",
    children: [
      {
        label: "Bộ cơ bản",
        key: "all",
      },
      {
        label: "Bản mở rộng",
        key: "expansion",
      },
    ],
  },
  {
    label: "Phụ kiện",
    key: "accessory",
  },

  {
    label: "Tin Tức",
    key: "news",
    children: [
      {
        label: "Hệ thống cửa hàng",
        key: "stores",
      },
      {
        label: "Giải đấu",
        key: "tournament",
      },
      {
        label: "Board Game",
        key: "boardGameNews",
      },
    ],
  },
];

export default function Header() {
  const { cart } = useCartStore();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div>
      <div className="bg-white flex flex-wrap justify-between items-center px-4 sm:px-10 py-2">
        <div className="text-3xl bg-gradient-to-r from-green-500 to-blue-500  bg-clip-text text-transparent basis-2 font-bold hover:">
          <Link href="/">BoGemStore</Link>
        </div>

        <form className="basis-full sm:basis-1/3 h-auto mt-2 sm:mt-0">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <BsSearch className="fill-green-700" />
            </div>
            <input
              type="search"
              id="default-search"
              className=" w-full p-3 ps-10 text-sm text-gray-900  border-gray-300 rounded-md bg-gray-50  "
              placeholder="Tím kiếm board game yêu thích của bạn ..."
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1  dark:focus:ring-blue-800"
            >
              Tìm Kiếm
            </button>
          </div>
        </form>

        <div className="flex justify-items-center space-x-6 sm:space-x-6 lg:space-x-10">
          <Link href="/rental">
            <button className="bg-green-700 hover:bg-green-800 px-2 py-1 rounded">
              Thuê board game
            </button>
          </Link>
          <Link href="/cart">
            <Badge count={totalQuantity} showZero>
              <BsBag className="size-7 fill-green-700" />
            </Badge>
          </Link>

          <Link href="/login">
            <BsPersonCircle
              className="size-7
           fill-green-700"
            />
          </Link>

          <AccountMenu/>
        </div>
      </div>
      <Menu
        className="flex flex-wrap justify-center xl:space-x-32 lg:space-x-10 sm:space-x-10 uppercase"
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={items}
        // style={{ display: "flex", minWidth: 0, justifyContent: "center" }}
      />
    </div>
  );
}
