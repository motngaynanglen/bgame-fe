
export interface productModel {
    id?: string,
    productGroupRefId?: string,
    groupName: string,
    prefix: string,
    groupRefName: string,
    productName: string,
    image: string,
    price: number,
    description: string,
    rentPrice: number,
    rentPricePerHour: number
    sales_quantity?: number,
    rent_quantity?: number
}
import { z } from "zod";

export const productFullFormSchema = z.object({
    id: z.string().optional(), // Hoặc z.undefined() nếu bạn muốn bắt buộc không có giá trị
    productGroupRefId: z.string().optional(),
    groupName: z.string().min(1, "Tên nhóm sản phẩm là bắt buộc"),
    prefix: z.string().min(1, "Mã định danh là bắt buộc"),
    groupRefName: z.string().min(1, "Tên phân loại là bắt buộc"),
    productName: z.string().min(1, "Tên sản phẩm là bắt buộc"),
    image: z.string().min(1, "Upload ảnh là bắt buộc, vui lòng upload ít nhất một ảnh").optional(), // Hoặc thêm validation cho URL ảnh nếu cần
    price: z.number().min(0, "Giá không được âm").max(100000000, "Giá quá lớn").refine(val => val % 1000 === 0, { message: "Giá phải là bội số của 1000" }),
    description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự").max(2000, "Mô tả quá dài"),
    rentPrice: z.number().min(0, "Giá thuê không được âm").max(1000000, "Giá thuê quá lớn").refine(val => val % 1000 === 0, { message: "Giá phải là bội số của 1000" }),
    rentPricePerHour: z.number().min(0, "Giá thuê theo giờ không được âm").max(1000000, "Giá thuê theo giờ quá lớn").refine(val => val % 1000 === 0, { message: "Giá phải là bội số của 1000" })
});

// Kiểu TypeScript tự động sinh từ schema
export type ProductFullFormType = z.infer<typeof productFullFormSchema>;

export const productResSchema = z.object({
    id: z.string(),
    product_template_id: z.string().optional().nullable(),
    store_id: z.string().optional().nullable(),
    product_group_ref_id: z.string().optional().nullable(),
    supply_item_id: z.string().optional().nullable(),
    code: z.string(),
    product_name: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    price: z.number().optional().nullable(),
    rent_price: z.number().optional().nullable(),
    rent_price_per_hour: z.number().optional().nullable(),
    publisher: z.string().optional().nullable(),
    age: z.string().optional().nullable(),
    number_of_player_min: z.number().optional().nullable(),
    number_of_player_max: z.number().optional().nullable(),
    hard_rank: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    condition: z.enum(["SALES_PRODUCT", "RENTAL_PRODUCT"]),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    created_at: z.string(),
    created_by: z.string(),
    updated_at: z.string().optional().nullable(),
    updated_by: z.string().optional().nullable(),
});

export type ProductResType = z.infer<typeof productResSchema>;
