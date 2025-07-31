"use client";
import { useAppContext } from "@/src/app/app-provider";
import { useRentalStore } from "@/src/store/rentalStore";
import { Button, Divider, Empty } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

export default function CartRental({
  storeId,
  onChooseTable,
}: {
  storeId: string | null;
  onChooseTable?: () => void;
}) {
  const { cartItems, removeFromCart } = useRentalStore();
  const router = useRouter();
  const { user } = useAppContext();

  const [selectedOption, setSelectedOption] = useState<"days" | "hours">(
    "days"
  );
  const [selectedDate, setSelectedDate] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  const options: CheckboxGroupProps<string>["options"] = [
    { label: "Thuê theo ngày", value: "days" },
    { label: "Thuê theo giờ", value: "hours" },
  ];

  console.log("cartitems", cartItems);

  useEffect(() => {}, [onChooseTable]);

  const handleSubmit = async () => {
    // if (!user) {
    //   notifyError("Bạn cần đăng nhập để đặt trước.");
    //   return;
    // }

    router.push("/rental/table");
    // const postData = {
    //   customerId: null, // Lấy từ context
    //   bookListItems: cartItems.map((item) => ({
    //     productTemplateID: item.productTemplateID,
    //     quantity: item.quantity,
    //   })),
    //   storeId: storeId, // Store ID (Cập nhật nếu cần)
    //   from: selectedDate ? selectedDate[0]?.toISOString() : "", // Chuyển thời gian sang định dạng ISO
    //   to: selectedDate ? selectedDate[1]?.toISOString() : "", // Chuyển thời gian sang định dạng ISO
    //   bookType: selectedOption === "days" ? 1 : 0, // 1 = theo ngày, 0 = theo giờ
    // };

    // try {
    //   const response = await bookListApiRequest.createBookList(
    //     postData,
    //     user.token
    //   );
    //   console.log("Tại vì sao", postData);
    //   if (response.statusCode == "200") {
    //     notifySuccess(
    //       "Đặt trước thành công!",
    //       "Chúc bạn có những phút giây vui vẻ với sản phẩm của chúng tôi."
    //     );
    //   } else
    //     notifyError(
    //       "Đặt trước thất bại!",
    //       response.message || "Vui lòng thử lại sau."
    //     );
    // } catch (error: any) {
    //   console.error("Lỗi API:", error);
    //   if (error instanceof HttpError && error.status === 401) {
    //     notifyError("Đặt trước thất bại!", "bạn cần đăng nhập để tiếp tục");
    //     router.push("/login");
    //   } else {
    //     // Xử lý lỗi khác nếu có
    //     console.error("Lỗi khác:", error);
    //     notifyError(
    //       "Đặt trước thất bại",
    //       "Có lỗi xảy ra khi đặt trước sản phẩm. Vui lòng thử lại sau."
    //     );
    //   }
    // }
  };

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
                    {/* <Image
                      style={{ borderRadius: "0.5rem" }}
                      width={96}
                      height={96}
                      src={imageUrls[0]}
                      // alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg mr-2 sm:pr-0"
                      // loading="lazy"
                    /> */}
                    <img
                      src={imageUrls[0]}
                      alt=""
                      className="w-24 h-24 object-cover rounded-lg  sm:pr-0"
                    />
                    <Divider type="vertical" className="" />
                    <div className="ml-4 sm:ml-0 mr-4">
                      <h1 className="text-lg font-semibold">{item.name}</h1>

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
      {/* <Divider />
      <Radio.Group
        options={options}
        defaultValue="days"
        optionType="button"
        buttonStyle="solid"
        onChange={(e) => setSelectedOption(e.target.value)}
      />
      <p className="mt-4 text-black-2">Chọn thời gian thuê: </p>
      {selectedOption === "days" && (
        <div>
          <CustomDatePicker
            onChange={(date) => setSelectedDate(date ? [date, date] : null)}
          />
        </div>
      )}
      {selectedOption === "hours" && (
        <div>
          <CustomRangePicker onChange={(dates) => setSelectedDate(dates)} />
        </div>
      )} */}
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
        <Button
          key={"select-table"}
          onClick={handleSubmit}
          disabled={cartItems.length === 0}
        >
          Đặt trước
        </Button>
      )}
    </div>
  );
}
