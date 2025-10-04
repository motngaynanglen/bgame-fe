import { z } from "zod";
import dayjs from "../lib/dayjs";

const DayjsClass = dayjs().constructor as typeof dayjs.Dayjs;

const DayjsSchema = z.instanceof(DayjsClass, {
  message: "Ngày không hợp lệ. Vui lòng chọn lại."
}).refine((date) => date.isValid(), {
  message: "Ngày không hợp lệ."
});


export const orderFormSchema = z.object({
  orderID: z.string().uuid({ message: "Mã đơn hàng không hợp lệ" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  fullName: z.string().min(2, "Họ tên ít nhất 2 ký tự"),
  phoneNumber: z.string().min(8, "SĐT ít nhất 8 số"),
  address: z.string().min(5, "Địa chỉ quá ngắn"),
  isDelivery: z.boolean(),
  deliveryCode: z.string().nullable(),
  deliveryBrand: z.string().nullable(),

  expectedReceiptDate: DayjsSchema.nullable(),

}).refine(
  (data) => {
    if (data.isDelivery) {
      return data.deliveryCode && data.deliveryBrand;
    }
    return true;
  },
  {
    message: "Vui lòng nhập mã vận đơn và hãng vận chuyển",
    path: ["deliveryCode"],
  }
).refine(
  (data) => {
    // Logic kiểm tra: Nếu là Giao hàng, phải chọn Ngày dự kiến
    if (data.isDelivery) {
      return data.expectedReceiptDate && data.expectedReceiptDate.isValid();
    }
    return true;
  },
  {
    message: "Vui lòng chọn Ngày dự kiến nhận hàng",
    path: ["expectedReceiptDate"],
  }
);

export type OrderFormValues = z.infer<typeof orderFormSchema>;