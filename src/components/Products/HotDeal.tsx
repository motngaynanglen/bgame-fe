import { Divider } from "antd";
import Link from "next/link";
import CardProduct from "./CardProduct";

export default function HotDeal({ category }: { category: string }) {
  const items = [1, 2, 3, 4]; // Đây là dữ liệu giả, thay bằng dữ liệu thực từ API.

  return (
    <div className="container md:p-3">
      <Divider style={{ borderColor: "#7cb305" }}>
        <h1 className="text-2xl p-1 font-bold uppercase bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          {category}
        </h1>
      </Divider>

     
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((_, index) => (
          <CardProduct
            key={index}
            image="/assets/images/tqs.jpg"
            price={800000}
            title={`Sản phẩm ${index + 1}`}
            soldOut={false}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Link className="hover:underline" href="/products">
          <button className="bg-green-500 text-white font-semibold hover:bg-green-600 rounded-full px-5 py-2 mt-2">
            Xem Tất cả
          </button>
        </Link>
      </div>
    </div>
  );
}
