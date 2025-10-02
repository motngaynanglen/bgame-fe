'use client';

import React, { use, useEffect, useState } from 'react';
import { Drawer, Layout, message, Splitter } from 'antd';
import Sidebar from './Sidebar';
import FloorPlan from './FloorPlan';
import { Table, BoardGame, book } from './types';
import MainHeader from './MainHeader';
import OrderDetailsPanel from './OrderDetailsPanel';
import ProductList from './ProductList';
import { useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import storeApiRequest from '@/src/apiRequests/stores';
import bookTableApiRequest from '@/src/apiRequests/bookTable';
import { useAppContext } from '@/src/app/app-provider';
import TableTimeSelector from './TableTimeSelector';

const { Content } = Layout;

// Dữ liệu mẫu (mock data)
const initialTables: Table[] = [
    {
        TableID: 'T01', TableName: 'T01', Capacity: 4, Status: 'occupied', books: {
            id: 'C01', book_code: 'C01', from_slot: 1, to_slot: 2, BookItem: [{ product_id: 'C01', code: 'C01', product_name: 'Coffee', price: 25000 }]
        }
    },
    { TableID: 'T02', TableName: 'T02', Capacity: 8, Status: 'empty', books: undefined },
    {
        TableID: 'T03', TableName: 'T03', Capacity: 4, Status: 'occupied', books: {
            id: 'C02', book_code: 'C02', from_slot: 1, to_slot: 2, BookItem: [{ product_id: 'C02', code: 'C02', product_name: 'Tea', price: 20000 }]
        }
    },
    { TableID: 'T04', TableName: 'T04', Capacity: 4, Status: 'reserved', books: undefined },
    {
        TableID: 'T05', TableName: 'T05', Capacity: 8, Status: 'occupied', books: {
            id: 'C03', book_code: 'C03', from_slot: 1, to_slot: 2, BookItem: [{ product_id: 'C03', code: 'C03', product_name: 'Juice', price: 30000 }, { product_id: 'C04', code: 'C04', product_name: 'Cake', price: 40000 }]
        }
    },
];

export default function Home() {
    const { user } = useAppContext();
    const [selectedTable, setSelectedTable] = useState<Table | undefined>(undefined);
    const [tables, setTables] = useState<Table[]>(initialTables);
    const [selectedBook, setSelectedBook] = useState<book | undefined>(undefined)
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const splitterRef = useRef<HTMLDivElement>(null);
    const { data: storeId, isLoading: storeLoading } = useQuery({
        queryKey: ["selectedStoreId"],
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
    const handleSelectTable = (table: Table) => {
        setSelectedTable(table);
    };
    const getTables = useMutation({
        mutationFn: async () => {
            if (user) {
                const res = await bookTableApiRequest.getbooklistbyDate(new Date("2025-08-13"), user?.token);
                return res.data;
            }
        },
        onSuccess: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                const tables = Array.isArray(data) ? data as Table[] : [];
                setTables(tables);

            } else {
                setTables([]);
            }
        },
        onError: () => {
            setTables([]);
            message.error("Không tìm thấy bàn");
        },

    });
    const handleUpdateOrders = (tableId: string, newOrders: BoardGame[]) => {
        setTables(prevTables =>
            prevTables.map(table =>
                table.TableID === tableId ? { ...table, books: { ...table.books!, BookItem: newOrders }, Status: 'occupied' } : table
            )
        );
        if (selectedTable && selectedTable.TableID === tableId) {
            setSelectedTable(prev => prev ? { ...prev, books: { ...prev.books!, BookItem: newOrders }, Status: 'occupied' } : undefined);
        }
    };

    const handleClearTable = (tableId: string) => {
        setTables(prevTables =>
            prevTables.map(table =>
                table.TableID === tableId ? { ...table, books: undefined, Status: 'empty' } : table
            )
        );
        setSelectedTable(undefined);
    };
    useEffect(() => {
        // Cập nhật data mỗi mười giây
        const timerId = setInterval(() => {
            getTables.mutate();
        }, 10000);
        return () => clearInterval(timerId);
    }, []);
    return (
        <>
            {/* Header ngang */}
            <MainHeader onOpenProductDrawer={() => setIsDrawerVisible(true)} onFocusSplitter={handleFocusSplitter} />
            <Splitter style={{ height: "100vh", boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <Splitter.Panel>
                    <div ref={splitterRef} tabIndex={-1} style={{ height: '100%', outline: 'none' }}>
                        <Splitter layout="vertical" >
                            <Splitter.Panel>
                                <FloorPlan tables={tables} onSelectTable={handleSelectTable} selectedTableId={selectedTable?.TableID} />
                            </Splitter.Panel>
                            <Splitter.Panel collapsible defaultSize={"50%"} max={"50%"} min={"10%"}>
                                {/* Panel chi tiết bàn ở dưới */}
                                <OrderDetailsPanel
                                    table={selectedTable}
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
                                handleUpdateOrders(selectedTable.TableID, [...(selectedTable.books?.BookItem || []), product])
                            }
                        }}
                        currentOrders={selectedTable?.books?.BookItem || []}
                    />

                </Splitter.Panel>

            </Splitter>
            <Drawer>
                {/* <TableTimeSelector /> */}
            </Drawer>
        </>
    );
}