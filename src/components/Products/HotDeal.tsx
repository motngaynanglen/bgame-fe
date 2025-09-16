"use client";
import { useProducts } from "@/src/hooks/useProduct";
import { Divider } from "antd";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";
import CardHotDeal from "../Card/CardHotDeal";

export default function HotDeal({ category }: { category: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { products, isLoading, isError, error, pageCount, pageSize } =
    useProducts();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll(".card-product");

      cards.forEach((card) => {
        const cardInner = card.querySelector(".transform-3d"); // Chọn phần tử chứa 2 mặt

        if (cardInner) {
          gsap.to(cardInner, {
            rotateY: 180,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    }

    return () => ScrollTrigger.killAll();
  }, [products]);

  return (
    <div className="container mx-auto" ref={containerRef}>
      <Divider variant="dashed" style={{ borderColor: "#7cb305" }}>
        <h1 className="text-2xl p-1 font-bold uppercase bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          {category}
        </h1>
      </Divider>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {products
          .filter((boardgame) => boardgame.sales_quantity > 0) // Lọc các sản phẩm có số lượng bán ra lớn hơn 0
          .slice(0, 4) // Lấy 6 sản phẩm đầu tiên
          .map((boardgame, index) => {
            const imageUrls = boardgame.image?.split("||") || [];
            return (
              <div className="card-product" key={index}>
                <CardHotDeal
                  key={index}
                  id={boardgame.id}
                  product_group_ref_id={boardgame.product_group_ref_id}
                  image={imageUrls[0]}
                  price={boardgame.sell_price}
                  title={boardgame.product_name}
                  time={boardgame.time}
                  player={boardgame.player}
                  complexity={boardgame.complexity}
                  soldOut={false}
                  quantity={boardgame.sales_quantity}
                  duration={boardgame.duration}
                  age={boardgame.age}
                  number_of_player_max={boardgame.number_of_player_max}
                  number_of_player_min={boardgame.number_of_player_min}
                  publisher={boardgame.publisher}

                />
              </div>
            );
          })}
      </div>

      <div className="flex justify-center pt-3">
        <Link className="hover:underline" href="/products">
          <div className="group relative cursor-pointer p-2 w-32 border bg-white rounded-full overflow-hidden text-black text-center font-semibold">
            <span className="translate-y-0 group-hover:-translate-y-12 group-hover:opacity-0 transition-all duration-300 inline-block">
              Xem thêm
            </span>
            <div className="flex gap-2 text-white bg-green-400 z-10 items-center absolute left-0 top-0 h-full w-full justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 rounded-full group-hover:rounded-none ">
              <span>Let&apos;s go</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
