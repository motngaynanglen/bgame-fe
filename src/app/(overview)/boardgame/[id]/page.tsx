"use client";
import SingleProductDescription from "@/src/components/Products/ProductDescription";
import ProductDetails from "@/src/components/Products/ProductDetails";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
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
  duration: string | null | undefined;
}

export default function BoardGameDetailPage() {
  const { id } = useParams();
  const [productData, setProductData] = useState<BoardGameInfo | undefined>(
    undefined
  );

  return (
    <div className="min-h-screen bg-sky-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl 2xl:max-w-screen-2xl">
        <ProductDetails productId={id} onProductData={setProductData} />
        {productData ? (
          <SingleProductDescription productData={productData} />
        ) : (
          <div className="flex justify-center items-center py-16">
            <div className="text-gray-500 text-lg">
              <Spin indicator={<LoadingOutlined spin />} className="mr-2" />
              Đang tải thông tin sản phẩm...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
