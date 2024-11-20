import { Menu } from "antd";
import React from "react";
import type { MenuProps } from "antd";
import { SearchProps } from "antd/es/input";
import Search from "antd/es/input/Search";
import { AiOutlineShopping } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { BsBag } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";


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
      <div className="bg-white h-auto flex justify-between items-center px-10 py-2">
        <div className="text-4xl text-green-700 basis-2 font-bold">
          BoGemStore
        </div>

        {/* <Search
          className="w-auto basis-1/4 text-black border-black focus-within:border-blue-500 rounded-lg"
          placeholder="input search text"
          allowClear
          // style={{ width: 200, borderColor: "black"}}
        /> */}

        <form className=" basis-1/3">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <BsSearch className="fill-green-700"/>
            </div>
            <input
              type="search"
              id="default-search"
              className="block  w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Nhập tên board game..."
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2  dark:focus:ring-blue-800"
            >
              Tìm Kiếm
            </button>
          </div>
        </form>

        <div className="flex justify-items-center basis-4 space-x-10">
          <BsBag className="size-10 fill-green-700" />
          <BsPersonCircle className="size-10 fill-green-700" />
        </div>
      </div>
      <Menu
        className="flex-1 justify-center"
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={items}
        // style={{ display: "flex", minWidth: 0, justifyContent: "center" }}
      />
    </div>
  );
}
