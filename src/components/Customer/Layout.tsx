import React, { Suspense } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Loading from "@/src/app/(overview)/loading";
import SideBar from "./Sidebar";

export default function LayoutCustomer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col min-h-screen relative">
        <div className="sticky top-0 z-50">
          <Header />
        </div>

        <div className="flex-grow bg-sky-50">
          <div className="container mx-auto max-w-screen-xl px-2 sm:px-4 lg:px-6 flex relative">
            <aside className="w-1/4  bg-slate-600 text-white sticky top-[64px] h-[calc(100vh-64px)]">
              <SideBar />
            </aside>
            <div className="h-[300px] pt-6 min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>{" "}
            <main className="w-3/4 p-4">
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
