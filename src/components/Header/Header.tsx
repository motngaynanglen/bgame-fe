"use client";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Link from "next/link";
import { BsBag, BsPersonCircle, BsSearch } from "react-icons/bs";

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
        type: "group",
        label: "Item 1",
        children: [
          { label: "Option 1", key: "setting:1" },
          { label: "Option 2", key: "setting:2" },
        ],
      },
      {
        type: "group",
        label: "Item 2",
        children: [
          { label: "Option 3", key: "setting:3" },
          { label: "Option 4", key: "setting:4" },
        ],
      },
    ],
  },
  {
    label: "Phụ kiện",
    key: "accessory",
  },
  {
    label: "Giảm giá",
    key: "deal",
  },
  {
    label: "Tin Tức",
    key: "news",
  },
];

export default function Header() {
  return (
    <div>
      <div className="bg-white flex flex-wrap justify-between items-center px-4 sm:px-10 py-2">
        <div className="text-3xl text-green-700 basis-2 font-bold hover: text-green-500">
          <Link href="/">
            BoGemStore
          </Link>
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
              placeholder="Nhập tên board game..."
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
          <BsBag className="size-7 fill-green-700" />
          <Link href="/login">
            <BsPersonCircle
              className="size-7
           fill-green-700"
            />
          </Link>
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
