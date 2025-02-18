"use client";
import { Image, InputNumber, Rate } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { useRouter } from "next/router";

// const boardGameInfo = {
//   id: "1",
//   image: "/assets/images/tqs.jpg",
//   title: "Tam Quốc Sát",
//   price: 800000,
//   publisher: "Yoka Games",
//   productCode: "TQS-001",
//   category: "Board Game",
//   status: "Còn hàng",
// };


interface BoardGameInfo {
  id: string;
  title: string;
  price: number ;
  status: boolean;
  image: string;
  publisher: string; 
  category: string;
}



function ProductDetails({productId}: {productId: string | string[] | undefined}) {
  const [quantity, setQuantity] = useState(1);
  const [boardgame, setBoardgame] = useState<BoardGameInfo | null>(null);

  const { addToCart } = useCartStore();
  const handleChange = (value: number | null) => {
    if (value !== null) {
      setQuantity(value);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN");
  };

  const handleAddProduct = () => {
    if (boardgame) {
      const product = {
        id: boardgame.id,
        name: boardgame.title,
        price: boardgame.price,
        quantity: quantity,
        image: boardgame.image,
      };
      addToCart(product, quantity); // Thêm sản phẩm với số lượng được chọn
      alert("Đã thêm vào giỏ hàng!");
    }
  };

  const fetchBoardGame = async () => {
    try {
      const res = await fetch(`https://677fbe1f0476123f76a7e213.mockapi.io/BoardGame/${productId}`);
      const data = await res.json();
      console.log(data);
      setBoardgame(data); 
    } catch (error) {
      console.error("lỗi nè: "+error);
    }
  }

  React.useEffect(() => {
    fetchBoardGame();
  }, []);


  return (
    <div className="grid lg:grid-cols-12 p-4 gap-6 lg:gap-10 mb-12 text-gray-800">
      {/* Image Section */}
      <div className="lg:col-start-1 lg:col-end-7 col-span-12">
        <div className="space-y-4 col-start-2">
          <div >
            <Image src={`/assets/images/tqs.jpg`}  />
          </div>

          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                className="border rounded-lg overflow-hidden focus:ring-2 focus:ring-orange-500"
              >
                <Image
                  src={boardgame?.image}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6 lg:col-end-12 lg:col-span-5 col-span-12">
        {/* name product */}
        <h3 className="text-3xl lg:text-5xl uppercase font-bold">
          {boardgame?.title}
        </h3>
        <div className="flex items-center space-x-2">
          <Rate disabled defaultValue={5} />
          <Link href="#" className="text-sm text-gray-500 hover:underline">
            (455 customer review)
          </Link>
        </div>

        <div className="text-2xl font-semibold">
          {formatPrice(boardgame?.price ?? 0)}đ{/* gia tien o day */}
          {/* <span className="line-through text-gray-400">$80.00</span> */}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Nhà phát hành:</span>
          <Link href="#" className="text-orange-500 hover:underline">
            {boardgame?.publisher}
          </Link>
        </div>


        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Danh mục:</span>
          <Link href="#" className="text-orange-500 hover:underline">
            {boardgame?.category}
          </Link>
        </div>
        {/* status */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Trạng thái:</span>
          <span className="text-green-500">{boardgame?.status ? <p>Hết hàng</p>: <p>Còn hàng</p>}</span>
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

          <button
            onClick={handleAddProduct}
            className="bg-orange-500  text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Thêm sản phẩm
          </button>

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
