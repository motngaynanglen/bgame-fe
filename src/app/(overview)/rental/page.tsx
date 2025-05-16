"use client";
import productApiRequest from "@/src/apiRequests/product";
import CategoryFilter from "@/src/components/Filter/CategoryFilter";
import CardProductRent from "@/src/components/Card/CardProductRent";
import CartRental from "@/src/components/Products/CartRental";
import { useSelectedStore } from "@/src/hooks/useSelectStoreId";
import { useStores } from "@/src/hooks/useStores";
import { FilterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Drawer, MenuProps, Pagination, Space } from "antd";
import { useState } from "react";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import Loading from "../loading";

import { useEffect } from "react";
import { useRentalStore } from "@/src/store/rentalStore";
import TimeSlotDisplay from "./extend/TimeSlotDisplay";

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

export default function BoardGameRental() {
  const [open, setOpen] = useState(false);
  const {
    stores,
    isLoading: storesLoading,
    isError: storesError,
    error: storesErrorData,
  } = useStores();
  const { selectedStoreId, setSelectedStoreId } = useSelectedStore();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const setStoreId = useRentalStore(
    (state: { setStoreId: any }) => state.setStoreId
  );

  useEffect(() => {
    if (selectedStoreId) {
      setStoreId(selectedStoreId);
    }
  }, [selectedStoreId, setStoreId]);

  const fetchBoardGamesByStoreId = async (storeId: string) => {
    try {
      const res = await productApiRequest.getListByStoreId({
        storeId,
        isRent: true,
        paging: {
          pageNum: 1,
          pageSize: 10,
        },
      });
      return res;
    } catch (error) {
      console.error("lỗi store: " + error);
    }
  };

  const {
    data,
    isLoading: rentalLoading,
    isError: rentalError,
    error: rentalErrorData,
  } = useQuery({
    queryKey: ["rentalBoardGames", selectedStoreId],
    queryFn: () => fetchBoardGamesByStoreId(selectedStoreId!),
    enabled: !!selectedStoreId,
  });

  

  if (storesLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Breadcrumb />
      <TimeSlotDisplay storeid={selectedStoreId ?? ""} />
      <div className="flex container min-h-screen mx-auto max-w-screen-3xl">
        <main className=" lg:w-3/4 p-4">
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

                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  onClick={showDrawer}
                  className="block lg:hidden "
                >
                  Giỏ hàng thuê
                </Button>

                <p className="text-black font-semibold">
                  Địa điểm cửa hàng cho thuê:
                </p>

                {stores.length > 0 ? (
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={selectedStoreId || ""}
                    onChange={(e) => setSelectedStoreId(e.target.value)}
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
                  quantity={boardgame.quantity}
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
        <aside className="hidden lg:block w-1/4 bg-slate-600 text-white sticky top-[64px] h-[calc(100vh-64px)] border-l-2 border-gray-200">
          <CartRental />
        </aside>
      </div>
    </div>
  );
}
