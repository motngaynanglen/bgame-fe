"use client";
import { useCartStore } from "@/src/store/cartStore";
import { notification } from "antd";
import { useRouter } from "next/navigation";
import SpotlightCard from "../Bits/SpotlightCard";
import { notifySuccess } from "../Notification/Notification";

function CardUsedProduct({
  id,
  image,
  title,
  price,
  age,
  time,
  player,
  quantity,
  product_group_ref_id,
}: {
  id: string;
  image: string;
  title: string | null | undefined;
  price: number;
  age: string | null | undefined;
  time: string;
  player: string;
  quantity: number;
  product_group_ref_id: string | null | undefined;
}) {
  const router = useRouter();

  const defaultImage = "/assets/images/bg1.jpg";
  const [api, contextHolder] = notification.useNotification();
  const { addToCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const product = {
      id: id,
      product_group_ref_id: product_group_ref_id,
      name: title,
      price: price,
      quantity: quantity,
      image: image,
    };
    addToCart(product, (quantity = 1));
    notifySuccess("Thành công!", `${title} đã được thêm vào giỏ.`);
    console.log("Thêm vào giỏ hàng:", id);
  };

  return (
    <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
      <>{contextHolder}</>

      <div onClick={() => router.push(`/used-games/${id}`)}>
        {/* ảnh sản phẩm */}
        <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.5)">
          <div className="relative h-[200px] w-full overflow-hidden rounded-t-md">
            <img
              className={`w-full h-full object-cover transition-opacity rounded-t-md `}
              src={image}
              alt=""
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />
          </div>

          {/* Thông tin sản phẩm */}
          <div className="pt-2 ">
            <h3
              className="uppercase text-base sm:text-xl font-medium leading-tight text-gray-900 hover:text-gray-500 dark:text-white 
    line-clamp-2 overflow-hidden break-words h-[36px] sm:h-[52px]"
            >
              {title}
            </h3>

            {/* <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center">
                <Rate disabled defaultValue={5} />
              </div>

              <p className="text-sm font-medium text-gray-900 dark:text-white">
                5.0
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden lg:block">
                (5)
              </p>
            </div> */}
            <div className="mt-2 flex items-center gap-2">
              {quantity > 0 ? (
                <p className="text-xs sm:text-sm font-medium text-green-500 dark:text-green-400">
                  Còn hàng
                </p>
              ) : (
                <p className="text-xs sm:text-sm font-medium text-red-500 dark:text-red-400">
                  Hết hàng
                </p>
              )}
            </div>

            <div className=" my-2" />
            {/* giá sản pham */}
            <div className="mt-4 relative">
              {/* Giá sản phẩm */}
              <p className="text-xl font-medium text-gray-900 transition-opacity duration-300 group-hover:opacity-50">
                {price?.toLocaleString()}đ
              </p>

              {/* Nút Thêm vào giỏ hàng (đè lên giá) */}
              {/* {quantity > 0 && (
                <button
                  className="absolute inset-0 w-full bg-gradient-to-b from-black to-gray-900 border border-gray-800 text-white  rounded-md 
                  opacity-0 group-hover:opacity-100 translate-y-[-100%] group-hover:translate-y-0
                  transition-all duration-500 ease-in-out"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </button>
              )} */}
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}

export default CardUsedProduct;
