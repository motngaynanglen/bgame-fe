"use client";
import { Divider } from "antd";
import Link from "next/link";
import CardProduct from "./CardProduct";
import { useEffect, useState } from "react";
import { useProducts } from "@/src/hooks/useProduct";

export default function HotDeal({ category }: { category: string }) {
  const items = [1, 2, 3, 4]; // Đây là dữ liệu giả, thay bằng dữ liệu thực từ API.
  interface BoardGame {
    id: string;
    title: string;
    price: number;
    status: boolean;
    image: string;
    publisher: string;
    category: string;
    player: string;
    time: string;
    age: number;
    complexity: number;
  }

  const { products, isLoading, isError, error, pageCount, pageSize } =
    useProducts();


  return (
    <div className="container md:p-3">
      <Divider variant="dashed" style={{ borderColor: "#7cb305" }}>
        <h1 className="text-2xl p-1 font-bold uppercase bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          {category}
        </h1>
      </Divider>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {products
          .filter((boardgame) => boardgame.sales_quantity > 0) // Lọc các sản phẩm có số lượng bán ra lớn hơn 0
          .slice(0, 5) // Lấy 5 sản phẩm đầu tiên
          .map((boardgame, index) => {
            const imageUrls = boardgame.image?.split("||") || [];
            return (
              <CardProduct
                key={index}
                id={boardgame.id}
                image={imageUrls[0]}
                price={boardgame.sell_price}
                title={boardgame.product_name}
                time={boardgame.time}
                player={boardgame.player}
                age={boardgame.age}
                complexity={boardgame.complexity}
                soldOut={false}
                quantity={boardgame.sales_quantity}
              />
            );
          })}
      </div>

      <div className="flex justify-center pt-3">
        <Link className="hover:underline" href="/products">
          <button className="bg-green-500 text-white font-semibold hover:bg-green-600 rounded-full px-5 py-2 mt-2">
            Xem Tất cả
          </button>
        </Link>
      </div>
    </div>
  );
}
