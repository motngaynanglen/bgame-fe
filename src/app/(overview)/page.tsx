import Banner from "@/src/components/Banner/Banner";
import HotDeal from "@/src/components/Products/HotDeal";

export default function Home() {
  return (
    <div>
      <main className="md:container md:mx-auto pt-1 bg-sky-100">
        <Banner />
        <HotDeal category="Sản phẩm nổi bật"/>
        <HotDeal category="Sản phẩm mới về"/>
      </main>
    </div>
  );
}
