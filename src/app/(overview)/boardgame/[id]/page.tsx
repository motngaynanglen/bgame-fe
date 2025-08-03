"use client";
import SingleProductDescription from "@/src/components/Products/ProductDescription";
import ProductDetails from "@/src/components/Products/ProductDetails";
import { useParams } from "next/navigation";
import { useState } from "react";

interface BoardGameInfo {
  id: string;
  product_group_ref_id: string;
  product_name: string;
  price: number;
  code: string;
  image: string;
  publisher: string;
  category: string;
  age: number;
  number_of_player_min: number;
  number_of_player_max: number;
  hard_rank: number;
  time: string;
  description: string;
  sales_quantity: number;
  rent_quantity: number;
}

export default function BoardGameDetailPage() {
  const { id } = useParams();
  const [productData, setProductData] = useState<BoardGameInfo | undefined>(
    undefined
  );

  return (
    <div className="container min-h-screen mx-auto max-w-screen-2xl pt-4 bg-sky-50">
      <ProductDetails productId={id} onProductData={setProductData} />
      {productData ? (
        <SingleProductDescription productData={productData} />
      ) : (
        <div className="text-gray-500 flex justify-center items-center">
          Đang tải thông tin sản phẩm...
        </div>
      )}
    </div>
  );
}
