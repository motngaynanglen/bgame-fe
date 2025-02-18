'use client';
import { Divider } from "antd";
import Link from "next/link";
import CardProduct from "./CardProduct";
import { useEffect, useState } from "react";

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

  const [boardgames, setBoardgames] = useState<BoardGame[]>([]);

  const fetchBoardGames = async () => {
    try {
      const res = await fetch("https://677fbe1f0476123f76a7e213.mockapi.io/BoardGame");
      const data = await res.json();
      console.log(data);
      setBoardgames(data.slice(0, 4)); 
    } catch (error) {
      console.error("lỗi nè: "+error);
    }
  }
  useEffect(() => {
    fetchBoardGames();
  }, []);

  return (
    <div className="container md:p-3">
      <Divider style={{ borderColor: "#7cb305" }}>
        <h1 className="text-2xl p-1 font-bold uppercase bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          {category}
        </h1>
      </Divider>

     
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {boardgames.map((boardgame, index) => (
          <CardProduct
            key={index}
            id={boardgame.id}
            image={boardgame.image}
            price={boardgame.price}
            title={boardgame.title}
            time={boardgame.time}
            player={boardgame.player}
            age={boardgame.age}
            complexity={boardgame.complexity}
            soldOut={false}
          />
        ))}
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
