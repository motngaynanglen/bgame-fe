import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Kích hoạt các plugin cần thiết
dayjs.extend(utc);
dayjs.extend(timezone);

// Thiết lập mặc định UTC+7
dayjs.tz.setDefault("Asia/Bangkok"); // Hoặc "Etc/GMT-7"

export const formatToUTC7 = (date: Dayjs | Date | string): string => {

    let dateObj = dayjs.isDayjs(date) ? date.utc() : dayjs(date).utc();

    // Kiểm tra tính hợp lệ
    if (!dateObj.isValid()) {
        dateObj = dayjs().utc();
    }

    const isTimeZero = dateObj.hour() === 0
        && dateObj.minute() === 0
        && dateObj.second() === 0;

    // Nếu thời gian là 00:00:00 → gán thời gian hiện tại
    if (isTimeZero) {
        const now = dayjs().utc();
        dateObj = dateObj
            .hour(now.hour())
            .minute(now.minute())
            .second(now.second());
    }
    return dayjs(date).tz().format();
};

export default dayjs;
