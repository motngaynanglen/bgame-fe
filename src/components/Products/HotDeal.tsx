"use client";
import { useProducts } from "@/src/hooks/useProduct";
import { Divider } from "antd";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";
import CardHotDeal from "./CardHotDeal";

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
    <div className="container md:p-3" ref={containerRef}>
      <Divider variant="dashed" style={{ borderColor: "#7cb305" }}>
        <h1 className="text-2xl p-1 font-bold uppercase bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          {category}
        </h1>
      </Divider>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {products
          .filter((boardgame) => boardgame.sales_quantity > 0) // Lọc các sản phẩm có số lượng bán ra lớn hơn 0
          .slice(0, 5) // Lấy 5 sản phẩm đầu tiên
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
                  age={boardgame.age}
                  complexity={boardgame.complexity}
                  soldOut={false}
                  quantity={boardgame.sales_quantity}
                />
              </div>
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
