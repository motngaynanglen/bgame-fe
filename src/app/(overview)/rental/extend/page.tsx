"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { useSelectedStore } from "@/src/hooks/useSelectStoreId";
import { useStores } from "@/src/hooks/useStores";
import { useQuery } from "@tanstack/react-query";
import TimeSlotDisplay from "./TimeSlotDisplay";
import StoreSelector from "./StoreSelecter";
import { useEffect, useState } from "react";
import { Button, Card, Col, DatePicker, Drawer, Result, Row } from "antd";
import ProductWrapper from "./ProductWrapper";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import CardProductRent from "@/src/components/Card/CardProductRent";
import CartRental from "../RentalCart";
import CategoryFilter from "@/src/components/Filter/CategoryFilter";
import { FilterOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import BookingTable from "../BookTimeTable";
import Breadcrumb from "@/src/components/Breadcrumb/Breadcrumb";
import Loading from "../../loading";
import { useRentalStore } from "@/src/store/rentalStore";

interface BoardGame {
    id: string;
    product_name: string;
    product_group_ref_id: string;
    quantity: number;
    price: number;
    status: boolean;
    image: string;
    rent_price: number;
    rent_price_per_hour: number;
    publisher: string;
    category: string;
    player: string;
    time: string;
    age: number;
    complexity: number;
}

export default function BoardGameRentalExtend() {
    const [openFilter, setOpenFilter] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [showBookingTable, setShowBookingTable] = useState(false);

    const { stores } = useStores();
    const { selectedStoreId, setSelectedStoreId } = useSelectedStore();
    const setStoreId = useRentalStore((state: { setStoreId: any }) => state.setStoreId);

    useEffect(() => {
        if (selectedStoreId) setStoreId(selectedStoreId);
    }, [selectedStoreId, setStoreId]);

    const fetchBoardGamesByStoreId = async (storeId: string) => {
        return await bookListApiRequest.getBookAvailableProduct({
            storeId,
            date: new Date(),
            paging: null,
        });
    };

    const { data, isLoading } = useQuery({
        queryKey: ["rentalBoardGames", selectedStoreId],
        queryFn: () => fetchBoardGamesByStoreId(selectedStoreId!),
        enabled: !!selectedStoreId,
    });

    if (isLoading) return <Loading />;

    return (
        <div>
            <Breadcrumb title="Dịch vụ thuê board game" subtitle="Tại BoardGame Impact" />

            <div className="flex container min-h-screen mx-auto max-w-screen-3xl">
                <main className=" p-4">
                    {showBookingTable ? (
                        <BookingTable storeId={selectedStoreId} bookDate={new Date()} />
                    ) : (
                        <>
                            {/* Chọn cửa hàng */}
                            <Card className="mb-6 shadow-sm">
                                <p className="text-base font-semibold mb-3">🎲 Chọn cửa hàng</p>
                                <StoreSelector
                                    value={selectedStoreId || ""}
                                    onChange={setSelectedStoreId}
                                    placeholder="Tìm cửa hàng..."
                                />
                            </Card>

                            {/* Nút lọc & giỏ hàng (mobile) */}
                            <div className="flex gap-3 mb-6">
                                <Button
                                    type="default"
                                    icon={<FilterOutlined />}
                                    onClick={() => setOpenFilter(true)}
                                >
                                    Bộ Lọc
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<ShoppingCartOutlined />}
                                    onClick={() => setOpenCart(true)}
                                    className="lg:hidden"
                                >
                                    Giỏ hàng
                                </Button>
                            </div>

                            {/* Drawer Filter */}
                            <Drawer
                                title="Bộ lọc sản phẩm"
                                placement="left"
                                onClose={() => setOpenFilter(false)}
                                open={openFilter}
                            >
                                <CategoryFilter />
                            </Drawer>

                            {/* Drawer Cart (mobile) */}
                            <Drawer
                                title="Giỏ hàng"
                                placement="right"
                                onClose={() => setOpenCart(false)}
                                open={openCart}
                            >
                                <CartRental showBookingTable={showBookingTable} onChooseTable={(value) => setShowBookingTable(value)} />
                            </Drawer>

                            {/* Danh sách sản phẩm */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {Array.isArray(data?.data) && data.data.length > 0 ? (
                                    data.data.map((boardgame: BoardGame) => (
                                        <CardProductRent
                                            key={boardgame.id}
                                            id={boardgame.id}
                                            idGroup={boardgame.product_group_ref_id}
                                            storeId={selectedStoreId ?? null}
                                            quantity={boardgame.quantity}
                                            image={boardgame.image}
                                            price={boardgame.price}
                                            title={boardgame.product_name}
                                            isRented={boardgame.status}
                                            rent_price={boardgame.rent_price}
                                            rent_price_per_hour={boardgame.rent_price_per_hour}
                                            complexity={boardgame.complexity}
                                            age={boardgame.age}
                                            time={boardgame.time}
                                            player={boardgame.player}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full">
                                        <Result status="404" title="Không có sản phẩm" subTitle="Cửa hàng hiện chưa có trò chơi nào cho thuê." />
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center mt-8">
                                <AntdCustomPagination totalPages={20} />
                            </div>
                        </>
                    )}
                </main>

                {/* Cart (desktop) */}

                <CartRental showBookingTable={showBookingTable} onChooseTable={(value) => setShowBookingTable(value)} />
            </div>
        </div>
    );
}