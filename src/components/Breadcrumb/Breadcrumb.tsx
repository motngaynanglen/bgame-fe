import { Button } from "antd";
import Link from "next/link";
import React from "react";

function Breadcrumb({ pageName = "Page Name", pageTitle = "Page Title" }) {
  return (
    <div className="relative pt-5">
    <img
      src="/assets/images/carousel1.jpg"
      alt="Banner 1"
      className="w-full lg:h-[500px]  h-[50vw] object-cover rounded-lg"
    />
    <div className="absolute inset-0 flex flex-col items-start justify-center px-16 ">
      <h2 className="text-white text-3xl font-bold bg-gray-700 py-5 px-4">
        Dịch vụ thuê board game <br/> tại cửa hàng BoGemStore
      </h2>
    </div>
  </div>
  );
}

export default Breadcrumb;
