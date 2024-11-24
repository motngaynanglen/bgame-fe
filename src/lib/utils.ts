import { EntityError } from "./httpAxios"
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
export const formatStringToTimestamp = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  return seconds + (minutes * 60) + (hours * 60 * 60);
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

export const handleErrorApi = ({ error, setError, duration = undefined }:{error:any, setError:any, duration:any}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    // toast.error(error?.payload?.message ?? 'Lỗi không xác định');
  }
}