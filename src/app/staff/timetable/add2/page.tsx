'use client';

import React, { useState } from 'react';
import { Layout, Splitter } from 'antd';
import Sidebar from './Sidebar';
import FloorPlan from './FloorPlan';
import { Table, BoardGame } from './types';
import MainHeader from './MainHeader';
import OrderDetailsPanel from './OrderDetailsPanel';
import ProductList from './ProductList';

const { Content } = Layout;

// Dữ liệu mẫu (mock data)
const initialTables: Table[] = [
    {
        TableID: 'T01', TableName: 'T01', Capacity: 4, Status: 'occupied', books: {
            id: 'C01', from_slot: 1, to_slot: 2, BookItem: [{ product_id: 'C01', code: 'C01', product_name: 'Coffee', price: 25000 }]
        }
    },
    { TableID: 'T02', TableName: 'T02', Capacity: 8, Status: 'empty', books: undefined },
    {
        TableID: 'T03', TableName: 'T03', Capacity: 4, Status: 'occupied', books: {
            id: 'C02', from_slot: 1, to_slot: 2, BookItem: [{ product_id: 'C02', code: 'C02', product_name: 'Tea', price: 20000 }]
        }
    },
    { TableID: 'T04', TableName: 'T04', Capacity: 4, Status: 'reserved', books: undefined },
    {
        TableID: 'T05', TableName: 'T05', Capacity: 8, Status: 'occupied', books: {
            id: 'C03', from_slot: 1, to_slot: 2, BookItem: [{ product_id: 'C03', code: 'C03', product_name: 'Juice', price: 30000 }, { product_id: 'C04', code: 'C04', product_name: 'Cake', price: 40000 }]
        }
    },
];

export default function Home() {
    const [selectedTable, setSelectedTable] = useState<Table | undefined>(undefined);
    const [tables, setTables] = useState<Table[]>(initialTables);
    const [isProductDrawerVisible, setIsProductDrawerVisible] = useState(false);

    const handleSelectTable = (table: Table) => {
        setSelectedTable(table);
    };

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

    return (
        <>
            {/* Header ngang */}
            <MainHeader onOpenProductDrawer={() => setIsProductDrawerVisible(true)} />
            <Splitter style={{ height:"100vh", boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <Splitter.Panel>
                    <Splitter layout="vertical" >
                        <Splitter.Panel>
                            <FloorPlan tables={tables} onSelectTable={handleSelectTable} selectedTableId={selectedTable?.TableID} />
                        </Splitter.Panel>
                        <Splitter.Panel collapsible defaultSize={"30%"} max={"50%"} min={"10%"}>
                            {/* Panel chi tiết bàn ở dưới */}
                            <OrderDetailsPanel
                                table={selectedTable}
                                onUpdateOrders={handleUpdateOrders}
                                onClearTable={handleClearTable}
                                onClose={() => setSelectedTable(undefined)} // Thêm nút đóng panel
                            />
                        </Splitter.Panel>
                    </Splitter>
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
        </>
    );
}