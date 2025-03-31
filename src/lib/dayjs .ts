import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Kích hoạt các plugin cần thiết
dayjs.extend(utc);
dayjs.extend(timezone);

// Thiết lập mặc định UTC+7
dayjs.tz.setDefault("Asia/Bangkok"); // Hoặc "Etc/GMT-7"

export default dayjs;
