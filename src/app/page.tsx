"use client";
import Banner from "@/components/Banner/Banner";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import HotDeal from "@/components/Products/HotDeal";

export default function Home() {
  

  return (
    <>
      <header>
        <Header />
      </header>
      <main className="md:container md:mx-auto pt-5 ">
        <Banner />
        <HotDeal />
      </main>
      <footer className="bg-white rounded-lg shadow ">
        <Footer />
      </footer>
    </>
  );
}


