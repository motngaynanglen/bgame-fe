"use client";
import { useParams } from "next/navigation";
import productApiRequest from "@/src/apiRequests/product";
import { useStores } from "@/src/hooks/useStores";
import { useWishlistStore } from "@/src/store/wishlistStore";
import { useQuery } from "@tanstack/react-query";
import {
  Collapse,
  Descriptions,
  DescriptionsProps,
  Image,
  InputNumber,
  notification,
  Rate,
} from "antd";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import storeApiRequest from "@/src/apiRequests/stores";
import { useCartStore } from "@/src/store/cartStore";
import { notifySuccess } from "@/src/components/Notification/Notification";
import Magnet from "@/src/components/Bits/Magnet ";
import consignmentApiRequest from "@/src/apiRequests/consignment";

interface BoardGameInfo {
  id: string;
  product_group_ref_id: string;
  product_name: string;
  sale_price: number;
  sell_price: number;
  code: string;
  images: string;
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
  status: string;
  condition: number;
  missing: string;
}

interface responseModel {
  data: BoardGameInfo;
  message: string;
  statusCode: number;
  paging: null;
}

export default function UseGameDetail() {
  const { id } = useParams();
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
        price: data.data.sell_price,
        quantity: quantity,
        image: data.data.images,
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
        price: data.data.sell_price,
        quantity: quantity,
        image: data.data.images,
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
    queryKey: ["boardgameByID", id],
    queryFn: async () => {
      // Hàm gọi API
      const res = await consignmentApiRequest.getConsignmentById({
        consignmentOrderId: id as string,
      });
      return res;
    },
    enabled: !!id,
  });

  console.log("hehe: ", id);

  // if (isLoading) {
  //   return <div>Loading board games...</div>;
  // }

  // if (isError) {
  //   return <div>Mất kết nối từ server: {error?.message}</div>;
  // }

  // onProductData(data?.data);

  console.log("data nè: ", data);

  const items: DescriptionsProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: <h1 className="text-xl">Trạng thái</h1>,
        span: 1,
        children: <p className="text-xl">{data?.data.condition}</p>,
      },
      {
        key: "2",
        label: <h1 className="text-xl">Thiếu thành phần</h1>,
        children: <p className="text-xl">{data?.data.missing}</p>,
      },
      // {
      //   key: "3",
      //   label: <h1 className="text-xl"></h1>,
      //   children: <p className="text-xl"></p>,
      // },
      // {
      //   key: "4",
      //   label: <h1 className="text-xl">Độ tuổi đề xuất</h1>,
      //   children: <p className="text-xl"></p>,
      // },
      // {
      //   key: "5",
      //   label: <h1 className="text-xl">Bản mở rộng</h1>,
      //   children: (
      //     <p className="text-xl">
      //       Bản mở rộng số 1 <br />
      //       Bản mở rộng số 2
      //     </p>
      //   ),
      // },
    ],
    [data]
  );

  if (data) {
    const imageUrls = data.data.images?.split("||") || [];
    return (
      <div>
        <div className=" grid lg:grid-cols-12 gap-6 lg:gap-10 text-gray-800 border-2 rounded-lg border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
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
            {/* <div className="flex items-center space-x-2">
              <Rate disabled defaultValue={5} />
              <Link href="#" className="text-sm text-gray-500 hover:underline">
                (5 đánh giá)
              </Link>
            </div> */}

            <div className="text-2xl font-semibold">
              {formatPrice(data?.data.sale_price ?? "Giá liên hệ")}{" "}
              {/* gia tien o day */}
              {/* <span className="line-through text-gray-400">$80.00</span> */}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Trạng thái :</span>
              <Link href="#" className="text-tertiary hover:underline">
                {data?.data.condition === 0
                  ? "New in shink"
                  : data?.data.condition === 1
                  ? "Như mới"
                  : data?.data.condition === 2
                  ? "Rất tốt"
                  : data?.data.condition === 3
                  ? "Tốt"
                  : data?.data.condition === 4
                  ? "Khá"
                  : data?.data.condition === 5
                  ? "Kém"
                  : "Unknown"}
              </Link>
            </div>
            {/* category */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Thành phần bị thiếu: </span>
              <Link href="#" className="text-tertiary hover:underline">
                {data?.data.missing || "Không có"}
              </Link>
            </div>

             <div className="flex items-center space-x-2">
              <span className="text-gray-500">Mô tả: </span>
              <Link href="#" className="text-tertiary hover:underline">
                {data?.data.description || "Không có"}
              </Link>
            </div>

            {/* status */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Trạng thái:</span>
              <span className="text-green-500">
                {data.data.status === "ACTIVE" ? (
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
            {/* <div className="flex items-center space-x-2">
              <span className="text-gray-500">Số lượng:</span>
              <div className="relative">
                <InputNumber
                  min={1}
                  value={quantity}
                  onChange={handleChange}
                  className="custom-input-number"
                />
              </div>
            </div> */}

            <div className="flex items-center space-x-4">
              {/* btn them sp vao gio hang */}
              {/* <button
              disabled={data.data.sales_quantity <= 0}
              onClick={handleAddProduct}
              className={`bg-gradient-to-b from-tertiary to-gray-700 border  text-white px-4 py-2 rounded-lg hover:bg-orange-600 ${
                data.data.sales_quantity > 0
                  ? ""
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              Thêm vào giỏ hàng
            </button> */}
              {/* btn mua ngay */}
              <Magnet padding={10} disabled={false} magnetStrength={2}>
                <button
                  disabled={data.data.status !== "ACTIVE"}
                  className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary ${
                    data.data.status === "ACTIVE"
                      ? ""
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleBuyNow}
                >
                  Mua ngay
                </button>
              </Magnet>
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
          </div>
        </div>
        {/* <Collapse
          defaultActiveKey={["1"]}
          expandIconPosition="right"
          items={[
            {
              key: "1",
              label: <h1 className="text-xl">Mô tả sản phẩm</h1>,
              children: (
                <div>
                  <Descriptions bordered items={items} column={1} />
                  <p className="text-gray-600 mt-4 ml-2 text-xl">
                    {data?.data.description || "Boardgame rất hay"}
                  </p>
                </div>
              ),
            },
          ]}
        /> */}
      </div>
    );
  }
  return <div>Product not found.</div>;
}
