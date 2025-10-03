"use client";
import productApiRequest from "@/src/apiRequests/product";
import storeApiRequest from "@/src/apiRequests/stores";
import { useStores } from "@/src/hooks/useStores";
import { useWishlistStore } from "@/src/store/wishlistStore";
import { useQuery } from "@tanstack/react-query";
import { Image, InputNumber, notification, Rate } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { notifySuccess } from "../Notification/Notification";

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
  number_of_player_min: number;
  number_of_player_max: number;
  hard_rank: number;
  time: string;
  description: string;
  sales_quantity: number;
  rent_quantity: number;
  duration: string | null | undefined;
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

  const {
    data: storesData,
    isLoading: isLoadingStores,
    isError: isErrorStores,
    error: errorStore,
  } = useQuery({
    queryKey: ["storesByProductTemplateId", productId],
    queryFn: async () => {
      const res = await storeApiRequest.getListAndProductCountById(productId as string);
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
  if (isErrorStores) {
    return <div>Mất kết nối từ server: {errorStore?.message}</div>;
  }

  onProductData(data?.data);

  console.log("data nè: ", data);

  if (data) {
    const imageUrls = data.data.image?.split("||") || [];

    return (
      <div className="bg-white my-4 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        {contextHolder}

        <div className="grid lg:grid-cols-12 gap-8 p-6 lg:p-8">
          {/* Image Gallery Section */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full h-[400px] max-w-md mx-auto aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {/* <Image
                  src={imageUrls[0]}
                  alt={data.data.product_name}
                  className="w-full h-full object-scale-down" // Hoặc object-contain
                  preview={false}
                  style={{
                    objectFit: "scale-down", // Tự động co dãn vừa khít
                    backgroundColor: "#f8fafc", // Màu nền trùng với background
                  }}
                /> */}
                {/* <div className="w-full h-[220px] rounded-lg overflow-hidden"> */}
                <img
                  src={imageUrls[0]}
                  alt={data.data.product_name}
                  className="w-full h-full object-cover"
                />
                {/* </div> */}
                {data.data.sales_quantity <= 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      HẾT HÀNG
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {imageUrls.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  <Image.PreviewGroup>
                    {imageUrls.map((url, index) => (
                      <button
                        key={index}
                        className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange-500 transition-colors"
                      >
                        <Image
                          src={url}
                          alt={`${data.data.product_name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </Image.PreviewGroup>
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-5 space-y-6">
            {/* Product Header */}
            <div className="space-y-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {data.data.product_name}
              </h1>

              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-3xl font-bold text-orange-600">
                  {formatPrice(data.data.price)}₫
                </span>
              </div>
            </div>

            {/* Product Meta */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Mã SP</span>
                  <p className="font-medium">{data.data.code}</p>
                </div>
                <div>
                  <span className="text-gray-500">Nhà phát hành</span>
                  <p className="font-medium">
                    {data.data.publisher || "Đang cập nhật"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Số lượng kho</span>
                  <p className="font-medium text-lg">
                    {data.data.sales_quantity} sản phẩm
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Trạng Thái</span>
                  <p
                    className={`text-lg ${
                      data.data.sales_quantity > 0
                        ? " text-green-800"
                        : " text-red-800"
                    }`}
                  >
                    {data.data.sales_quantity > 0 ? "CÒN HÀNG" : "HẾT HÀNG"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Số lượng:
              </label>
              <InputNumber
                min={1}
                max={data.data.sales_quantity}
                value={quantity}
                onChange={handleChange}
                className="w-24"
                disabled={data.data.sales_quantity <= 0}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                disabled={data.data.sales_quantity <= 0}
                onClick={handleAddProduct}
                className={`flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all ${
                  data.data.sales_quantity <= 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg"
                }`}
              >
                🛒 Thêm vào giỏ hàng
              </button>

              <button
                disabled={data.data.sales_quantity <= 0}
                onClick={handleBuyNow}
                className={`flex-1 bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-all ${
                  data.data.sales_quantity <= 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg"
                }`}
              >
                ⚡ Mua ngay
              </button>
            </div>

            {/* Store Availability */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                📍 Có {storesData?.length || 0} cửa hàng có sẵn
              </h3>

              {storesData && storesData.length > 0 ? (
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {storesData.slice(0, 3).map((store: any) => (
                    <div
                      key={store.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {store.store_name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {store.address}
                        </p>
                      </div>
                      <span className="text-xs text-green-600 font-semibold">
                        {store.sale_count || "đang cập nhật số lượng sản phẩm"} sản phẩm
                      </span>
                    </div>
                  ))}
                  {storesData.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{storesData.length - 3} cửa hàng khác
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Đang tải thông tin cửa hàng...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div>Product not found.</div>;
}

export default ProductDetails;
