"use client";

import { bookListApiRequest } from "@/src/apiRequests/bookList";
import { useAppContext } from "@/src/app/app-provider";
import StarBorder from "@/src/components/Bits/StarBorder";
import CustomDatePicker from "@/src/components/DateRantalPicker/DateRental";
import CustomRangePicker from "@/src/components/DateRantalPicker/HourRental";
import { notifyError, notifySuccess } from "@/src/components/Notification/Notification";
import { HttpError } from "@/src/lib/httpAxios";
import { formatVND } from "@/src/lib/utils";
import { useRentalStore } from "@/src/store/rentalStore";
import {
    Button,
    ConfigProvider,
    Divider,
    Image,
    message,
    Modal,
    notification,
    Radio,
    Rate,
    Tooltip
} from "antd";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AvailableRentBoardGame } from "./extend/page";
import { title } from "process";


const options: CheckboxGroupProps<string>["options"] = [
    { label: "Thuê theo giờ", value: "hours" },
    { label: "Thuê theo ngày", value: "days" },
];

interface RentalProductCardProps {
    AvailableProduct: AvailableRentBoardGame;
}

export default function RentalProductCard({ AvailableProduct }: RentalProductCardProps) {

    // cai nay la de hien thong bao ra
    const [api, contextHolder] = notification.useNotification();
    const { user } = useAppContext();
    const router = useRouter();
    const { cartItems, addToCart, removeFromCart } = useRentalStore();

    //dong nay la state de hien thi modal va chon ngay
    const [selectedOption, setSelectedOption] = useState<"days" | "hours">(
        "days"
    );
    const [openResponsive, setOpenResponsive] = useState(false);
    const [selectedDate, setSelectedDate] = useState<
        [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
    >(null);
    //----------------------------------------------

    //dong nay la ham xu ly khi nhan nut dat truoc (code phiên bản cũ, bản mới ko dùng)
    // const { addRental } = useRentalStore();
    // const handleSubmit = async () => {
    //     if (!selectedDate) {
    //         message.error("Vui lòng chọn thời gian thuê.");
    //         return;
    //     }

    //     if (!user) {
    //         message.error("Bạn cần đăng nhập để đặt trước.");
    //         return;
    //     }
    //     const postData = {
    //         customerId: null, // Lấy từ context
    //         bookListItems: [
    //             {
    //                 productTemplateID: AvailableProduct.id,
    //                 quantity: 1,
    //             },
    //         ],
    //         storeId: storeId, // Store ID (Cập nhật nếu cần)
    //         from: selectedDate ? selectedDate[0]?.toISOString() : "", // Chuyển thời gian sang định dạng ISO
    //         to: selectedDate ? selectedDate[1]?.toISOString() : "", // Chuyển thời gian sang định dạng ISO
    //         bookType: selectedOption === "days" ? 1 : 0, // 1 = theo ngày, 0 = theo giờ
    //     };

    //     try {
    //         const response = await bookListApiRequest.createBookList(
    //             postData,
    //             user.token
    //         );
    //         if (response.statusCode == "200") {
    //             notifySuccess(
    //                 "Đặt trước thành công!",
    //                 "Chúc bạn có những phút giây vui vẻ với sản phẩm của chúng tôi."
    //             );
    //         } else
    //             notifyError(
    //                 "Đặt trước thất bại!",
    //                 response.message || "Vui lòng thử lại sau."
    //             );

    //         setOpenResponsive(false); // Đóng modal sau khi thành công
    //     } catch (error: any) {
    //         console.error("Lỗi API:", error);
    //         if (error instanceof HttpError && error.status === 401) {
    //             notifyError("Đặt trước thất bại!", "bạn cần đăng nhập để tiếp tục");
    //             router.push("/login");
    //         } else {
    //             // Xử lý lỗi khác nếu có
    //             console.error("Lỗi khác:", error);
    //             notifyError(
    //                 "Đặt trước thất bại",
    //                 "Có lỗi xảy ra khi đặt trước sản phẩm. Vui lòng thử lại sau."
    //             );
    //         }
    //     }

    //     const rentalData = {
    //         title,
    //         method: selectedOption,
    //         startDate: selectedDate[0]?.format("YYYY-MM-DD HH:mm") || "",
    //         endDate:
    //             selectedOption === "hours" && selectedDate[1]
    //                 ? selectedDate[1].format("YYYY-MM-DD HH:mm")
    //                 : undefined,
    //         price: 30000, // Giá mẫu
    //     };

    //     // addRental(rentalData);
    //     // console.log("Đặt trước thành công");
    //     // openNotificationWithIcon("success");
    //     setOpenResponsive(false);

    //     console.log("postData: ", postData);
    //     // sau này mà có api thì call api ở đây
    //     // và set lại isRented = true
    //     //  nếu đã có người đặt trùng giờ thì thông báo lỗi
    // };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        const product = {
            productTemplateID: AvailableProduct.id,
            name: AvailableProduct.product_name,
            quantity: AvailableProduct.rent_count,
            image: AvailableProduct.image,
            price: AvailableProduct.rent_price_per_hour, // Hoặc giá khác nếu cần
        };
        addToCart(product.productTemplateID, product.name, product.image, product.price);
        notifySuccess("Thành công!", `${AvailableProduct.product_name} đã được thêm vào giỏ.`);
        console.log("Thêm vào giỏ hàng:", AvailableProduct.id);
    };

    const defaultImage = "/assets/images/bg1.jpg";

    const imageList = AvailableProduct.image.split("||");
    return (
        <div className="relative">
            {/* thg nay de hien thong bao ra  */}
            {contextHolder}
            <div
                className="rounded-xl border max-w-[280px] border-gray-200 bg-white shadow-md hover:shadow-lg transition-all dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
            >
                <div className="relative h-[200px] w-full overflow-hidden rounded-t-xl flex justify-center items-center">

                    <Image
                        style={{ height: "100%", width: "100%", objectFit: "cover" }}
                        src={imageList[0]}
                        alt={AvailableProduct.product_name}
                        preview={{
                            maskClassName: "m-[-30px]"
                        }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultImage;
                        }}
                    />

                    {AvailableProduct.rent_count === 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Hết hàng
                        </span>
                    )}
                </div>

                <div className="flex flex-col flex-1 p-3 sm:p-4" onClick={() => setOpenResponsive(true)}
                >
                    {/* Tiêu đề */}
                    <Tooltip title={AvailableProduct.product_name} >
                        <h3
                            className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 min-h-[58px]"
                        >
                            {AvailableProduct.product_name}
                        </h3>
                    </Tooltip>

                    {/* Thông tin ngắn */}
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex flex-col">
                        <span> ⏱ {AvailableProduct.duration ?? "xx"} phút • 🔞 {AvailableProduct.age ?? "xx"}+ tuổi</span>
                        <span>👥 {AvailableProduct.number_of_player_min ?? "xx"}  - {AvailableProduct.number_of_player_max ?? "xx"} người</span>

                    </div>

                    {/* Giá + SL */}
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-green-600 font-bold">
                            {formatVND(AvailableProduct.rent_price_per_hour)}/giờ
                        </span>
                        {AvailableProduct.rent_count > 0 && (
                            <Tooltip title={`Có ${AvailableProduct.rent_count} sản phẩm cho thuê tại cửa hàng.`}>
                                <span className="text-xs sm:text-sm text-gray-600">Số lượng: {AvailableProduct.rent_count}</span>
                            </Tooltip>
                        )}
                    </div>

                    {/* Nút */}
                    <div className="mt-4">
                        <Button
                            type="primary"
                            block
                            disabled={AvailableProduct.rent_count === 0}
                            onClick={handleAddToCart}
                        >
                            {AvailableProduct.rent_count === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                        </Button>
                    </div>
                </div>
            </div>


            <Modal
                title={`Đặt trước: ${AvailableProduct.product_name}`}
                centered
                open={openResponsive}
                onOk={() => setOpenResponsive(false)}
                onCancel={() => setOpenResponsive(false)}
                width={700}
                footer={[
                    <Button key="cancel" onClick={() => setOpenResponsive(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(e);
                            setOpenResponsive(false);
                        }}
                    >
                        Thêm vào giỏ
                    </Button>,
                ]}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Ảnh */}
                    <div className="w-full h-[220px] rounded-lg overflow-hidden">
                        <img
                            src={imageList[0] || defaultImage}
                            alt={AvailableProduct.product_name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Thông tin */}
                    <div>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                            {AvailableProduct.product_name} là một boardgame nổi bật, được yêu thích bởi cộng đồng.
                        </p>

                        <Divider className="my-2" />
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <li>⏱ Thời gian chơi: {AvailableProduct.duration ?? "xx"} phút</li>
                            <li>👥 Người chơi: {AvailableProduct.number_of_player_min ?? "xx"} - {AvailableProduct.number_of_player_max ?? "xx"}</li>
                            <li>🎯 Độ phức tạp: {AvailableProduct.difficulty ?? "xx"}/10</li>
                            <li>🔞 Độ tuổi: {AvailableProduct.age ?? "xx"}+</li>
                        </ul>

                        <Divider className="my-2" />

                        <Radio.Group
                            options={options}
                            defaultValue="hours"
                            optionType="button"
                            buttonStyle="solid"
                            onChange={(e) => setSelectedOption(e.target.value)}
                        />

                        <p className="mt-4 text-lg font-semibold text-green-600">
                            {selectedOption === "hours"
                                ? `${formatVND(AvailableProduct.rent_price_per_hour)}/giờ`
                                // : `${formatVND(rent_price)}/ngày`}
                                : 'Dịch vụ đang phát triển'}

                            {/* {selectedOption === "days"
                                ? `${formatVND(rent_price)}/ngày`
                                : `${formatVND(rent_price_per_hour)}/giờ`} */}
                        </p>
                    </div>
                </div>
            </Modal>

        </div >
    );
}


