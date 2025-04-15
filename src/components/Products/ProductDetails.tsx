"use client";
import productApiRequest from "@/src/apiRequests/product";
import { useStores } from "@/src/hooks/useStores";
import { useWishlistStore } from "@/src/store/wishlistStore";
import { useQuery } from "@tanstack/react-query";
import { Image, InputNumber, notification, Rate } from "antd";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { notifySuccess } from "../Notification/Notification";

interface BoardGameInfo {
  id: string;
  product_group_ref_id: string;
  product_name: string;
  sell_price: number;
  code: string;
  image: string;
  publisher: string;
  category: string;
  age: number;
  number_of_players_min: number;
  number_of_players_max: number;
  hard_rank: number;
  time: string;
  description: string;
  sales_quantity: number;
  rent_quantity: number;
}

interface responseModel {
  data: BoardGameInfo;
  message: string;
  statusCode: number;
  paging: null;
}

function ProductDetails({
  productId,
}: {
  productId: string | string[] | undefined;
}) {
  const [quantity, setQuantity] = useState(1);
  // const [boardgame, setBoardgame] = useState<BoardGameInfo | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const { stores } = useStores();

  const { addToCart } = useCartStore();
  const { addToWishlist } = useWishlistStore();
  const handleChange = (value: number | null) => {
    if (value !== null) {
      setQuantity(value);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN");
  };

  const handleAddProduct = () => {
    if (data) {
      const product = {
        id: data.data.id,
        product_group_ref_id: data.data.product_group_ref_id,
        name: data.data.product_name,
        price: data.data.sell_price,
        quantity: quantity,
        image: data.data.image,
      };
      addToCart(product, quantity); // Thêm sản phẩm với số lượng được chọn
      notifySuccess(
        "Thành công!",
        `${data.data.product_name} đã được thêm vào giỏ.`
      );
      console.log(product);
    }
  };

  // const handleAddWishlist = () => {
  //   if (boardgame) {
  //     const product = {
  //       id: boardgame.id,
  //       name: boardgame.product_name,
  //       image: boardgame.image,
  //       price: boardgame.price,
  //     };
  //     addToWishlist(product);
  // notifySuccess(
  //   "Thành công!",
  //   "Sản phẩm đã được thêm vào danh sách yêu thích."
  // );
  //   }
  // };

  const fetchBoardGamesById = async (productId: string) => {
    try {
      const res = await productApiRequest.getById({
        productId,
      });
      return res;
    } catch (error) {
      console.error("lỗi store: " + error);
      throw error; // Ném lỗi để React Query có thể xử lý
    }
  };

  const { data, isLoading, isError, error } = useQuery<responseModel>({
    queryKey: ["boardgameByID", productId],
    queryFn: () => fetchBoardGamesById(productId as string),
    enabled: !!productId,
  });

  if (isLoading) {
    return <div>Loading board games...</div>;
  }

  if (isError) {
    return <div>Mất kết nối từ server: {error?.message}</div>;
  }
  // useEffect(
  //   if (data) {
  //     setBoardgame(data);
  //
  // }, [data]);
  console.log("data nè: ", data);

  if (data) {
    const imageUrls = data.data.image?.split("||") || [];
    return (
      <div className="grid lg:grid-cols-12 pt-2 gap-6 lg:gap-10 mb-12 text-gray-800">
        {contextHolder}
        {/* Image Section */}
        <div className="lg:col-start-1 lg:col-end-7 col-span-12">
          <div className="space-y-4 col-start-2">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden flex justify-center items-center  border-gray-300">
              <Image
                src={imageUrls[0]}
                alt="Thumbnail"
                style={{ width: 612, height: 612, objectFit: "cover" }}
              />
              {/* <img src={boardgame?.image} alt="Thumbnail" className="w-full h-full object-contain" /> */}
            </div>

            <div className="flex space-x-4">
              <Image.PreviewGroup>
                {imageUrls
                  .filter((_, index) => index === 1)
                  .map((url, index) => (
                    <button
                      key={index}
                      className="border rounded-lg overflow-hidden focus:ring-2 focus:ring-orange-500 w-40 h-40 object-cover "
                    >
                      <Image
                        key={index}
                        src={url}
                        alt={`Board game ${index + 1}`}
                        // className="w-20 h-20 object-cover rounded-md"
                      />
                    </button>
                  ))}
              </Image.PreviewGroup>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6 lg:col-end-12 lg:col-span-5 col-span-12">
          {/* name product */}
          <h3 className="text-xl lg:text-4xl uppercase font-bold">
            {data?.data.product_name}
          </h3>
          <div className="flex items-center space-x-2">
            <Rate disabled defaultValue={5} />
            <Link href="#" className="text-sm text-gray-500 hover:underline">
              (5 đánh giá)
            </Link>
          </div>

          <div className="text-2xl font-semibold">
            {formatPrice(data?.data.sell_price ?? "Giá liên hệ")}{" "}
            {/* gia tien o day */}
            {/* <span className="line-through text-gray-400">$80.00</span> */}
          </div>

          {/* <div className="flex items-center space-x-2">
            <span className="text-gray-500">Nhà phát hành:</span>
            <Link href="#" className="text-orange-500 hover:underline">
              {data?.data.publisher}
            </Link>
          </div> */}
          {/* category */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Mã sản phẩm: </span>
            <Link href="#" className="text-orange-500 hover:underline">
              {/* {data?.data.category} */}
            </Link>
          </div>
          {/* status */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Trạng thái:</span>
            <span className="text-green-500">
              {data.data.sales_quantity > 0 ? (
                <p className="text-xs sm:text-sm font-medium text-green-500 dark:text-green-400">
                  Còn hàng
                </p>
              ) : (
                <p className="text-xs sm:text-sm font-medium text-red-500 dark:text-red-400">
                  Hết hàng
                </p>
              )}
            </span>
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
            {/* btn them sp vao gio hang */}
            <button
              disabled={data.data.sales_quantity <= 0}
              onClick={handleAddProduct}
              className={`bg-orange-500  text-white px-4 py-2 rounded-lg hover:bg-orange-600 ${
                data.data.sales_quantity > 0
                  ? ""
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              Thêm sản phẩm vào giỏ hàng
            </button>
            {/* btn mua ngay */}
            {/* <button
              disabled={data.data.sales_quantity <= 0}
              className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 ${
                data.data.sales_quantity > 0
                  ? ""
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              Mua ngay
            </button> */}
          </div>

          {/* btn them wishlist */}
          <ul className="flex space-x-6">
            <li>
              <button
                // onClick={handleAddWishlist}
                className="bg-orange-500  text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Thêm vào danh sách yêu thích
              </button>
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
          <div>
            <h2 className="p-1 font-semibold">
              Có {stores.length} cửa hàng còn sản phẩm
            </h2>
            {stores.length > 0 ? (
              <ul
                className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                     max-h-[100px] sm:max-h-[150px] overflow-y-auto"
              >
                {stores.map((store) => (
                  <li
                    key={store.id}
                    className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600"
                  >
                    {store.store_name} -{" "}
                    <Link
                      className="hover: underline-offset-1"
                      href={"https://maps.app.goo.gl/zMYvU3sV4LiMevgr5"}
                    >
                      {store.address}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Đang tải danh sách cửa hàng...</p>
            )}
          </div>
        </div>
      </div>
    );
  }
  return <div>Product not found.</div>;
}

export default ProductDetails;
