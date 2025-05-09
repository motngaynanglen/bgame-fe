"use client";
import { useAppContext } from "@/src/app/app-provider";
import { useCartStore } from "@/src/store/cartStore";
import type { MenuProps } from "antd";
import { Badge, Menu } from "antd";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { BsBag, BsPersonCircle } from "react-icons/bs";
import ShinyText from "../Bits/ShinyText";
import AccountMenu from "./AccountMenu";
import HeaderSearch from "./HeaderSearch";

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
      {
        label: <Link href={"/used-games"}>Hàng đã qua sử dụng</Link>,
        key: "used",
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
    label: <Link href={"/consignment"}>Ký gửi</Link>,
    key: "consignment",
  },
];

export default function Header() {
  const user = useAppContext().user;
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { cart } = useCartStore();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const headerRef = useRef<HTMLDivElement>(null);
  const innerHeaderRef = useRef<HTMLDivElement>(null);

  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  // const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //   const onScroll = () => {
  //     setIsScrolled(window.scrollY > 20); // Bắt đầu hiệu ứng khi scroll > 20px
  //   };
  //   window.addEventListener("scroll", onScroll);
  //   return () => window.removeEventListener("scroll", onScroll);
  // }, []);

  useEffect(() => {
    setIsLogin(user == null ? true : false);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      // setIsScrolled(scrolled);
      // Giữ logic ẩn menu nếu cần
      const currentScrollPos = window.scrollY;
      setIsMenuVisible(
        (prev) =>
          (prev && currentScrollPos < scrollPosition) || currentScrollPos === 0
      );
      setScrollPosition(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPosition]);

  return (
    <div>
      <div>
        <div
          className={`bg-gray-900 sticky top-0 z-50 mx-auto flex flex-wrap justify-between items-center transition-all duration-300 ease-in-out px-4 sm:px-10 py-2`}
        >
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="text-2xl font-bold">
              <Link href="/">
                <ShinyText
                  text="BoardGameImpact"
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />
              </Link>
            </div>

            {/* Hiện trên mobile, ẩn ở sm trở lên */}
            <div className="flex items-center space-x-5 sm:hidden">
              <Link href="/cart">
                <Badge count={totalQuantity} showZero>
                  <BsBag className="size-6 fill-green-700" />
                </Badge>
              </Link>
              <Link href="/login" hidden={!isLogin}>
                <Badge count={totalQuantity}>
                  <BsPersonCircle className="size-6 fill-green-700" />
                </Badge>
              </Link>
              <AccountMenu hidden={isLogin} />
            </div>
          </div>

          {/* Thanh tìm kiếm */}
          <Suspense>
            <HeaderSearch placeholder="Tìm kiếm board game yêu thích của bạn ..." />
          </Suspense>

          {/* Icon hiển thị bình thường ở sm trở lên, ẩn trên mobile */}
          <div className="hidden sm:flex justify-items-center items-centerBoardgame space-x-6 lg:space-x-10">
            <Link href="/cart">
              <Badge count={totalQuantity} showZero>
                <BsBag className="size-8 fill-green-700" />
              </Badge>
            </Link>

            <Link href="/login" hidden={!isLogin}>
              <BsPersonCircle className="size-8 fill-green-700" />
            </Link>

            <AccountMenu hidden={isLogin} />
          </div>
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
