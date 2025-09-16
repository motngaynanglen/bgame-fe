export type Table = {
    TableID: string;
    TableName: string;
    Capacity: number;
    // FromSlot: number;
    // ToSlot: number;
    // Owner: string;
    Status: string;
    books?: BookList;
};
export type BookList = {
    id: string;
    from_slot: number;
    to_slot: number;
    BookItem: BookItem[] | BoardGame[];
    customer_id?: string;
}
export type BookItem = {
    product_id: string;
    code: string;
    product_name?: string; // Thêm trường product_name
    price?: number; // Thêm trường price
    image?: string;
}
export interface BoardGame {
    id?: string;
    product_id: string;
    code: string;
    product_name?: string;
    product_group_ref_id?: string;
    productTemplateID?: string;
    price?: number;
    status?: string;
    image?: string;
    rent_price?: number;
    rent_price_per_hour?: number;
    publisher?: string;
    category?: string;
    player?: string;
    time?: string;
    age?: number;
    complexity?: number;
    product_type?: string;
}
