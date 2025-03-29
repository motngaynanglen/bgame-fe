import AboutComponent from "@/src/components/About/AboutComponent";
import AboutRental from "@/src/components/About/AboutRental";
import Banner from "@/src/components/Banner/Banner";
import HotDeal from "@/src/components/Products/HotDeal";
import { Space } from "antd";

export default function Home() {
  return (
    <div className="bg-sky-50">
      <main className="">
        <Banner />
        <div>
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
