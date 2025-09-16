"use client";
import { useRentalStore } from "@/src/store/rentalStore";
import { Button, Divider, Empty } from "antd";
import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";

export default function CartRental({
  storeId,
  onChooseTable,
}: {
  storeId: string | null;
  onChooseTable?: () => void;
}) {
  const { cartItems, removeFromCart } = useRentalStore();

  console.log("cartitems", cartItems);

  useEffect(() => {}, [onChooseTable]);

  return (
    <div className="w-full h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <div className="border-b-2 mb-2">
        <span className="text-black font-bold">DS BG bạn thuê</span>
      </div>
      <div className="space-y-4">
        {cartItems.length === 0 ? (
          <div className="text-white">
            <Empty
              description={
                <span className="text-black-2">
                  Không có sản phẩm thuê trong giỏ hàng
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            ></Empty>
          </div>
        ) : (
          <div>
            {cartItems.map((item, index) => {
              const imageUrls = item.image?.split("||") || [];
              return (
                <div
                  key={index}
                  className="bg-gray-800 p-2 rounded-lg mb-4 flex justify-between items-center"
                >
                  {/* image and name */}
                  <div className="flex flex-row sm:items-start sm:justify-around md:items-center md:justify-start">
                    <img
                      src={imageUrls[0]}
                      alt=""
                      className="w-24 h-24 object-cover rounded-lg  sm:pr-0"
                    />
                    <Divider type="vertical" className="" />
                    <div className="ml-4 sm:ml-0 mr-4">
                      <h1 className="text-lg font-semibold">{item.product_name}</h1>

                      <div className="flex items-center justify-start space-x-4 ">
                        <span className="text-base">SL: {item.quantity}</span>
                      </div>
                    </div>

                    <button
                      className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 sm:hidden"
                      onClick={() => removeFromCart(item.productTemplateID)}
                    ></button>
                  </div>

                  {/* Delete Icon */}
                  <div className="hidden sm:flex items-center justify-center">
                    <button
                      className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600"
                      onClick={() => removeFromCart(item.productTemplateID)}
                    >
                      <IoIosClose />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Divider />
      {onChooseTable ? (
        <Button
          key={"select-table"}
          onClick={onChooseTable}
          disabled={cartItems.length === 0}
        >
          Chọn bàn
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}
