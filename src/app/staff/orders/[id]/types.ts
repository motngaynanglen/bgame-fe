export interface OrderGroupDetail {
    order_group_id: string;
    order_group_code: string;
    email: string;
    full_name: string;
    phone_number: string;
    address: string;
    total_item: number;
    total_price: number;
    is_delivery: boolean;
    delivery_brand: string;
    delivery_code: string;
    order_status: string;
    order_created_at: string;
    expected_receipt_date?: Date | null;

    orders: Order[]
}
export interface Order {
    order_id: string;
    order_code: string;
    store_id: string;
    store_name: string;
    order_group_id: string;
    is_hub: number | null;
    is_transfered: number | null;
    order_status: string;
    order_created_at: string;
    items: OrderItem[]
}

export interface OrderItem {
    order_item_id: string;
    order_id: string;
    product_id: string;
    code: string;
    current_price: number;
    order_item_status: string;
    order_item_created_at: string;
    product_template_id: string;
    product_name: string;
    template_image: string;
    template_price: number;
    template_description: string;
}

// --- STATUS MAPS ---
/** Map status to color + label for Order Group */
export const orderGroupStatusMeta: Record<string, { color: string; label: string }> = {
    CREATED: { color: "warning", label: "Chưa Thanh Toán" },
    PAID: { color: "green", label: "Đã thanh toán" },
    PREPARED: { color: "blue", label: "Đã chuẩn bị" }, 
    DELIVERING: { color: "processing", label: "Đang giao" },
    COMPLETED: { color: "success", label: "Hoàn tất" },
    CANCELLED: { color: "error", label: "Đã hủy" },
};

/** Map status to color + label for individual Order/Order Item */
export const orderStatusMeta: Record<string, { color: string; label: string }> = {
    CREATED: { color: "warning", label: "Chưa chuẩn bị" },
    PREPARED: { color: "blue", label: "Đã chuẩn bị" },
    DELIVERING: { color: "processing", label: "Đang giao" },
    DELIVERED: { color: "green", label: "Đã đến" },
    RECEIVED: { color: "success", label: "Hoàn tất" },
    CANCELLED: { color: "error", label: "Đã hủy" },
};

// --- HÀM TIỆN ÍCH CHO STATUS ---
export const getGroupStatus = (status: string) => {
    return orderGroupStatusMeta[status] || { color: "default", label: status };
};

export const getOrderStatus = (status: string) => {
    return orderStatusMeta[status] || { color: "default", label: status };
};