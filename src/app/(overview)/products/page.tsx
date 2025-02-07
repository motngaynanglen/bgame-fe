  "use client";
  import CardProduct from "@/src/components/Products/CardProduct";
  import { AppstoreOutlined, MailOutlined } from "@ant-design/icons";
  import { Checkbox, Layout, Menu, MenuProps, Pagination } from "antd";
  import { Content } from "antd/es/layout/layout";
  import Sider from "antd/es/layout/Sider";
  import { AiOutlineClockCircle } from "react-icons/ai";
  import { BsPeople } from "react-icons/bs";


  interface BoardGame {
    id: string;
    title: string;
    price: number;
    status: boolean;
    image: string;
  }
  type MenuItem = Required<MenuProps>["items"][number];

  const boardgames = [
    {
      id: 1,
      name: "Tam quốc sát",
      price: 800000,
      image: "/assets/images/tqs.jpg",
      soldOut: false,
    },
    {
      id: 2,
      name: "Catan",
      price: 800000,
      image: "/assets/images/tqs.jpg",
      soldOut: false,
    },
    {
      id: 3,
      name: "Splendor",
      price: 800000,
      image: "/assets/images/tqs.jpg",
      soldOut: false,
    },
    {
      id: 4,
      name: "Nana",
      price: 800000,
      image: "/assets/images/tqs.jpg",
      soldOut: false,
    },
    {
      id: 5,
      name: "Rummikub",
      price: 800000,
      image: "/assets/images/tqs.jpg",
      soldOut: false,
    },
    {
      id: 6,
      name: "Arcadia Quest",
      price: 800000,
      image: "/assets/images/tqs.jpg",
      soldOut: false,
    },
    {
      id: 7,
      name: "Root",
      price: 800000,
      image: "/assets/images/tqs.jpg",
      soldOut: false,
    },
    {
      id: 8,
      name: "7 Wonders",
      price: 800000,
      image: "/assets/images/tqs.jpg",
      soldOut: false,
    },
  ];

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



  export default  function ProductsPage () {
    const onClick: MenuProps["onClick"] = (e) => {
      console.log("click ", e);
    };
    // const data = await fetch('https://677fbe1f0476123f76a7e213.mockapi.io/BoardGame')
    // const boardgames: BoardGame[] = await data.json();

    return (
      <div className="flex ">
        {/* Sidebar */}
        <Layout>
          <Sider className="h-screen w-20" width={250} theme="light">
            <Menu
              onClick={onClick}
              // defaultSelectedKeys={["1", "2"]}
              defaultOpenKeys={["sub1", "sub2"]}
              mode="inline"
              items={items}
            />
          </Sider>
          <Layout>
            <Content>
              <main className=" p-4">
                <div className=" text-white p-4 flex justify-between items-center bg-gradient-to-r from-green-500 to-blue-500 rounded-md mb-2">
                  <h1 className="text-xl font-bold">Hot deal</h1>
                </div>
                {/* Product Cards */}
                <div className="grid grid-cols-4 gap-4">
                  {boardgames.map((boardgame, index) => (
                    <CardProduct
                      key={index}
                      image="/assets/images/tqs.jpg"
                      price={boardgame.price}
                      title={boardgame.name}
                      soldOut={boardgame.soldOut}
                    />
                  ))}
                </div>
                {/* Pagination */}
                <Pagination
                  className="m-5"
                  align="center"
                  defaultCurrent={1}
                  total={50}
                />
              </main>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
