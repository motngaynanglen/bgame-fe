"use client";
import productApiRequest from "@/src/apiRequests/product";
import CategoryFilter from "@/src/components/Filter/CategoryFilter";
import CardProduct from "@/src/components/Products/CardProduct";
import {
  AppstoreOutlined,
  FilterOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Drawer, MenuProps, Pagination } from "antd";
import { use, useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
// import axios from "axios";

interface BoardGame {
  id: string;
  product_group_ref_id: string;
  product_name: string;
  price: number;
  status: boolean;
  image: string;
  quantity: number;
  publisher: string;
  category: string;
  player: string;
  time: string;
  age: number;
  complexity: number;
}


export default function ProductsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const [boardgames, setBoardgames] = useState<BoardGame[]>([]); // sau khi fetch xong sẽ set vào đây
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

   const {data, isLoading, isError, error} = useQuery({
      queryKey: ['boardGames'],
      queryFn: () => fetchBoardGames(),
      // enabled: !!selectedStoreId,
    });

  const fetchBoardGames = async () => {
    try {
      const res = await productApiRequest.getList({ 
        search: "",
        filter: [],
      });
      return res;
    } catch (error) {
      console.error("lỗi store: " + error);
    }
  };

  
  return (
    <div className="flex ">
      <main className="pt-4">
        <div className=" mb-4">
          <Button type="primary" icon={<FilterOutlined />} onClick={showDrawer}>
            Bộ Lọc
          </Button>
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
          <Drawer title="Bộ Lọc" placement="left" onClose={onClose} open={open}>
            <CategoryFilter />
          </Drawer>
          {/* Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.data.map((boardgame: BoardGame) => (
              <CardProduct
                key={boardgame.id}
                id={boardgame.id}
                image={boardgame.image}
                price={boardgame.price}
                title={boardgame.product_name}
                time={boardgame.time}
                player={boardgame.player}
                age={boardgame.age}
                complexity={boardgame.complexity}
                soldOut={boardgame.status}
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
  );
}
