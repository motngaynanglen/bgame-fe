import Banner from "@/src/components/Banner/Banner";
import HotDeal from "@/src/components/Products/HotDeal";
import AboutUs from "../admin/content/aboutus/page";
import AboutComponent from "@/src/components/About/AboutComponent";
import { Divide } from "react-feather";
import AboutRental from "@/src/components/About/AboutRental";
import { Space } from "antd";

export default function Home() {
  return (
    <div className="bg-sky-50">
      <main className="">
        <Banner />
        <div className="">
          <Space/>
          <AboutComponent />
          <Space />
          <div className="pb-2">
            <HotDeal category="Sản phẩm nổi bật" />
          </div>
          <Space />
          <AboutRental />
          {/* <div className="pb-8">
            <HotDeal category="Sản phẩm mới về" />
          </div> */}
        </div>
      </main>
    </div>
  );
}
