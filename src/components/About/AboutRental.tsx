"use client";
import { useRouter } from "next/navigation";
import React from "react";
import StarBorder from "../Bits/StarBorder";

export default function AboutRental() {
  const router = useRouter();
  return (
    <div className="hidden lg:block pb-6 ">
      <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="md:ml-6 mr-6 mt-4 md:mt-4 ">
          {/* <h2 className="text-gray-500 text-sm">VỀ CHÚNG TÔI</h2> */}
          <h2 className="text-4xl font-bold text-black-2">
            Trải nghiệm board game tại Board Game Impact
          </h2>
          <p className="mt-4 text-gray-700">
            Board Game Impact là cung cấp các dịch vụ liên quan đến board game
            như tổ chức giải đấu, tổ chức sự kiện, thuê board game tại những cửa
            hàng của chúng tôi.
          </p>
          {/* <div className="flex mt-12 justify-around text-center">
              <div>
                <h2 className="text-4xl font-bold text-black-2">150+</h2>
                <p className="mt-2 text-gray-700">Board game </p>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-black-2">5</h2>
                <p className="mt-2 text-gray-700">Cửa hàng</p>
              </div>
            </div> */}
          <div className="mt-4">
            <StarBorder
              as="button"
              className="custom-class"
              color="#BED3AB"
              speed="2s"
              onClick={() => router.push("/rental")}
            >
              Đặt lịch thuê board game
            </StarBorder>
          </div>
        </div>
        <img
          className="w-full lg:h-[400px] object-cover rounded-t-lg  md:h-auto  md:rounded-none md:rounded-s-lg"
          src="/assets/images/carousel1.jpg"
          alt="Modern building architecture"
        />
      </div>
    </div>
  );
}
