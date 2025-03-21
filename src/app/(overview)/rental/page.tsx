"use client";
import productApiRequest from "@/src/apiRequests/product";
import storeApiRequest from "@/src/apiRequests/stores";
import CategoryFilter from "@/src/components/Filter/CategoryFilter";
import CardProductRent from "@/src/components/Products/CardProductRent";
import {
  AppstoreOutlined,
  FilterOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Drawer,
  MenuProps,
  Pagination,
  Select,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import { useAppContext } from "../../app-provider";
import { useStoreStore } from "@/src/store/shopStore";
import { useQuery } from "@tanstack/react-query";

type MenuItem = Required<MenuProps>["items"][number];

interface BoardGame {
  id: string;
  product_name: string;
  product_group_ref_id: string;
  quantity: number;
  price: number;
  status: boolean;
  image: string;
  rent_price: number;
  rent_price_per_hour: number;
  publisher: string;
  category: string;
  player: string;
  time: string;
  age: number;
  complexity: number;
}

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

const storeSearchBody = {
  search: "",
  filter: [""],
};

interface Store {
  id: string;
  store_name: string;
  address: string;
}
interface SelectStores {
  value: string;
  label: string;
}
export default function BoardGameRental() {
  // const [boardgames, setBoardgames] = useState<BoardGame[]>([]); // sau khi fetch xong sẽ set vào đây
  // const [stores, setStores] = useState<SelectStores[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  // const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(undefined);
  const { stores, fetchStores, selectedStoreId, setSelectedStore } =
    useStoreStore();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  const fetchBoardGamesByStoreId = async (storeId: string) => {
    try {
      const res = await productApiRequest.getListByStoreId({
        storeId,
        isRent: true,
      });
      return res
    } catch (error) {
      console.error("lỗi store: " + error);
    }
  };

  const {data, isLoading, isError, error} = useQuery({
    queryKey: ['rentalBoardGames', selectedStoreId],
    queryFn: () => fetchBoardGamesByStoreId(selectedStoreId!),
    enabled: !!selectedStoreId,
  });
  
  useEffect(() => {
    fetchStores(); // Gọi API chỉ nếu chưa có dữ liệu
  }, [fetchStores]);

  if (isLoading) {
    return <div>Loading board games...</div>;
  }

  if (isError) {
    return <div>Error loading board games: {error?.message}</div>;
  }
  return (
    <div>
      <Breadcrumb />
      <div className="flex ">
        <main className="pt-4">
          <div className=" mb-4">
            <div className="flex ">
              <Space wrap>
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  onClick={showDrawer}
                >
                  Bộ Lọc
                </Button>
                <p className="text-black font-semibold">
                  Địa điểm cửa hàng cho thuê:
                </p>

                {/* {isLoadingStores ? ( // Kiểm tra loading trước khi render Select
                  <div>Loading stores...</div>
                ) : (
                  <Select
                    defaultValue={
                      stores.length > 0 ? stores[0].label : undefined
                    }
                    style={{ width: 400 }}
                    options={stores}
                    onChange={(value) => setSelectedStoreId(value)}
                  />
                )} */}

                {stores.length > 0 ? (
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={selectedStoreId || ""}
                    onChange={(e) => setSelectedStore(e.target.value)}
                  >
                    {stores.map((store) => (
                      <option className="p-2" key={store.id} value={store.id}>
                        {store.store_name} - {store.address}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>Đang tải danh sách cửa hàng...</p>
                )}
              </Space>
            </div>
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
            <Drawer
              title="Bộ Lọc"
              placement="left"
              onClose={onClose}
              open={open}
            >
              <CategoryFilter />
            </Drawer>
            {/* Product Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data?.data.map((boardgame: BoardGame) => (
                <CardProductRent
                  key={boardgame.id}
                  id={boardgame.id}
                  idGroup={boardgame.product_group_ref_id}
                  storeId={selectedStoreId ?? null}
                  image={boardgame.image}
                  price={boardgame.price}
                  title={boardgame.product_name}
                  isRented={boardgame.status}
                  rent_price={boardgame.rent_price}
                  rent_price_per_hour={boardgame.rent_price_per_hour}
                  complexity={boardgame.complexity}
                  age={boardgame.age}
                  time={boardgame.time}
                  player={boardgame.player}
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
    </div>
  );
}
