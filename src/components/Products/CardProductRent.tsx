"use client";
import type { DatePickerProps, GetProps } from "antd";
import { Button, DatePicker, Divider, Modal, notification } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { GoPeople } from "react-icons/go";
import { LuBrain } from "react-icons/lu";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // ham nay chi cho phep chon sau ngay hien tai
  return current && current <= dayjs().endOf("day");
};

const disabledDateTime = () => ({
  disabledHours: () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      if (i < 8 || i >= 21) {
        hours.push(i);
      }
    }
    return hours;
  },
});

function CardProductRent({
  image,
  title,
  price,
  isRented,
  complexity,
  age,
  time,
  player,
}: {
  image: string;
  title: string;
  price: number;
  isRented: boolean;
  complexity: number;
  age: number;
  time: string;
  player: string;
}) {
  const [api, contextHolder] = notification.useNotification();
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN");
  };
  type NotificationType = "success" | "info" | "warning" | "error";

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Thành công!",
      description: `Bạn đã đặt lịch thành công.`,
      placement: "bottomRight",
      duration: 2,
    });
  };
  
  const [openResponsive, setOpenResponsive] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const handleSubmit = () => {
    // console.log("Đặt trước thành công");
    openNotificationWithIcon("success");
    setOpenResponsive(false);
    // sau này mà có api thì call api ở đây
    // và set lại isRented = true
    //  nếu đã có người đặt trùng giờ thì thông báo lỗi
  };

  return (
    <div className="relative">
      {contextHolder} 
      {/* thg nay de hien thong bao ra  */}
      <div
        onClick={() => setOpenResponsive(true)}
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="relative h-full w-full">
          <img
            className={`w-full h-full object-cover transition-opacity rounded-t-md ${
              isRented ? "opacity-50" : ""
            }`}
            src={image}
            alt=""
          />
          {isRented && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white font-semibold">
              Đang được thuê
            </div>
          )}
        </div>
        <div className="pt-4">
          <div className="uppercase text-lg font-semibold leading-tight text-gray-900  dark:text-white">
            {title}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className="h-4 w-4 text-yellow-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                </svg>
              ))}
            </div>

            <p className="text-sm font-medium text-gray-900 dark:text-white">
              5.0
            </p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              (455)
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
              <LuBrain className="fill-black" />
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                {complexity}/5
              </p>
            </li>
          </ul>

          {/* <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-2xl font-medium leading-tight text-gray-900 dark:text-white">
              {formatPrice(price)} vnd
            </p>
          </div> */}
          {/* <div className="mt-4 flex items-center justify-between gap-4">
            <button  onClick={(e) => e.stopPropagation()}>
              <Link
                href="/product-detail"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                
              >
                Đặt trước
              </Link>
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-green-500 px-4  py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Thêm vào giỏ hàng
            </button>
          </div> */}
        </div>
      </div>
      <Modal
        title="Giời thiệu về Tam Quốc Sát"
        centered
        open={openResponsive}
        onOk={() => setOpenResponsive(false)}
        onCancel={() => setOpenResponsive(false)}
        footer={
          <Button onClick={handleSubmit} disabled={!selectedDate}>
            Đặt trước
          </Button>
        }
      >
        <p>
          Tam Quốc Sát là một thể loại Card Game được ra mắt vào năm 2010 của
          tác giả KayaK và do nhà phát hành Yoka Games phát triển tiếp. Nhưng
          thực sự game chỉ bắt đầu nhận được sự tán đồng và hưởng ứng từ người
          chơi từ năm 2015. Cũng trong năm này “Sát” đã trở thành 1 hiện tượng
          và đạt được danh hiệu Board Game hay nhất năm do độc giả bình chọn.
        </p>
        <Divider />
        <p>Thời gian chơi: 30 phút</p>
        <p>Số lượng người chơi: 2-4 người</p>
        <p>Độ tuổi khuyến nghị: 10+</p>
        <p>Độ phức tạp: 3/5</p>
        <Divider />

        <p className="text-lg text-green-800">Phí thuê: 30.000đ</p>
        <p className="mt-4">
          Chọn thời gian thuê:{" "}
          <DatePicker
            format="YYYY-MM-DD HH:mm"
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            showTime={{
              format: "HH:mm",
              defaultValue: dayjs("00:00", "HH:mm"),
            }}
            onChange={(date) => setSelectedDate(date)}
          />
        </p>
      </Modal>
    </div>
  );
}

export default CardProductRent;
