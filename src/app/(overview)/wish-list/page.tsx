'use client';
import { useWishlistStore } from '@/src/store/wishlistStore'
import React from 'react'

export default function WishList() {
    const {wishlist, removeFromWishlist, clearWishlist} = useWishlistStore()
  return (
    <div className="min-h-screen">
    <h1 className="text-2xl font-bold mb-4 text-black pt-4">
      DANH SÁCH YÊU THÍCH CỦA BẠN
    </h1>
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="py-2 px-4 border border-gray-200">Sản phẩm</th>
            <th className="py-2 px-4 border border-gray-200">Giá</th>
            <th className="py-2 px-4 border border-gray-200">Được thêm vào ngày</th>
            <th className="py-2 px-4 border border-gray-200">
             
            </th>
           
          </tr>
        </thead>
        <tbody>
            {wishlist.map((item, index) => (
                <tr key={index} className="bg-gray-50 text-black">
                    <td className="py-4 px-4 border border-gray-200">
                        <div className="flex items-center">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                            <span className="ml-2">{item.name}</span>
                        </div>
                    </td>
                    <td className="py-4 px-4 border border-gray-200">{item.price}</td>
                    {/* <td className="py-4 px-4 border border-gray-200">{item.addedAt}</td> */}
                    <td className="py-4 px-4 border border-gray-200">
                        <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-white bg-red-500 px-4 py-2 rounded-lg"
                        >
                            Xóa
                        </button>
                    </td>
                </tr>
            ),)}
          {/* <tr>
            <td className="text-center text-black py-4">Không có đơn hàng nào.</td>
            <td className="text-center text-black py-4">Không có đơn hàng nào.</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  </div>
  )
}
