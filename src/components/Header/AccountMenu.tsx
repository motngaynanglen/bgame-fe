"use client";
import { SettingOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { BsPersonCircle } from "react-icons/bs";
import { BsPersonFill } from "react-icons/bs";
import { BsBox2Fill } from "react-icons/bs";
import { IoSettings } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { BsHeartFill } from "react-icons/bs";
import Image from "next/image";
import UserImage from "@/src/public/assets/images/blog-author.png";
import { useAppContext } from "@/src/app/app-provider";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function AccountMenu({ hidden }: { hidden: boolean }) {
  const { user: profile, setUser } = useAppContext();
  const router = useRouter();
  const handleLogout = () => {
    setUser(null); // Xoá context + localStorage
    router.push("/logout"); // Hoặc router.push nếu dùng useRouter
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Tín đẹp trai",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <Link href={"/customer"}>
          <h1>Hồ sơ</h1>
        </Link>
      ),
      icon: (
        <BsPersonFill className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
      ),
      // extra: "⌘P",
    },
    {
      key: "3",
      label: <Link href={"/customer/orders-history"}>Đơn hàng</Link>,
      icon: <BsBox2Fill />,
      // extra: "⌘B",
    },
    {
      key: "7",
      label: "Đăng xuất",
      icon: (
        <IoLogOut className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
      ),
      onClick: () => {
        handleLogout();
      },
      // ref: "/logout",
      // extra: "⌘S",
    },
  ];

  // const profile = useAppContext().user
  return (
    <div hidden={hidden}>
      <Dropdown menu={{ items }} trigger={["hover"]}>
        <a onClick={(e) => e.preventDefault()}>
          <Image
            width={34}
            height={34}
            className="rounded-full"
            src={profile?.avatar ?? UserImage}
            alt="User"
          />
          {/* <BsPersonCircle
            className="size-7
                     fill-green-700"
          /> */}
        </a>
      </Dropdown>
    </div>
  );
}
