"use client";
import { CartItem, useCartStore } from "@/src/store/cartStore";
import { Button, notification, Rate } from "antd";
import { useRouter } from "next/navigation";
import { notifySuccess } from "../Notification/Notification";

function CardHotDeal({
  id,
  image,
  title,
  price,
  soldOut,
  complexity,
  time,
  player,
  quantity,
  product_group_ref_id,
  duration,
  age,
  number_of_player_max,
  number_of_player_min,
  publisher,
}: {
  id: string;
  image: string;
  title: string;
  price: number;
  soldOut: boolean;
  complexity: number;
  time: string;
  player: string;
  quantity: number;
  product_group_ref_id: string;
  number_of_player_min: number;
  number_of_player_max: number;
  duration: string | null | undefined;
  age: string | null | undefined;
  publisher: string | null | undefined;
}) {
  const router = useRouter();

  const defaultImage = "/assets/images/bg1.jpg";
  const [api, contextHolder] = notification.useNotification();
  const { addToCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const product: CartItem = {
      id: id,
      // product_group_ref_id: product_group_ref_id,
      name: title,
      price: price,
      quantity: quantity,
      image: image,
      storeId: undefined,
      storeList: undefined,
    };
    addToCart(product, (quantity = 1));
    notifySuccess("Thành công!", `${title} đã được thêm vào giỏ.`);
    console.log("Thêm vào giỏ hàng:", id);
  };
  return (
    <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 card-product w-full min-w-0 ">
      <>{contextHolder}</>
      <div className="relative w-full h-[400px] perspective-1000">
        <div className=" w-full h-full transform-3d">
          {/* Mặt sau */}
          <div className="card-back backface-hidden overflow-hidden  absolute rotate-y-180 w-full h-full  rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800 hover:shadow-blue-300">
            <img
              src={"/assets/images/card-back2.jpg"}
              alt=""
              className={`w-full h-full object-cover transition-opacity rounded-t-md `}
            />
          </div>

          {/* Mặt trước */}
          <div
            onClick={() => router.push(`/boardgame/${id}`)}
            className="absolute overflow-hidden w-full h-full card-front backface-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800 hover:shadow-blue-300"
          >
            {/* ảnh sản phẩm */}
            <div className="relative h-[200px] w-full overflow-hidden rounded-t-md">
              <img
                className={`w-full h-full object-cover transition-opacity rounded-t-md `}
                src={image}
                alt=""
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultImage;
                }}
                loading="lazy"
                height={200}
                width={200}
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
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex flex-col">
                <span>
                  {" "}
                  ⏰ {duration ?? "xx"} phút - 🎂 {age ?? "xx"}+ tuổi
                </span>
                <span>
                  👥 {number_of_player_min || "xx"} -{" "}
                  {number_of_player_max || "xx"} người
                </span>
              </div>
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

              <div className="border-t my-2" />
              {/* giá sản pham */}
              <div className="mt-4 relative">
                {/* Giá sản phẩm */}
                <p className="text-xl font-medium text-gray-900 transition-opacity duration-300 group-hover:opacity-50">
                  {price?.toLocaleString()}đ
                </p>

                {/* Nút Thêm vào giỏ hàng (đè lên giá) */}
                {quantity > 0 && (
                  <Button
                    type="primary"
                    className="absolute inset-0 w-full bg-blue-500 text-white px-4 py-2 rounded-md 
        opacity-0 group-hover:opacity-100 translate-y-[-100%] group-hover:translate-y-0
        transition-all duration-500 ease-in-out"
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardHotDeal;
