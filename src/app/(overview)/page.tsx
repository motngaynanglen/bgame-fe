import AboutComponent from "@/src/components/About/AboutComponent";
import AboutRental from "@/src/components/About/AboutRental";
import Banner from "@/src/components/Banner/Banner";
import HotDeal from "@/src/components/Products/HotDeal";
import { Space } from "antd";

export default function Home() {
  return (
    <div className="bg-gray-100 ">
      <main className="">
        <Banner />
        <div className="container min-h-screen mx-auto max-w-screen-2xl">
          <Space />
          <AboutComponent />
          <Space />
          <div className="pb-2 ">
            <HotDeal category="Sản phẩm nổi bật" />
          </div>
          <div>
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
