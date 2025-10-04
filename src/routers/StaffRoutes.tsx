import { ItemType, MenuItemType } from "antd/es/menu/interface";
import clsx from "clsx";
import Link from "next/link";
import { AiOutlineBook, AiOutlineUnorderedList } from "react-icons/ai";
import { MdAddChart } from "react-icons/md";
import { DashboardRouter } from "./route.schema";

/**
 *  All Dashboard Routes
 *
 *  Understanding title/value pairs for Dashboard routes
 *
 *  Applicable for main/root/level 1 routes
 *  icon 		: String - It's only for main menu or you can consider 1st level menu item to specify icon title.
 *
 *  Applicable for main/root/level 1 and subitems routes
 * 	key 			: Number - You can use '' as value to generate unique key using uuid library, you can also assign constant unique key for react dynamic objects.
 *  title 		: String - If menu contains childern use title to provide main menu title.
 *  badge 		: String - (Optional - Default - '') If you specify badge value it will be displayed beside the menu title or menu item.
 * 	badgecolor 	: String - (Optional - Default - 'primary' ) - Used to specify badge background color.
 *
 *  Applicable for subitems / children items routes
 *  title 		: String - If it's menu item in which you are specifiying link, use title ( don't use title for that )
 *  children	: Array - Use to specify submenu items
 *
 *  Used to segrigate menu groups
 *  grouptitle : Boolean - (Optional - Default - false ) If you want to group menu items you can use grouptitle = true,
 *  ( Use title : value to specify group title  e.g. COMPONENTS , DOCUMENTATION that we did here. )
 *
 */
export const staffMenuAntd: ItemType<MenuItemType>[] | undefined = [
  {
    key: "default",
    label: (
      <Link href={"/staff"} className={clsx("font-medium text-base")}>
        Bảng thống kê
      </Link>
    ),
    icon: (
      <svg
        className="fill-current"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
          fill=""
        />
        <path
          d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
          fill=""
        />
        <path
          d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
          fill=""
        />
        <path
          d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
          fill=""
        />
      </svg>
    ),
  },
  {
    type: "group",
    key: "group-1",
    label: (
      <p className="mb-4 ml-4 text-xl font-semibold text-boxdark-2">
        Thư mục quản lý
      </p>
    ),
  },

  {
    key: "group-1-1",
    label: (
      <Link
        href={"/staff/sale/in-store"}
        className={clsx("font-medium text-base")}
      >
        Bán hàng tại cửa hàng
      </Link>
    ),
    icon: <MdAddChart />,
  },
  {
    key: "group-1-2",
    label: (
      <Link
        href={"/staff/timetable/add"}
        className={clsx("font-medium text-base")}
      >
        Thuê tại cửa hàng
      </Link>
    ),
    icon: <MdAddChart />,
  },
  {
    key: "group-2",
    label: (
      <p className={clsx("font-medium text-base")}>
        Quản lý lịch đặt
      </p>
    ),
    icon: <AiOutlineBook />,
    children: [
      {
        key: "21",
        label: (
          <Link
            href={"/staff/timetable"}
            className={clsx("font-medium text-base")}
          >
            Danh sách lịch trình
          </Link>
        ),
        icon: <AiOutlineUnorderedList />,
      },
      {
        key: "22",
        label: (
          <Link
            href={"/staff/timetable/add"}
            className={clsx("font-medium text-base")}
          >
            Tạo mới đơn thuê
          </Link>
        ),
        icon: <MdAddChart />,
      },
    ],
  },
  {
    key: "group-3",
    label: (
      <Link
        href={"/staff/orders"}
        className={clsx("font-medium text-base")}
      >
        Danh sách đơn hàng
      </Link>
    ),
    icon: <MdAddChart />,
    // children: [
    //   // {
    //   //   key: "31",
    //   //   label: (
    //   //     <Link
    //   //       href={"/staff/orders/pending"}
    //   //       className={clsx("font-medium text-base")}
    //   //     >
    //   //       Nhận đơn chờ
    //   //     </Link>
    //   //   ),
    //   //   icon: <AiOutlineUnorderedList />,
    //   // },
    //   // {
    //   //   key: "32",
    //   //   label: (
    //   //     <Link
    //   //       href={"/staff/orders/on-going"}
    //   //       className={clsx("font-medium text-base")}
    //   //     >
    //   //       Đơn đang xử lý
    //   //     </Link>
    //   //   ),
    //   //   icon: <MdAddChart />,
    //   // },
    //   {
    //     key: "33",
    //     label: (
    //       <Link
    //         href={"/staff/orders"}
    //         className={clsx("font-medium text-base")}
    //       >
    //         Danh sách đơn hàng
    //       </Link>
    //     ),
    //     icon: <MdAddChart />,
    //   },
    // ],
  },
  {
    key: "group-4",
    label: (
      <Link
        href={"/staff/sale/detail-online"}
        className={clsx("font-medium text-base")}
      >
        Quản lý ký gửi
      </Link>
    ),
    icon: <MdAddChart />,
    children: [
      // {
      //   key: "40",
      //   label: (
      //     <Link
      //       href={"/staff/consignment/pending"}
      //       className={clsx("font-medium text-base")}
      //     >
      //       Đơn ký gửi chờ duyệt
      //     </Link>
      //   ),
      //   icon: <AiOutlineUnorderedList />,
      // },
      {
        key: "41",
        label: (
          <Link
            href={"/staff/consignment/list"}
            className={clsx("font-medium text-base")}
          >
            Danh sách sản phẩm ký gửi
          </Link>
        ),
        icon: <AiOutlineUnorderedList />,
      },
      {
        key: "42",
        label: (
          <Link
            href={"/staff/consignment/add"}
            className={clsx("font-medium text-base")}
          >
            Tạo mới sản phẩm ký gửi
          </Link>
        ),
        icon: <MdAddChart />,
      },
    ]
  },
];
export const staffRouter: DashboardRouter = {
  role: "staff",
  route: staffMenuAntd,
};

export default staffRouter;
