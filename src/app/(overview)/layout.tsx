
import Footer from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Header";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
