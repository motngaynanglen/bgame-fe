export type Table = {
    TableID: string;
    TableName: string;
    Capacity: number;
    Status: string;
    books?: BookList;
    bookTables?: BookTable[] | [];
};
export type BookTable = {
    id: string,
    from_slot: number,
    to_slot: number,
    book_name: string | null,
    table_list_ids: string,
    total_time: number,
    status: string,
    bookLists: bookList[]
}
export type bookList = {
    id: string;
    code: string;
    book_table_id: number;
    total_price: number;
    products: Product[];
}
export type Product = {
    id: string;
    book_list_id: string;
    product_name: string;
    // description: string;
    code: string;
    image: string;
}

export type BookList = {
    id: string;
    book_code: string;
    from_slot: number;
    to_slot: number;
    BookItem: BookItem[] | BoardGame[];
    customer_id?: string;
}
export type BookItem = {
    product_id: string;
    code: string;
    product_name?: string; // Thêm trường product_name
    rent_price_per_hour?: number; // Thêm trường price
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
export type book = {
  deadline: {
    time: number,
    type: 'end' | 'start'
  },
  bookingData: BookTable
  type: 'past' | 'present' | 'future'
}