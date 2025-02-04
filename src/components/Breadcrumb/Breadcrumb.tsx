import { Button } from "antd";
import Link from "next/link";
import React from "react";

function Breadcrumb({ pageName = "Page Name", pageTitle = "Page Title" }) {
  return (
    <div className="relative">
    <img
      src="/assets/images/carousel1.jpg"
      alt="Banner 1"
      className="w-full h-[500px] object-cover"
    />
    <div className="absolute inset-0 flex flex-col items-start justify-center px-16 bg-gradient-to-r from-black/30 via-transparent to-transparent">
      <h2 className="text-white text-3xl font-bold bg-gray-700 py-5 px-4">
        Dịch vụ thuê board game <br/> tại cửa hàng BoGemStore
      </h2>
    </div>
  </div>
  );
}

export default Breadcrumb;
