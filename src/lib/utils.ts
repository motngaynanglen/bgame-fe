
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
// }
export const formatTimeStringToTimestamp = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  return seconds + (minutes * 60) + (hours * 60 * 60);
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
  console.log(date)
  // Nếu múi giờ là UTC (offset = 0), cộng thêm 7 giờ
  const hoursUTC7 = (): number => {
    if (currentOffset < 0) {
      return (date.getUTCHours() + 7)
    }
    return (date.getUTCHours())
  }

  console.log("after: " + date)
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

