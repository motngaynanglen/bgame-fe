
// export const formatDateToLocal = (dateStr: string, locale = "vi-VN") => {
//   if (dateStr === undefined) {
//     return "NaN";
//   }
//   const date = new Date(dateStr)
//   const options = {
//     day: "numeric",
//     month: "short",
//     year: "numeric"
//   }
//   const formatter = new Intl.DateTimeFormat(locale, options)
//   return formatter.format(date)

import dayjs from "../lib/dayjs";

// }
export const formatTimeStringToTimestamp = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  return (seconds ?? 0) + (minutes * 60) + (hours * 60 * 60);
}
export const formatTimeStringToArray = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  return [hours, minutes, seconds];
}
export const formatTimeStringRemoveSeconds = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(':').map(String);

  return hours + ":" + minutes;
}
export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages]
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages]
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages
  ]
}
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path

}
export function formatDateTime(dateString: string | Date, Type: "DATETIME" | "DATE" | "TIME"): string {
  const date = new Date(dateString);

  const currentOffset = date.getTimezoneOffset(); // Lấy độ lệch múi giờ hiện tại (phút)
  // Nếu múi giờ là UTC (offset = 0), cộng thêm 7 giờ
  const hoursUTC7 = (): number => {
    if (currentOffset < 0) {
      return (date.getUTCHours() + 7)
    }
    return (date.getUTCHours())
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getUTCFullYear();
  const hours = String(hoursUTC7()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  switch (Type) {
    case "DATE":
      return `${day}-${month}-${year}`;
    case "TIME":
      return `${hours}:${minutes}`;
    default:
      return `${day}-${month}-${year} ${hours}:${minutes}`;

  }
}
export const formatVND = (value: string | number): string => {
  const number = typeof value === 'string' ? Number(value) : value;

  if (isNaN(number)) return '0 ₫'; // hoặc bạn có thể trả về giá trị mặc định khác

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(number);
};

export function toISOStringWithOffset(date: Date | dayjs.Dayjs, offsetHours: number) {
  const dayjsDate = dayjs(date);
  const adjustedDate = dayjsDate.add(offsetHours, 'hour');

  return adjustedDate.toISOString();
}
export const formatDurationText = (slotCount: number) => {
  const totalMinutes = slotCount * 30;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0 && m > 0) return `${h} giờ ${m} phút`;
  if (h > 0) return `${h} giờ`;
  return `${m} phút`;
};
export const ConvertSlotToTime = (slot: number, isBegin?: boolean, fullFormat?: boolean) => {
  if (slot < 1 || slot > 29) return "NaN";
  if (!isBegin) slot += 1; // Nếu là thời gian kết thúc thì +1 slot
  return dayjs(
    new Date().setHours(7 + Math.floor((slot - 1) / 2), (slot - 1) % 2 * 30, 0, 0)
  ).format(fullFormat ? 'DD-MM-YYYY HH:mm:ss' : 'HH:mm');
}
export const ConvertSlotToDateTime = (slot: number, isBegin?: boolean) => {
  if (slot < 1 || slot > 29) return;
  if (!isBegin) slot += 1; // Nếu là thời gian kết thúc thì +1 slot
  return dayjs(new Date().setHours(7 + Math.floor((slot - 1) / 2), (slot - 1) % 2 * 30, 0, 0))
}
export const ConvertTimeToSlot = (time: string, testing?: number) => {
  const [hours, minutes] = time.split(":").map(Number);
  if (hours < 7 || hours > 21 || (hours === 21 && minutes > 0)) return (testing ?? -1);
  return (hours - 7) * 2 + (minutes >= 30 ? 1 : 0) + 1;
};
// const slots = Array.from({ length: 29 }, (_, i) => i + 1); // Slot 1 → 29
// Cơ bản có 28 slot tương ứng 7h tới 21h (14h). Số Slot = (số giờ)  x2 + 1
// Hiển thị nội dung thead lệch về bên trái nên phải; điễn giải slot 1 tương ứng 7h - 7h30 nên phải theo n+1
// Nếu để 28 slot thì thời gian cuối cùng sẽ không được hiển thị.