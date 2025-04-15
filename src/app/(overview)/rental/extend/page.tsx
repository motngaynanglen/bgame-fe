"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { useSelectedStore } from "@/src/hooks/useSelectStoreId";
import { useStores } from "@/src/hooks/useStores";
import { useQuery } from "@tanstack/react-query";
import TimeSlotDisplay from "./TimeSlotDisplay";
import StoreSelector from "./StoreSelecter";
import { useState } from "react";
import { Card, Col, DatePicker, Row } from "antd";
import ProductWrapper from "./ProductWrapper";

export default function ExtendPage() {
    const {
        stores,
        isLoading: storesLoading,
        isError: storesError,
        error: storesErrorData,
    } = useStores();
    const [selectedStore, setSelectedStore] = useState("");
    const { selectedStoreId, setSelectedStoreId } = useSelectedStore();
    const fetchBoardGamesByStoreId = async (storeId: string) => {
        try {
            const res = await bookListApiRequest.getBookAvailableProduct({
                storeId,
                date: new Date(),
                paging: null
                // {
                //   pageNum: 1,
                //   pageSize: 10,

                // }
            });
            return res;
        } catch (error) {
            console.error("lỗi store: " + error);
        }
    };

    const {
        data,
        isLoading: rentalLoading,
        isError: rentalError,
        error: rentalErrorData,
    } = useQuery({
        queryKey: ["rentalBoardGames", selectedStoreId],
        queryFn: () => fetchBoardGamesByStoreId(selectedStoreId!),
        enabled: !!selectedStoreId,
    });

    return (
        <>
            <div className="py-4 w-full mx-auto">
                <Row gutter={16}>
                    <Col span={12}>
                        <Card>
                            <h2 className="text-lg font-semibold mb-4">Chọn cửa hàng</h2>
                            <StoreSelector
                                value={selectedStore}
                                onChange={setSelectedStore}
                                className="mb-6"
                                placeholder="Tìm cửa hàng..."
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <h2 className="text-lg font-semibold mb-4">Chọn Ngày lên đơn</h2>
                            <DatePicker type="date" />
                        </Card>
                    </Col>
                </Row>
            </div>
            <TimeSlotDisplay storeid={selectedStore} />
            <ProductWrapper storeid={selectedStore} date={new Date()} />
        </>
    );
}