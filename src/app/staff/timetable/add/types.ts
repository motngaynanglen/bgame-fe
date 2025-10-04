import { Moment } from "moment";

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
    status?: string;

    customer_id: string;
    customer_name: string;
    phone: string;
    from: string;
    to: string;

    products: Product[];
}
export type Product = {
    id: string;
    book_list_id: string;
    product_name: string;
    // description: string;
    code: string;
    image: string;
    rent_price_per_hour?: number; // Thêm trường price

}

export type BookList = {
    id: string;
    book_code: string;
    from_slot: number;
    to_slot: number;
    status?: string;

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

export type BoardGame = {
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

//----------------------------------
export type ProductViewModel = {
    product_id: string,
    product_name: string,
    description: string
    code: string;
    image: string;
    rent_price_per_hour?: number;
}
export type BookItemViewModel = {
    book_id: string;
    code: string;
    total_price: number;
    status?: string;
    customer_id: string;
    customer_name: string;
    phone: string;
    from: string;
    to: string;

    products: ProductViewModel[],
}
export type BookViewModel = {
    book_table_id: string,
    from_slot: number,
    to_slot: number,
    // book_name: string | null,
    total_time: number,
    status: string,
    book_lists: BookItemViewModel[],
}

export type BookInfo = {
    deadline?: {
        time: number, // for count down
        type: 'end' | 'start'
    },
    bookData: BookViewModel
    type?: 'past' | 'present' | 'future'
}
export type TimeSlot = {
    time: Moment,
    slot: number,
}
export type TableViewModel = {
    TableId: string;
    TableName: string;
    Capacity: number;
    TableStatus: string;
    BookInfo: BookInfo | null;
    BookList: BookViewModel[] | null;
}
export interface BookingRequestBody {
    storeId: string;
    bookDate: string;
    fromSlot: number;
    toSlot: number;
    tableIDs: string[];
    bookListItems: {
        productID: string;
    }[];
}
/**
 * Chuyển đổi Product[] sang ProductViewModel[]
 * @param products Mảng Product[]
 * @returns Mảng ProductViewModel[]
 */
export function mapProductsToViewModel(products: (Product | BoardGame)[]): ProductViewModel[] {
    return products.map(product => {
        // Product (từ bookList) dùng id. BoardGame (dùng tạm Books) dùng product_id.
        // Ta ưu tiên product_id (có trong BoardGame), sau đó là id (có trong Product).
        const id = (product as BoardGame).product_id || (product as Product).id;

        // Ta cũng ưu tiên rent_price_per_hour (có trong Product)
        const price = product.rent_price_per_hour;

        return {
            product_id: id || '', // Đảm bảo có giá trị
            product_name: product.product_name || 'N/A',
            code: product.code || '',
            image: product.image || '',
            rent_price_per_hour: price,
            // description không cần thiết, giữ nguyên rỗng
            description: "",
        };
    });
}

/**
 * Hàm map chính: Chuyển đổi mảng bookList[] sang BookItemViewModel[]
 * @param bookLists Mảng bookList[] từ API.
 * @returns Mảng BookItemViewModel[]
 */
export function mapBookListsToBookItemViewModel(bookLists: bookList[] | undefined): BookItemViewModel[] {
    if (!bookLists || bookLists.length === 0) {
        return [];
    }

    return bookLists.map(list => {
        // Chuyển đổi Products thành ProductViewModel
        const productViewModels = mapProductsToViewModel(list.products);

        return {
            book_id: list.id,
            code: list.code,
            total_price: list.total_price,
            status: list.status,
            // Dữ liệu khách hàng
            customer_id: list.customer_id,
            customer_name: list.customer_name,
            phone: list.phone,

            // Thời gian (from/to)
            from: list.from,
            to: list.to,

            // Sản phẩm đã được map
            products: productViewModels,
        };
    });
}