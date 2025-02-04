"use client";
import { Image, InputNumber, Rate } from "antd";
import Link from "next/link";
import React, { useState } from "react";


const boardGameInfo = {
  image: "/assets/images/tqs.jpg",
  title: "Tam Quốc Sát",
  price: 800000,
  publisher: "Yoka Games",
  productCode: "TQS-001",
  category: "Board Game",
  status: "Còn hàng",
}

function ProductDetails() {
  const [quantity, setQuantity] = useState(1); 

  const handleChange = (value: number | null) => {
    if (value !== null) {
      setQuantity(value);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN"); 
  };

  
  return (

    <div className="grid lg:grid-cols-12 p-4 gap-10 mb-12 text-gray-800">
      {/* Image Section */}
      <div className="col-start-2 col-end-7">
        <div className="space-y-4 col-start-2">
          <div>
            <Image
              src={`/assets/images/tqs.jpg`}
            />
          </div>

          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                className="border rounded-lg overflow-hidden focus:ring-2 focus:ring-orange-500"
              >
                <Image
                  src={boardGameInfo.image}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6 col-end-11 col-span-4">
        {/* name product */}
        <h3 className="text-5xl uppercase font-bold">{boardGameInfo.title}</h3>
        <div className="flex items-center space-x-2">
          <Rate disabled defaultValue={5} />
          <Link href="#" className="text-sm text-gray-500 hover:underline">
            (455 customer review)
          </Link>
        </div>

        <div className="text-lg font-semibold">
        {formatPrice(boardGameInfo.price)}đ{/* gia tien o day */}
          {/* <span className="line-through text-gray-400">$80.00</span> */}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Thương hiệu:</span>
          <Link href="#" className="text-orange-500 hover:underline">
            {boardGameInfo.publisher}
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Mã sản phẩm:</span>
          <span className="text-gray-900">TQS-001</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Danh mục:</span>
          <Link href="#" className="text-orange-500 hover:underline">
            {boardGameInfo.category}
          </Link>
        </div>
        {/* status */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Trạng thái:</span>
          <span className="text-green-500">{boardGameInfo.status}</span>
        </div>
        {/* quality */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Số lượng:</span>
          <div className="relative">
            <InputNumber
              min={1}
              value={quantity}
              onChange={handleChange}
              className="custom-input-number"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* <ProductPriceCount price={30} /> */}

          <Link
            href="/cart"
            className="bg-orange-500  text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Thêm vào giỏ hàng
          </Link>

          <Link
            href="/cart"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Mua ngay
          </Link>
        </div>

        <ul className="flex space-x-6">
          <li>
            <Link
              href="#"
              className="bg-orange-500  text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Thêm vào danh sách yêu thích
            </Link>
          </li>
        </ul>
        <div>
          <h6 className="font-semibold">Phương thức thanh toán</h6>
          <div className="flex space-x-4">
            {["visa2", "mastercard", "vnpay", "paypal", "pay"].map((item) => (
              <img
                key={item}
                src={`/assets/icon/${item}.svg`}
                alt={item}
                className="w-10 h-auto"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
