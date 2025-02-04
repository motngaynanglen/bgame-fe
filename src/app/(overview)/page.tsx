import Banner from "@/src/components/Banner/Banner";
import HotDeal from "@/src/components/Products/HotDeal";

export default function Home() {
  return (
    <div className="bg-sky-50">
      <main className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-">
        <Banner />
        <div className="">
          <div className="mb-8">
            <HotDeal category="Sản phẩm nổi bật" />
          </div>
          <div className="">
            <HotDeal category="Sản phẩm mới về" />
          </div>
        </div>
      </main>
    </div>
  );
}
