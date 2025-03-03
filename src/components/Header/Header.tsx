"use client";
import { useCartStore } from "@/src/store/cartStore";
import type { MenuProps } from "antd";
import { Badge, Menu } from "antd";
import Link from "next/link";
import { BsBag, BsPersonCircle, BsSearch } from "react-icons/bs";
import AccountMenu from "./AccountMenu";
import HeaderSearch from "./HeaderSearch";
import { Suspense, useEffect, useState } from "react";
import { useAppContext } from "@/src/app/app-provider";

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
    label: "Hệ thống cửa hàng",
    key: "stores",
  },

  {
    label: "Tin Tức",
    key: "news",
    children: [
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
  const user = useAppContext().user;
  const [isLogin, setIsLogin] = useState<boolean>(false);
  useEffect(() => {
    setIsLogin(user == null ? true : false)
  }, [user])
  const { cart } = useCartStore();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div>
      <div className="bg-white flex flex-wrap justify-between items-center px-4 sm:px-10 py-2">
        <div className="text-2xl bg-gradient-to-r from-green-500 to-blue-500  bg-clip-text text-transparent basis-2 font-bold hover:">
          <Link href="/">BoardGameImpact</Link>
        </div>

        <Suspense>
          <HeaderSearch placeholder="Tìm kiếm board game yêu thích của bạn ..." />
        </Suspense>

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

          <Link href="/login" hidden={!isLogin}>
            <BsPersonCircle
              className="size-7
           fill-green-700"
            />
          </Link>

          <AccountMenu hidden={isLogin} />




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
