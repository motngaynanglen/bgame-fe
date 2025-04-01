"use client";
import { useRentalStore } from "@/src/store/rentalStore";
import type { DatePickerProps, GetProps } from "antd";
import {
  Button,
  DatePicker,
  Divider,
  message,
  Modal,
  notification,
  Radio,
  Rate,
} from "antd";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import dayjs from "dayjs";
import { useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { GoPeople } from "react-icons/go";
import { LuBrain } from "react-icons/lu";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppContext } from "@/src/app/app-provider";
import http from "@/src/lib/httpAxios";
import bookListApiRequest from "@/src/apiRequests/bookList";


type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

// ham nay de gioi han ngay la ngay hien tai va sau
const disabledDate: RangePickerProps["disabledDate"] = (
  current,
  selectedDates
) => {
  const today = dayjs().startOf("day");

  if (!selectedDates || !selectedDates.from) {
    return current && current.isBefore(today, "day");
  }

  const selectedDate = selectedDates.from;
  return current && !current.isSame(selectedDate, "day");
};

// ham nay de gioi han gio la 8h toi 21h
const disabledDateTime = () => ({
  disabledHours: () => range(0, 24).filter((hour) => hour < 8 || hour >= 21),
});

// ham nay gioi ham o tren
const disabledRangeTime: RangePickerProps["disabledTime"] = (date, type) => {
  const today = dayjs().startOf("day");
  const currentHour = dayjs().hour();

  if (!date) {
    return {
      disabledHours: () =>
        range(0, 24).filter((hour) => hour < 8 || hour >= 21),
    };
  }

  if (date.isSame(today, "day")) {
    return {
      disabledHours: () =>
        range(0, 24).filter(
          (hour) => hour < 8 || hour < currentHour || hour >= 21
        ),
      disabledMinutes: (selectedHour) => {
        if (selectedHour === currentHour) {
          const minutes = [];
          for (let i = 0; i < 60; i++) {
            if (i <= dayjs().minute()) {
              minutes.push(i);
            }
          }
          return minutes;
        }
        return [];
      },
      disabledSeconds: () => [],
    };
  } else {
    return {
      disabledHours: () =>
        range(0, 24).filter((hour) => hour < 8 || hour >= 21),
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  }
};

const options: CheckboxGroupProps<string>["options"] = [
  { label: "Thuê theo ngày", value: "days" },
  { label: "Thuê theo giờ", value: "hours" },
];

function CardProductRent({
  id,
  idGroup,
  storeId,
  image,
  title,
  price,
  rent_price_per_hour,
  // quantity,
  rent_price,
  isRented,
  complexity,
  age,
  time,
  player,
}: {
  id: string;
  idGroup: string;
  storeId: string | null;
  image: string;
  title: string;
  price: number;
  rent_price_per_hour: number;
  // quantity: number;
  rent_price: number;
  isRented: boolean;
  complexity: number;
  age: number;
  time: string;
  player: string;
}) {
  // cai nay la de hien thong bao ra
  const [api, contextHolder] = notification.useNotification();
  const { user } = useAppContext();
  
  

  type NotificationType = "success" | "info" | "warning" | "error";

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    description: string
  ) => {
    api[type]({
      message: message,
      description: description,
      placement: "bottomRight",
      duration: 2,
    });
  };
  //----------------------------------------------

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
  const { addRental } = useRentalStore();
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
      productGroupRefIds: [idGroup], // ID sản phẩm
      storeId: storeId, // Store ID (Cập nhật nếu cần)
      from: selectedDate ? selectedDate[0]?.toISOString() : "", // Chuyển thời gian sang định dạng ISO
      to: selectedDate ? selectedDate[1]?.toISOString() : "", // Chuyển thời gian sang định dạng ISO
      bookType: selectedOption === "days" ? 1 : 0, // 1 = theo ngày, 0 = theo giờ
    };

    try {
      const response = await bookListApiRequest.createBookList(postData, user.token);
      openNotificationWithIcon(
        "success",
        "Đặt trước thành công",
        "Chúc bạn có những phút giây vui vẻ với sản phẩm của chúng tôi."
      );
      setOpenResponsive(false); // Đóng modal sau khi thành công
    } catch (error) {
      console.error("Lỗi khi đặt trước:", error);
      openNotificationWithIcon(
        "error",
        "Đặt trước thất bại",
        "Có lỗi xảy ra khi đặt trước sản phẩm. Vui lòng thử lại sau."
      );
    }

    // const rentalData = {
    //   title,
    //   method: selectedOption,
    //   startDate: selectedDate[0]?.format("YYYY-MM-DD HH:mm") || "",
    //   endDate:
    //     selectedOption === "hours" && selectedDate[1]
    //       ? selectedDate[1].format("YYYY-MM-DD HH:mm")
    //       : undefined,
    //   price: 30000, // Giá mẫu
    // };

    // addRental(rentalData);
    // console.log("Đặt trước thành công");
    // openNotificationWithIcon("success");
    setOpenResponsive(false);

    console.log("postData: ", postData);
    // sau này mà có api thì call api ở đây
    // và set lại isRented = true
    //  nếu đã có người đặt trùng giờ thì thông báo lỗi
  };

  const defaultImage = "/assets/images/bg1.jpg";

  const { RangePicker } = DatePicker;
  //body post len api

  return (
    <div className="relative">
      {/* thg nay de hien thong bao ra  */}
      {contextHolder}
      <div
        onClick={() => setOpenResponsive(true)}
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="relative h-full w-full">
          <img
            className={`h-50 w-full  object-cover transition-opacity rounded-t-md 
              ${isRented ? " opacity-50" : ""}
                `}
            src={image}
            alt=""
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
          {isRented && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white font-semibold">
              Đang được thuê
            </div>
          )}
        </div>
        <div className="pt-2">
          <div
            className="uppercase text-base sm:text-xl font-medium leading-tight text-gray-900 hover:text-gray-500 dark:text-white 
    line-clamp-2 overflow-hidden break-words h-[36px] sm:h-[52px]"
          >
            {title}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              <Rate allowHalf disabled defaultValue={5} />
            </div>

            <p className="text-sm font-medium text-gray-900 dark:text-white">
              5.0
            </p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              (5)
            </p>
          </div>
          <ul className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4">
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
          </ul>
          {/* <button  onClick={(e) => e.stopPropagation()}>
              <Link
                href="/product-detail"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                
              >
                Đặt trước
              </Link>
            </button> */}
        </div>
      </div>

      <Modal
        title={`Đặt trước ${title}`}
        centered
        open={openResponsive}
        onOk={() => setOpenResponsive(false)}
        onCancel={() => setOpenResponsive(false)}
        key={id}
        footer={[
          <Button
            key={"dat truoc"}
            onClick={handleSubmit}
            disabled={!selectedDate}
          >
            Đặt trước
          </Button>,
        ]}
      >
        <p>
          {title} là một thể loại Board Game được giới trẻ săn đón khi mới ra
          mắt và do nhà phát hành Publicsher phát triển tiếp. Nhưng thực sự game
          chỉ bắt đầu nhận được sự tán đồng và hưởng ứng từ người chơi từ năm
          được ra mắt. Cũng trong năm này {title} đã trở thành 1 hiện tượng và
          đạt được danh hiệu Board Game hay nhất năm do độc giả bình chọn.
        </p>
        <Divider />
        <p>Thời gian chơi: {time} phút</p>
        <p>Số lượng người chơi: {player} người</p>
        <p>Độ tuổi khuyến nghị: {age}+</p>
        <p>Độ phức tạp: {complexity}/5</p>
        <Divider />
        <Radio.Group
          options={options}
          defaultValue="days"
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => setSelectedOption(e.target.value)}
        />
        <p className="mt-4">Chọn thời gian thuê: </p>
        {selectedOption === "days" && (
          <div>
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              showTime={{ format: "HH:mm" }}
              minuteStep={10}
              onChange={(date) => setSelectedDate(date ? [date, date] : null)}
            />
            <p className="text-lg text-green-800 mt-4">
              Phí thuê: {rent_price}
            </p>
          </div>
        )}

        {selectedOption === "hours" && (
          <div>
            <RangePicker
              disabledDate={disabledDate}
              disabledTime={disabledRangeTime}
              showTime={{
                format: "HH:mm",
                defaultValue: [
                  dayjs("08:00", "HH:mm"),
                  dayjs("22:00", "HH:mm"),
                ],
              }}
              minuteStep={10}
              format="YYYY-MM-DD HH:mm"
              onChange={(date) => setSelectedDate(date)}
            />
            <p className="text-lg text-green-800 mt-4">
              Phí thuê: {rent_price_per_hour}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CardProductRent;
