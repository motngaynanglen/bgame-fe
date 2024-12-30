import Banner from "@/src/components/Banner/Banner";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import HotDeal from "@/src/components/Products/HotDeal";
import React from "react";

export default function Home() {
  return (
    <div>
      <main className="md:container md:mx-auto pt-1 bg-sky-100">
        <Banner />
        <HotDeal />
      </main>
    </div>
  );
}
