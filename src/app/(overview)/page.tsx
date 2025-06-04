import AboutComponent from "@/src/components/About/AboutComponent";
import AboutRental from "@/src/components/About/AboutRental";
import Masonry from "@/src/components/Bits/Masonry";
import HotDeal from "@/src/components/Products/HotDeal";
import { Space } from "antd";

const data = [
  {
    id: 1,
    image: "/assets/images/carousel1.jpg",
    label: "Hàng Mới Về",
    height: 300,
  },
  {
    id: 2,
    image: "/assets/images/carousel2.jpg",
    label: "Boardgame",
    height: 300,
  },
  {
    id: 3,
    image: "/assets/images/bg6.jpg",
    label: "Trading Card Game",
    height: 300,
  },
  // { id: 4, image: "/assets/images/bg4.jpg", label: "Phụ Kiện", height: 300 },
  {
    id: 5,
    image: "/assets/images/bg5.jpg",
    label: "Thuê Boardgame",
    height: 300,
  },
];

export default function Home() {
  return (
    <div className="bg-gray-100 ">
      <section className="relative  min-h-[600px] md:min-h-[auto] bg-gradient-to-b from-gray-900 to-gray-100 py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Board Game Impact
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            BoardGame Impact là chuỗi cửa hàng board game, nơi bạn có thể thuê
            hoặc mua những bộ game hấp dẫn để chơi cùng bạn bè và gia đình.
          </p>
          <div className="pt-8">
            <Masonry data={data} />
          </div>
        </div>
        <div
          className="
      pointer-events-none
      absolute inset-0
      bg-[radial-gradient(#0000001a_1px,_transparent_1px)]
      bg-[size:16px_16px]
      [mask-image:radial-gradient(circle_80%_at_50%_50%,#000_70%,transparent_110%)]
      z-0
    "
        />
      </section>
      <main className="">
        {/* <Banner /> */}
        <div className="container min-h-screen mx-auto max-w-screen-2xl">
          <div className="pb-2 ">
            <HotDeal category="Sản phẩm nổi bật" />
          </div>
          <Space />
          <AboutComponent />
          <Space />

          <div className="py-8">
            {" "}
            <AboutRental />
          </div>

          {/* <div className="pb-8">
            <HotDeal category="Sản phẩm mới về" />
          </div> */}
        </div>
      </main>
    </div>
  );
}
