import { Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
// import ProductPriceCount from "./ProductPriceCount";

function ProductDetails(): JSX.Element {
  return (
    <div className="grid lg:grid-cols-2 p-4 gap-10 mb-32 text-gray-800">
      {/* Image Section */}
      <div>
        <div className="space-y-4">
          <div className="w-auto h-auto">
            <Image
              className="w-full h-auto object-cover"
              src="/assets/images/tqs.jpg"
              alt="Product"
            />
          </div>
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                className="border rounded-lg overflow-hidden focus:ring-2 focus:ring-orange-500"
              >
                <Image
                  src={`/assets/images/tqs.jpg`}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        <h3 className="text-5xl uppercase font-bold">Tam Quốc Sát</h3>
        <div className="flex items-center space-x-2">
          <Rate disabled defaultValue={5} />
          <Link href="#" className="text-sm text-gray-500 hover:underline">
            (455 customer review)
          </Link>
        </div>

        <div className="text-lg font-semibold">
          800.000 vnđ
          {/* <span className="line-through text-gray-400">$80.00</span> */}
        </div>
        <p className="text-gray-600 leading-relaxed">
          Donec bibendum enim ut elit porta ullamcorper. Vestibulum Nai
          wekemdini iaculis vitae nulla. Morbi mattis nec mi ac mollis.
        </p>
        <div className="flex items-center space-x-4">
          {/* <ProductPriceCount price={30} /> */}

          <Link
            href="/cart"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Add to cart
          </Link>

          <Link
            href="/cart"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Buy Now
          </Link>
        </div>

        <ul className="flex space-x-6">
          <li>
            <Link href="#" className="text-gray-500 hover:text-orange-500">
              Add to wishlist
            </Link>
          </li>
        </ul>
        <div>
          <h6 className="font-semibold">Guaranteed Safe Checkout</h6>
          <div className="flex space-x-4">
            {["visa2", "mastercard", "vnpay", "paypal", "pay"].map((item) => (
              <Image
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
