"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { useAppContext } from "@/src/app/app-provider";
import StarBorder from "@/src/components/Bits/StarBorder ";
import CustomDatePicker from "@/src/components/DateRantalPicker/DateRental";
import CustomRangePicker from "@/src/components/DateRantalPicker/HourRental";
import { notifyError, notifySuccess } from "@/src/components/Notification/Notification";
import dayjs from "@/src/lib/dayjs ";
import { HttpError } from "@/src/lib/httpAxios";
import { useRentalStore } from "@/src/store/rentalStore";
import { Button, Divider, message, Modal, notification, Radio } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { useRouter } from "next/navigation";
import { useState } from "react";

const options: CheckboxGroupProps<string>["options"] = [
    { label: "Thuê theo ngày", value: "days" },
    { label: "Thuê theo giờ", value: "hours" },
];

export interface CardProductRentProps {
    id: string;
    idGroup: string;
    storeId: string | null;
    image: string;
    product_name: string;
    price: number;
    rent_price_per_hour: number;
    sales_quantity?: number;
    rent_quantity?: number;
    rent_price: number;
    isRented: boolean;
    complexity: number;
    age: number;
    time: string;
    player: string;
}
export default function CardRentProductTemplate({ productTemplate }: { productTemplate: CardProductRentProps }) {
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

    //dong nay la ham xu ly khi nhan nut dat truoc
    // const { addRental } = useRentalStore();
    const handleSubmit = async () => {
        if (!selectedDate) {
            message.error("Vui lòng chọn thời gian thuê.");
            return;
        }

        if (!user) {
            message.error("Bạn cần đăng nhập để đặt trước.");
            return;
        }
        const postData = {
            customerId: null, // Lấy từ context
            bookListItems: [
                {
                    productTemplateID: productTemplate.id,
                    quantity: 1,
                },
            ],
            storeId: "", // Store ID (Cập nhật nếu cần)
            from: selectedDate ? selectedDate[0]?.toISOString() : "", // Chuyển thời gian sang định dạng ISO
            to: selectedDate ? selectedDate[1]?.toISOString() : "", // Chuyển thời gian sang định dạng ISO
            bookType: selectedOption === "days" ? 1 : 0, // 1 = theo ngày, 0 = theo giờ
        };

        try {
            const response = await bookListApiRequest.createBookList(
                postData,
                user.token
            );
            if (response.statusCode == "200") {
                notifySuccess(
                    "Đặt trước thành công!",
                    "Chúc bạn có những phút giây vui vẻ với sản phẩm của chúng tôi."
                );
            } else
                notifyError(
                    "Đặt trước thất bại!",
                    response.message || "Vui lòng thử lại sau."
                );

            setOpenResponsive(false); // Đóng modal sau khi thành công
        } catch (error: any) {
            console.error("Lỗi API:", error);
            if (error instanceof HttpError && error.status === 401) {
                notifyError("Đặt trước thất bại!", "bạn cần đăng nhập để tiếp tục");
                router.push("/login");
            } else {
                // Xử lý lỗi khác nếu có
                console.error("Lỗi khác:", error);
                notifyError(
                    "Đặt trước thất bại",
                    "Có lỗi xảy ra khi đặt trước sản phẩm. Vui lòng thử lại sau."
                );
            }
        }

        const rentalData = {
            title: "Đặt trước sản phẩm",
            method: selectedOption,
            startDate: selectedDate[0]?.format("YYYY-MM-DD HH:mm") || "",
            endDate:
                selectedOption === "hours" && selectedDate[1]
                    ? selectedDate[1].format("YYYY-MM-DD HH:mm")
                    : undefined,
            price: 30000, // Giá mẫu
        };

        // addRental(rentalData);
        // console.log("Đặt trước thành công");
        // openNotificationWithIcon("success");
        setOpenResponsive(false);

        console.log("postData: ", postData);
        // sau này mà có api thì call api ở đây
        // và set lại isRented = true
        //  nếu đã có người đặt trùng giờ thì thông báo lỗi
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        const product = {
            productTemplateID: productTemplate.idGroup,
            name: productTemplate.product_name,
            quantity: productTemplate.rent_quantity,
            image: productTemplate.image,
        };
        addToCart(product.productTemplateID, product.name, product.image);
        notifySuccess("Thành công!", `${productTemplate.product_name} đã được thêm vào giỏ.`);
        console.log("Thêm vào giỏ hàng:", productTemplate.id);
    };

    const defaultImage = "/assets/images/bg1.jpg";

    const imageList = productTemplate.image.split("||");
    return (
        <div className="relative" >
            {/* thg nay de hien thong bao ra  */}
            {contextHolder}
            <div
                onClick={() => setOpenResponsive(true)}
                className="rounded-lg border max-w-[300px] border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
                <div className="relative h-[200px] w-full overflow-hidden rounded-t-md" >
                    <img
                        className={`w-full h-full object-cover transition-opacity rounded-t-md `}
                        src={imageList[0]}
                        alt=""
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultImage;
                        }
                        }
                    />

                </div>
                < div className="pt-2" >
                    <div
                        className="uppercase text-base sm:text-lg font-medium leading-tight text-gray-900 hover:text-gray-500 dark:text-white 
line - clamp - 2 overflow - hidden break-words h - [36px] sm: h - [52px]"
                    >
                        {productTemplate.product_name}
                    </div>



                    < div className="mt-2" >
                        {productTemplate.rent_quantity && productTemplate.rent_quantity !== 0 ? (
                            <span>Gổm {productTemplate.rent_quantity} sản phẩm.</span>
                        ) : (
                            <></>
                        )}
                    </div>
                    < div className="mt-4" >
                        <StarBorder
                            as="button"
                            className="custom-class w-full"
                            color="cyan"
                            speed="2s"
                            onClick={handleAddToCart}
                        >
                            Thêm vào đơn
                        </StarBorder>
                    </div>
                </div>
            </div>

            < Modal
                title={`Đặt trước ${productTemplate.product_name}`}
                centered
                open={openResponsive}
                onOk={() => setOpenResponsive(false)}
                onCancel={() => setOpenResponsive(false)}
                key={productTemplate.id}
                footer={
                    [
                        <Button
                            key={"dat truoc"}
                            onClick={handleSubmit}
                            disabled={!selectedDate
                            }
                        >
                            Đặt trước
                        </Button>,
                    ]}
            >
                <p>
                    {productTemplate.product_name} là một thể loại Board Game được giới trẻ săn đón khi mới ra
                    mắt và do nhà phát hành Publicsher phát triển tiếp.Nhưng thực sự game
                    chỉ bắt đầu nhận được sự tán đồng và hưởng ứng từ người chơi từ năm
                    được ra mắt.Cũng trong năm này {productTemplate.product_name} đã trở thành 1 hiện tượng và
                    đạt được danh hiệu Board Game hay nhất năm do độc giả bình chọn.
                </p>
                < Divider />
                <p>Thời gian chơi: {productTemplate.time} phút </p>
                < p > Số lượng người chơi: {productTemplate.player} người </p>
                < p > Độ tuổi khuyến nghị: {productTemplate.age} +</p>
                < p > Độ phức tạp: {productTemplate.complexity} /5</p >
                <Divider />
                < Radio.Group
                    options={options}
                    defaultValue="days"
                    optionType="button"
                    buttonStyle="solid"
                    onChange={(e) => setSelectedOption(e.target.value)}
                />
                < p className="mt-4" > Chọn thời gian thuê: </p>
                {
                    selectedOption === "days" && (
                        <div>
                            <CustomDatePicker
                                onChange={(date) => setSelectedDate(date ? [date, date] : null)}
                            />
                            < p className="text-lg text-green-800 mt-4" >
                                Phí thuê: {productTemplate.rent_price}
                            </p>
                        </div>
                    )
                }

                {
                    selectedOption === "hours" && (
                        <div>
                            <CustomRangePicker onChange={(dates) => setSelectedDate(dates)} />
                            < p className="text-lg text-green-800 mt-4" >
                                Phí thuê: {productTemplate.rent_price_per_hour}
                            </p>
                        </div>
                    )
                }
            </Modal>
        </div>
    );
}

