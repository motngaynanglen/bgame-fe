export type BookingStatus = "available" | "booked" | "locked" | "event";

export interface BookingCell {
  table: string;
  slot: number;
  status?: BookingStatus;
}
export interface BookingRequestBody {
  storeId: string;
  bookDate: string;
  fromSlot: number;
  toSlot: number;
  tableIDs: string[];
  bookListItems: {
    productTemplateID: string;
    quantity: number;
  }[];
}
interface TableData {
  tableId: string;
  tableName: string;
}
export interface BookingData {
  bookDate: string;
  fromSlot: number;
  toSlot: number;
  tables: TableData[];
}
export interface PageProps {
  className?: string;
  storeId?: string;
  bookDate?: Date;
  staffmode?: boolean;
}

export interface BookingList {
  TableID: string;
  TableName: string;
  Capacity: string;
  FromSlot: number;
  ToSlot: number;
  Owner: string;
}
export interface ResponseModel {
  data: BookingList[];
  message: string;
  statusCode: number;
  paging: null;
}