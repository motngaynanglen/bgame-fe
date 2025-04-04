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
    label: <Link href={"/products"}>Board game</Link>,
    key: "boardGame",
    children: [
      {
        label: <Link href={"/products"}>Tất cả</Link>,
        key: "all",
      },
      {
        label: "Hàng mới về",
        key: "newarrival",
      },
      {
        label: "Giảm giá",
        key: "discount",
      },
    ],
  },
  {
    label: "Phụ kiện",
    key: "accessory",
  },
  {
    label: <Link href={"/rental"}>Thuê board game</Link>,
    key: "rental",
  },
  {
    label: <Link href={"/store-chain"}>Hệ thống cửa hàng</Link>,
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
  {
    label: "Ký gửi",
    key: "consignment",
  },
];

export default function Header() {
  const user = useAppContext().user;
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { cart } = useCartStore();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    setIsLogin(user == null ? true : false);
  }, [user]);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsMenuVisible((prev) => (prev && currentScrollPos < scrollPosition) || currentScrollPos === 0);
      setScrollPosition(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition])
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
          {/* <Link href="/rental">
            <button className="bg-green-700 hover:bg-green-800 px-2 py-1 rounded">
              Thuê board game
            </button>
          </Link> */}
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
      {/* {isMenuVisible && ( */}
      <Menu
        className={`flex flex-wrap justify-center xl:space-x-32 lg:space-x-10 sm:space-x-10 uppercase transition-all duration-300 ${
          isMenuVisible ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
        } overflow-hidden`}
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={items}
        selectable={false}
      />
      {/* )} */}
    </div>
  );
}
