import FloatButtonContact from "@/src/components/Button/FloatButtonContact";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import React, { Suspense } from "react";
import Loading from "./loading";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
    
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="bg-gray-50">
        <main className="">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>
      </div>
      <FloatButtonContact />

      <Footer />
    </>
  );
}
