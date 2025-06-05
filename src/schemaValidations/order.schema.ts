import { z } from "zod";

export const orderFormSchema = z.object({
  orderID: z.string().uuid({ message: "Mã đơn hàng không hợp lệ" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  fullName: z.string().min(2, "Họ tên ít nhất 2 ký tự"),
  phoneNumber: z.string().min(8, "SĐT ít nhất 8 số"),
  address: z.string().min(5, "Địa chỉ quá ngắn"),
  isDelivery: z.boolean(),
  deliveryCode: z.string().optional(),
  deliveryBrand: z.string().optional(),
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
);

export type OrderFormValues = z.infer<typeof orderFormSchema>;