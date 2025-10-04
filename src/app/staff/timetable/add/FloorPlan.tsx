import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Divider, Card } from 'antd';
import TableCard from './TableCard';
import { BookInfo, BookTable, BookViewModel, mapBookListsToBookItemViewModel, Table, TableViewModel, TimeSlot } from './types';
import Clock from './Clock';
import { ConvertSlotToDateTime } from '@/src/lib/utils';

const { Title } = Typography;

interface FloorPlanProps {
    tables: Table[];
    now: TimeSlot | undefined;
    onSelectTable: (table: TableViewModel) => void;
    selectedTableId: string | undefined;
}


export default function FloorPlan({ tables, now, onSelectTable, selectedTableId }: FloorPlanProps) {

    const [tableList, setTableList] = useState<TableViewModel[] | []>([]);

    function getBookInfo(bookTables: BookTable[] | undefined): BookInfo | null {
        if (!bookTables || bookTables.length === 0) return null;
        if (!now) return null;
        const currentSlot = now.slot;

        const activeBookTable = bookTables.find(book =>
            book.from_slot <= currentSlot && book.to_slot > currentSlot
        );

        const nearestBookTable = bookTables.find(
            booking => (currentSlot + 2) >= booking.from_slot
        )
        if (activeBookTable) {
            const endTime = ConvertSlotToDateTime(activeBookTable.to_slot, false);
            if (endTime) {
                const bookItemViewModels = mapBookListsToBookItemViewModel(activeBookTable.bookLists);
                const Booking: BookViewModel = {
                    book_table_id: activeBookTable.id,
                    from_slot: activeBookTable.from_slot,
                    to_slot: activeBookTable.to_slot,
                    total_time: activeBookTable.total_time,
                    status: activeBookTable.status,
                    book_lists: bookItemViewModels
                }

                const data: BookInfo = {
                    deadline: {
                        time: endTime.valueOf(),
                        type: 'end'
                    },
                    type: 'present',
                    bookData: Booking,
                }
                return data;
            }
        } else if (nearestBookTable) {
            const endTime = ConvertSlotToDateTime(nearestBookTable.from_slot, true);
            if (endTime) {
                const bookItemViewModels = mapBookListsToBookItemViewModel(nearestBookTable.bookLists);

                const Booking: BookViewModel = {
                    book_table_id: nearestBookTable.id,
                    from_slot: nearestBookTable.from_slot,
                    to_slot: nearestBookTable.to_slot,
                    total_time: nearestBookTable.total_time,
                    status: nearestBookTable.status,
                    book_lists: bookItemViewModels
                }
                const data: BookInfo = {
                    deadline: {
                        time: endTime.valueOf(),
                        type: 'start'
                    },
                    type: 'future',
                    bookData: Booking,

                }
                return data;
            }
        }
        return null;

    }
    function mapTablesToTableViewModel(tables: Table[]): TableViewModel[] {
        return tables.map(table => {
            const bookInfo = getBookInfo(table.bookTables);
            const tableStatus = table.Status;

            const bookList: BookViewModel[] | null = table.bookTables ? table.bookTables.map(data => {
                const bookItemViewModels = mapBookListsToBookItemViewModel(data.bookLists);

                const retrunData: BookViewModel = {
                    book_table_id: data.id,
                    from_slot: data.from_slot,
                    to_slot: data.to_slot,
                    total_time: data.total_time,
                    status: data.status,
                    book_lists: bookItemViewModels
                }
                return retrunData;
            }) : null

            const returnData: TableViewModel = {
                TableId: table.TableID,
                TableName: table.TableName,
                Capacity: table.Capacity,
                TableStatus: tableStatus,
                BookInfo: bookInfo,
                BookList: bookList,
            }
            return returnData;
        })

    }

    useEffect(() => {
        const viewData = mapTablesToTableViewModel(tables)
        setTableList(viewData);
    }, [tables]);



    return (
        <Card style={{ display: 'flex', flexDirection: 'column', height: "100%" }}
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={5}>Theo dõi bàn thời gian thực</Title>
                    <Clock />
                </div>
            }>
            <Divider className='!mt-0 !mb-3'>Sơ đồ bàn</Divider>

            <div style={{ flex: 1 }}> {/* Đảm bảo div này giãn nở */}
                <Row gutter={[24, 24]} style={{ marginTop: '20px', paddingBottom: '10px' }}>
                    {tableList.map(table => (
                        // Điều chỉnh kích thước cột để các bàn nằm ngang
                        // ví dụ: md={6} cho bàn 4 người, md={8} cho bàn 8 người hoặc dùng flex basis
                        <Col key={table.TableId} style={{ flexShrink: 0 }}>
                            <TableCard
                                table={table}
                                onClick={() => onSelectTable(table)}
                                isSelected={table.TableId === selectedTableId}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        </Card>
    );
}