'use client';

import React, { use, useEffect, useState } from 'react';
import { Drawer, Layout, message, Splitter } from 'antd';
import Sidebar from './Sidebar';
import FloorPlan from './FloorPlan';
import { Table, BoardGame, book, TimeSlot, TableViewModel, mapProductsToViewModel, BookInfo, BookItemViewModel, BookViewModel } from './types';
import MainHeader from './MainHeader';
import OrderDetailsPanel from './OrderDetailsPanel';
import ProductList from './ProductList';
import { useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import storeApiRequest from '@/src/apiRequests/stores';
import bookTableApiRequest from '@/src/apiRequests/bookTable';
import { useAppContext } from '@/src/app/app-provider';
import TableTimeSelector, { SelectedTime } from './TableTimeSelector';
import moment, { Moment } from 'moment';
import { ConvertSlotToDateTime, ConvertTimeToSlot } from '@/src/lib/utils';

const { Content } = Layout;


export default function Home() {
    const { user } = useAppContext();
    const [selectedTable, setSelectedTable] = useState<TableViewModel | undefined>(undefined);
    const [tables, setTables] = useState<Table[]>();
    const [nowSlot, setNowSlot] = useState<TimeSlot | undefined>();

    const [selectedBook, setSelectedBook] = useState<book | undefined>(undefined)
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const splitterRef = useRef<HTMLDivElement>(null);
    const { data: storeId, isLoading: storeLoading } = useQuery({
        queryKey: ["selectedStoreId", user?.token],
        queryFn: async () => {
            if (!user?.token) {
                throw new Error("User token is not available");
            }
            const res = await storeApiRequest.getStoreId(user.token);
            return res.data;
        },

        enabled: !!user?.token,
    });
    const handleFocusSplitter = () => {
        splitterRef.current?.focus();
    };
    const handleSelectTable = (table: TableViewModel) => {
        setSelectedTable(table);
    };
    const { data: getTables, isLoading: tablesLoading } = useQuery<Table[] | undefined>({
        queryKey: ["storeTimeTable", user?.token],
        queryFn: async () => {
            const now = moment();
            const nowSlot = (ConvertTimeToSlot(now.format('HH:mm')));
            setNowSlot({ time: now, slot: nowSlot })
            try {
                const res = await bookTableApiRequest.getbooklistbyDate(new Date("2025-10-05"), user?.token);
                const data: Table[] = res.data;
                setTables(data);
                return data;
            } catch (error) {
                message.error("Không thể tải danh sách bàn.");
                throw error;
            }

        },
        refetchInterval: 60 * 1000,
        enabled: !!user?.token,
    });
    const handleUpdateOrders = (tableId: string, newOrders: BoardGame[]) => {
        if (!tables) return;
        let newBookInfo: BookInfo | null = null;

        if (newOrders.length > 0) {
            // 1. Tính Tổng tiền và Map Products
            const totalAmount = newOrders.reduce((sum, item) =>
                sum + (item.rent_price_per_hour || item.price || 0), 0
            );
            const productViewModels = mapProductsToViewModel(newOrders);

            // 2. Tạo BookItemViewModel tạm thời (chứa danh sách sản phẩm)
            const tempBookItem: BookItemViewModel = {
                book_id: 'TEMP_ID',
                code: 'TEMP_CODE',
                total_price: totalAmount,
                customer_id: '',
                customer_name: 'Khách hàng mới',
                phone: '',
                from: new Date().toISOString(),
                to: new Date().toISOString(),
                products: productViewModels,
            };

            // 3. Tạo BookViewModel tạm thời (chứa BookItemViewModel)
            const tempBookData: BookViewModel = {
                book_table_id: tableId,
                from_slot: 0,
                to_slot: 0,
                total_time: 0,
                status: 'CREATING',
                book_lists: [tempBookItem],
            };

            // 4. Tạo BookInfo tạm thời (chứa BookViewModel)
            newBookInfo = {
                bookData: tempBookData,
            };

            // newTableStatus = 'OCCUPIED'; // Đánh dấu bàn đang bận khi có đơn đang tạo
        }
        // Nếu newOrders là rỗng, newBookInfo sẽ là null và TableStatus là 'EMPTY'

        // 6. Cập nhật selectedTable (dữ liệu đang hiển thị)
        if (selectedTable && selectedTable.TableId === tableId) {
            setSelectedTable(prev => prev ?
                {
                    ...prev,
                    // ✅ Cập nhật BookInfo
                    BookInfo: newBookInfo,
                    // TableStatus: newTableStatus
                }
                : undefined
            );
        }
    };
    const handleUpdateTime = (SelectedTime: SelectedTime | null) => {
        if (!tables || !SelectedTime) return;
        if (selectedTable && selectedTable.TableId === SelectedTime.tableId) {
            setSelectedTable(prev => {
                if (!prev) return undefined;
                if (!prev.BookInfo) {
                    // Nếu BookInfo null, không có sản phẩm nào được thêm, ta cần dừng lại.
                    // Hoặc có thể tạo một cấu trúc BookInfo rỗng tại đây nếu cần.
                    message.error("Vui lòng thêm sản phẩm trước khi chọn thời gian.", 3);
                    return prev;
                }
                const updatedBookData = {
                    ...prev.BookInfo.bookData,
                    from_slot: SelectedTime.fromSlot,
                    to_slot: SelectedTime.toSlot,
                };
                const updatedBookInfo = {
                    ...prev.BookInfo,
                    bookData: updatedBookData,
                };
                return {
                    ...prev,
                    BookInfo: updatedBookInfo
                };
            }
            );
        }
    }
    const handleClearTable = (tableId: string) => {
        if (!tables) return;
        setTables(prevTables =>
            prevTables?.map(table =>
                table.TableID === tableId ? { ...table, BookInfo: null } : table
            )
        );
        setSelectedTable(undefined);
    };
    const handleOpenDrawer = () => {
        setIsDrawerVisible(true)
    }
    const handleCloseDrawer = () => {
        setIsDrawerVisible(false)
    }
    return (
        <>
            {/* Header ngang */}
            <MainHeader onOpenProductDrawer={() => setIsDrawerVisible(true)} onFocusSplitter={handleFocusSplitter} />
            <Splitter style={{ minHeight: "100vh", maxHeight: "150vh", boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <Splitter.Panel>
                    <div ref={splitterRef} tabIndex={-1} style={{ height: '100%', outline: 'none' }}>
                        <Splitter layout="vertical" >
                            <Splitter.Panel>
                                <FloorPlan tables={getTables ?? []} now={nowSlot} onSelectTable={handleSelectTable} selectedTableId={selectedTable?.TableId} />
                            </Splitter.Panel>
                            <Splitter.Panel collapsible defaultSize={"50%"} max={"50%"} min={"10%"}>
                                {/* Panel chi tiết bàn ở dưới */}
                                <OrderDetailsPanel
                                    table={selectedTable}
                                    onOpenDrawer={handleOpenDrawer}
                                    onUpdateOrders={handleUpdateOrders}
                                    onClearTable={handleClearTable}
                                    onClose={() => setSelectedTable(undefined)} // Thêm nút đóng panel
                                />

                            </Splitter.Panel>
                        </Splitter>
                    </div>
                </Splitter.Panel>
                <Splitter.Panel collapsible max={"30%"} min={"25%"} defaultSize={"25%"}>
                    {/* Drawer danh sách sản phẩm */}
                    <ProductList
                        onAddProduct={(product) => {
                            if (selectedTable) {
                                handleUpdateOrders(selectedTable.TableId, [...(selectedTable.BookInfo?.bookData.book_lists[0].products || []), product])
                            }
                        }}
                        currentOrders={selectedTable?.BookInfo?.bookData.book_lists[0].products || []}
                    />

                </Splitter.Panel>

            </Splitter>
       
            <Drawer open={isDrawerVisible} onClose={handleCloseDrawer} placement='bottom' height={"100%"}>
                <TableTimeSelector
                    storeId={storeId}
                    tableData={selectedTable}
                    onSelectionChange={handleUpdateTime}
                />
                <OrderDetailsPanel
                    table={selectedTable}
                    onOpenDrawer={handleOpenDrawer}
                    onUpdateOrders={handleUpdateOrders}
                    onClearTable={handleClearTable}
                    onClose={() => setSelectedTable(undefined)} 
                    viewMode={true}
                />
            </Drawer>
            
        </>
    );
}