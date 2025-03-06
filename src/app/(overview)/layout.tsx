import FloatButtonContact from "@/src/components/Button/FloatButtonContact";
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import { FloatButton } from "antd";
import FloatButtonGroup from "antd/es/float-button/FloatButtonGroup";
import React, { Suspense } from "react";
import Loading from "./loading";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="bg-sky-50">
        <main className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>
      </div>
      {/* <FloatButtonGroup shape="circle" style={{ insetInlineEnd: 24 }}> */}
        <FloatButtonContact />
        {/* <FloatButton.BackTop />  */}
      {/* </FloatButtonGroup> */}

      <Footer />
    </>
  );
}
