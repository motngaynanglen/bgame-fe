"use client";
import { useCartStore } from "@/src/store/cartStore";
import { Button, notification, Rate } from "antd";
import { useRouter } from "next/navigation";
import { notifySuccess } from "../Notification/Notification";

function CardProduct({
  id,
  image,
  title,
  price,
  complexity,
  age,
  time,
  player,
  quantity,
  product_group_ref_id,
}: {
  id: string;
  image: string;
  title: string;
  price: number;
  complexity: number;
  age: number;
  time: string;
  player: string;
  quantity: number;
  product_group_ref_id: string;
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
      <div
        onClick={() => router.push(`/boardgame/${id}`)}
        className="rounded-lg   bg-white p-2  dark:border-gray-700 dark:bg-gray-800 hover:shadow-blue-300 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
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

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              <Rate disabled defaultValue={5} />
            </div>

            <p className="text-sm font-medium text-gray-900 dark:text-white">
              5.0
            </p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden lg:block">
              (5)
            </p>
          </div>

          {/* <ul className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4">
            <li className="flex items-center gap-2">
              <AiOutlineClockCircle className="fill-black" />
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                {time}
              </p>
            </li>
            <li className="flex items-center gap-2">
              <BsPeople className="fill-black" />
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                {player}
              </p>
            </li>
          </ul>

          <ul className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4">
            <li className="flex items-center gap-2">
              <GoPeople className="fill-black" />
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                {age}+
              </p>
            </li>
            <li className="flex items-center gap-2">
              <LuBrain className="" />
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                {complexity}/5
              </p>
            </li>
          </ul> */}
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
  );
}

export default CardProduct;
