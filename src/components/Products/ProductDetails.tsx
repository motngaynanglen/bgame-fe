"use client";
import productApiRequest from "@/src/apiRequests/product";
import { useStores } from "@/src/hooks/useStores";
import { useWishlistStore } from "@/src/store/wishlistStore";
import { useQuery } from "@tanstack/react-query";
import { Image, InputNumber, notification, Rate } from "antd";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import Magnet from "../Bits/Magnet ";
import { notifySuccess } from "../Notification/Notification";
import { useRouter } from "next/navigation";
import storeApiRequest from "@/src/apiRequests/stores";

interface BoardGameInfo {
  id: string;
  product_group_ref_id: string;
  product_name: string;
  price: number;
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
  onProductData,
}: {
  productId: string | string[] | undefined;
  onProductData: (data: BoardGameInfo | undefined) => void;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  // const [boardgame, setBoardgame] = useState<BoardGameInfo | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const { stores } = useStores();

  const { addToCart, setBuyNowItem } = useCartStore();
  const { addToWishlist } = useWishlistStore();
  const handleChange = (value: number | null) => {
    if (value !== null) {
      setQuantity(value);
    }
  };

  const handleBuyNow = () => {
    if (data) {
      const product = {
        id: data.data.id,
        product_group_ref_id: data.data.product_group_ref_id,
        name: data.data.product_name,
        price: data.data.price,
        quantity: quantity,
        image: data.data.image,
        storeId: undefined,
        storeList: stores.map((store) => ({
          id: store.id,
          name: store.store_name,
          quantity: 0,
        })),
      };
      setBuyNowItem(product, quantity);
      router.push("/check-out");
      console.log(product);
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
        price: data.data.price,
        quantity: quantity,
        image: data.data.image,
        storeId: undefined,
        storeList: stores.map((store) => ({
          id: store.id,
          name: store.store_name,
          quantity: quantity,
        })),
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

  // const fetchBoardGamesById = async (productId: string) => {
  //   try {
  //     const res = await productApiRequest.getById({
  //       productId,
  //     });
  //     return res;
  //   } catch (error) {
  //     console.error("lỗi store: " + error);
  //     throw error; // Ném lỗi để React Query có thể xử lý
  //   }
  // };

  const { data, isLoading, isError, error } = useQuery<responseModel>({
    queryKey: ["boardgameByID", productId],
    queryFn: async () => {
      // Hàm gọi API
      const res = await productApiRequest.getById({
        productId: productId as string,
      });
      return res;
    },
    enabled: !!productId,
  });

  console.log("hehe: ", productId);

  const { data: storesData, isLoading: isLoadingStores, isError: isErrorStores, error: errorStore } = useQuery({
    queryKey: ["storesByProductTemplateId", productId],
    queryFn: async () => {
      const res = await storeApiRequest.getListAndProductCountById({
        productTemplateId: productId,
      });
      return res.data;
    },
    enabled: !!productId,
  });
  console.log("first: ", storesData);

  if (isLoadingStores) {
    return <div>Loading stores...</div>;
  }

  // if (isLoading) {
  //   return <div>Loading board games...</div>;
  // }

  if (isError) {
    return <div>Mất kết nối từ server: {error?.message}</div>;
  }
  if(isErrorStores) {
    return <div>Mất kết nối từ server: {errorStore?.message}</div>;}

  onProductData(data?.data);

  console.log("data nè: ", data);

  if (data) {
    const imageUrls = data.data.image?.split("||") || [];
    return (
      <div className="grid lg:grid-cols-12  gap-6 lg:gap-10 mb-8 text-gray-800 border-2 rounded-lg border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        {contextHolder}
        {/* Image Section */}
        <div className="lg:col-start-1 lg:col-end-7 col-span-12 ">
          <div className="space-y-4 col-start-2">
            <div className="relative w-full  border-2 rounded-lg overflow-hidden flex justify-center items-center  border-gray-300">
              <Image
                src={imageUrls[0]}
                alt="Thumbnail"
                style={{ width: "auto", height: "auto", objectFit: "cover" }}
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
        <div className="space-y-6 lg:col-end-12 lg:col-span-5 col-span-12 ">
          {/* name product */}
          <h3 className="font-body text-xl lg:text-4xl uppercase font-bold">
            {data?.data.product_name}
          </h3>
          <div className="flex items-center space-x-2">
            <Rate disabled defaultValue={5} />
            <Link href="#" className="text-sm text-gray-500 hover:underline">
              (5 đánh giá)
            </Link>
          </div>

          <div className="text-2xl font-semibold">
            {formatPrice(data?.data.price ?? "Giá liên hệ")}{" "}
            {/* gia tien o day */}
            {/* <span className="line-through text-gray-400">$80.00</span> */}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Nhà phát hành:</span>
            <Link href="#" className="text-tertiary hover:underline">
              {data?.data.publisher}
            </Link>
          </div>
          {/* category */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Mã sản phẩm: </span>
            <Link href="#" className="text-tertiary hover:underline">
              {data?.data.code}
            </Link>
          </div>
          {/* status */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Trạng thái:</span>
            <span className="text-green-500">
              {data.data.sales_quantity > 0 ? (
                <span className="font-medium text-secondary dark:text-green-400">
                  Còn hàng
                </span>
              ) : (
                <span className="font-medium text-red-500 dark:text-red-400">
                  Hết hàng
                </span>
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
              className={`bg-gradient-to-b from-tertiary to-gray-700 border  text-white px-4 py-2 rounded-lg hover:bg-orange-600 ${
                data.data.sales_quantity > 0
                  ? ""
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              Thêm vào giỏ hàng
            </button>
            {/* btn mua ngay */}
            {/* <Magnet padding={10} disabled={false} magnetStrength={2}>
              <button
                disabled={data.data.sales_quantity <= 0}
                className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary ${
                  data.data.sales_quantity > 0
                    ? ""
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleBuyNow}
              >
                Mua ngay
              </button>
            </Magnet> */}
          </div>

          {/* btn them wishlist */}
          {/* <ul className="flex space-x-6">
            <li>
              <button
                // onClick={handleAddWishlist}
                className="bg-gradient-to-b from-tertiary to-gray-700 border  text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Thêm vào danh sách yêu thích
              </button>
            </li>
          </ul> */}
          {/* <div>
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
          </div> */}
          <div>
            <h2 className="p-1 font-semibold">
              Có {(storesData && Array.isArray(storesData) ? storesData.length : 0)} cửa hàng còn sản phẩm
            </h2>

            {storesData && storesData.length > 0 ? (
              <ul
                className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                     max-h-[100px] sm:max-h-[150px] overflow-y-auto"
              >
                {storesData.map((store: any) => (
                  <li
                    key={store.id}
                    className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600"
                  >
                    {store.store_name} -{" "}
                    {/* <Link
                      className="hover: underline-offset-1"
                      href={"https://maps.app.goo.gl/zMYvU3sV4LiMevgr5"}
                    > */}
                    {store.address}
                    {/* </Link> */}
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
