"use client";
import productApiRequest from "@/src/apiRequests/product";
import CategoryFilter from "@/src/components/Filter/CategoryFilter";
import CardProductRent from "@/src/components/Card/CardProductRent";
import CartRental from "@/src/components/Products/CartRental";
import { useSelectedStore } from "@/src/hooks/useSelectStoreId";
import { useStores } from "@/src/hooks/useStores";
import { AppstoreOutlined, FilterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Drawer, MenuProps, Pagination, Space } from "antd";
import { useState } from "react";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import Loading from "../loading";

import { useEffect } from "react";
import { useRentalStore } from "@/src/store/rentalStore";
import TimeSlotDisplay from "./extend/TimeSlotDisplay";
import bookListApiRequest from "@/src/apiRequests/bookList";
import BookingTable from "./table/page";
import dayjs from "@/src/lib/dayjs ";
import { date } from "zod";

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
  const [showBookingTable, setShowBookingTable] = useState(false);

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
      const res = await bookListApiRequest.getBookAvailableProduct({
        storeId,
        date: new Date(),
        paging: null,
        // {
        //   pageNum: 1,
        //   pageSize: 10,

        // }
      });
      return res;
    } catch (error) {
      console.error("lỗi store: " + error);
    }
  };

  const handleChooseTable = () => {
    setShowBookingTable(true);
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

  // if (storesError) {
  //   return (
  //     <div>Error: {storesErrorData?.message || "Failed to load stores."}</div>
  //   );
  // }

  if (rentalLoading) {
    return <Loading />;
  }

  // if (rentalError) {
  //   return (
  //     <div>
  //       Error: {rentalErrorData?.message || "Failed to load rental products."}
  //     </div>
  //   );
  // }

  return (
    <div>
      <Breadcrumb
        title="Dịch vụ thuê board game"
        subtitle="Tại BoardGame Impact"
      />
      {/* <TimeSlotDisplay storeid={selectedStoreId ?? ""} /> */}
      <div className="flex container min-h-screen mx-auto max-w-screen-3xl">
        <main className=" lg:w-3/4 p-4">
          {showBookingTable ? (
            <BookingTable storeId={selectedStoreId ?? null} bookDate={new Date()}/>
          ) : (
            <>
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
                          <option
                            className="p-2"
                            key={store.id}
                            value={store.id}
                          >
                            {store.store_name} - {store.address}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p>Đang tải danh sách cửa hàng...</p>
                    )}

                    {/* <div className="flex items-center justify-between w-full sm:justify-end">
                 
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue="default"
                  >
                    <option value="default">BoardGame</option>
                    <option value="table">Bàn</option>
                   
                  </select>
                </div> */}
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
                  {(Array.isArray(data?.data) && data.data.length > 0) ||
                  storesLoading ? (
                    data?.data.map((boardgame: BoardGame) => (
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
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500 py-10">
                      Cửa hàng chưa có sản phẩm cho thuê.
                    </div>
                  )}
                </div>
              </div>
              {/* Pagination */}
              <Pagination
                className="m-5"
                align="center"
                defaultCurrent={1}
                total={50}
              />
            </>
          )}
        </main>
        <aside className="hidden lg:block w-1/4 bg-slate-600 text-white sticky top-[64px] h-[calc(100vh-64px)] border-l-2 border-gray-200">
          <CartRental
            storeId={selectedStoreId ?? null}
            onChooseTable={!showBookingTable ? handleChooseTable : undefined}
          />
        </aside>
      </div>
    </div>
  );
}
