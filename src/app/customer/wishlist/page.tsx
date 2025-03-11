"use client";
import { useWishlistStore } from "@/src/store/wishlistStore";
import React from "react";
import { FaCartShopping } from "react-icons/fa6";

export default function WishList() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlistStore();
  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black pt-4">
        DANH SÁCH YÊU THÍCH CỦA BẠN
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th></th>
              <th className=" p-2">Sản phẩm</th>
              <th className=" p-2">Giá</th>
              <th className=" p-2 ">Được thêm vào ngày</th>
              <th className=" p-2"></th>
              <th className=" p-2"></th>
            </tr>
          </thead>
          <tbody>
            {wishlist.map((item, index) => (
              <tr
                key={index}
                className="bg-gray-50 pb-2 text-black border-dashed border-b border-gray-300"
              >
                <td className="flex justify-center p-1  ">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg  m-2"
                  />
                </td>

                <td className=" p-2 text-center">{item.name}</td>

                <td className="p-2 text-center">{item.price}</td>
                <td className="py-4 px-4 text-center">{item.price}</td>
                <td className="p-2">
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-white bg-green-500 px-4 py-3 rounded-lg"
                  >
                    <FaCartShopping />
                  </button>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-white bg-red-500 px-4 py-2 rounded-lg"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {/* <tr>
            <td className="text-center text-black py-4">Không có đơn hàng nào.</td>
            <td className="text-center text-black py-4">Không có đơn hàng nào.</td>
          </tr> */}
          </tbody>
        </table>
        <div className="flex justify-between p-4">
          <button className="text-white bg-green-500 px-4 py-3 rounded-lg">
            Chia sẽ danh sách yêu thích
          </button>
          <button className="text-white bg-green-500 px-4 py-3 rounded-lg">
            Thêm tất cả vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
