"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { useSelectedStore } from "@/src/hooks/useSelectStoreId";
import { useStores } from "@/src/hooks/useStores";
import { useQuery } from "@tanstack/react-query";
import TimeSlotDisplay from "./TimeSlotDisplay";
import StoreSelector from "./StoreSelecter";
import { useEffect, useState } from "react";
import { Button, Card, Col, DatePicker, Drawer, Result, Row, Select } from "antd";
import ProductWrapper from "./ProductWrapper";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import CardProductRent from "@/src/components/Card/CardProductRent";
import CartRental from "../RentalCart";
import CategoryFilter from "@/src/components/Filter/CategoryFilter";
import { AppstoreOutlined, FilterOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import BookingTable from "../BookTimeTable";
import Breadcrumb from "@/src/components/Breadcrumb/Breadcrumb";
import Loading from "../../loading";
import { useRentalStore } from "@/src/store/rentalStore";
import RentalProductCard from "../RentalProductCard";
import { set } from "zod";

export interface AvailableRentBoardGame {
    id: string;
    product_name: string;
    product_group_ref_id: string;
    status: boolean;
    image: string;
    rent_price: number;
    rent_price_per_hour: number;
    publisher: string;
    category: string;
    duration: string;
    age: number;
    difficulty: number;
    rent_count: number;
    number_of_player_min: number;
    number_of_player_max: number;
    list_categories: string[];
    description: string;
    code_prefix: string;
}

export default function BoardGameRentalExtend() {
    const [openFilter, setOpenFilter] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [showBookingTable, setShowBookingTable] = useState(false);

    const { stores } = useStores();
    const { selectedStoreId, selectedStore, setSelectedStoreId } = useSelectedStore();
    const { setStoreInfo } = useRentalStore();

    useEffect(() => {
        if (selectedStore) {
            setStoreInfo(selectedStore?.id, selectedStore?.store_name, selectedStore?.address);
        }
    }, [selectedStoreId]);

    const handleOpenCart = () => {
        if (openCart) setOpenCart(false);
        else setOpenCart(true);
    };
    const fetchBoardGamesByStoreId = async (storeId: string) => {
        return await bookListApiRequest.getBookAvailableProduct({
            storeId,
            date: new Date(),
            paging: null,
        });
    };

    const { data, isLoading } = useQuery({
        queryKey: ["rentalBoardGames", selectedStoreId],
        queryFn: () => {
            if (selectedStore) {
                setStoreInfo(selectedStore?.id, selectedStore?.store_name, selectedStore?.address);
                return fetchBoardGamesByStoreId(selectedStoreId!);
            }
        },
        enabled: !!selectedStoreId,
    });

    if (isLoading) return <Loading />;

    return (
        <div>
            <Breadcrumb title="Dịch vụ thuê board game" subtitle="Tại BoardGame Impact" />

            <div className="flex container min-h-screen mx-auto max-w-screen-3xl">
                <main className="p-4 w-full mx-15">
                    {showBookingTable ? (
                        <BookingTable storeId={selectedStoreId} bookDate={new Date()} />
                    ) : (
                        <>
                            <Row gutter={[16, 16]} className="mb-6">
                                {/* Bộ lọc bên trái */}
                                <Col xs={24} lg={6}>
                                    <CategoryFilter />
                                </Col>

                                {/* Nội dung bên phải */}
                                <Col xs={24} lg={18}>
                                    <Card className="shadow-sm" style={{padding: "0"}}>
                                        {/* Hàng nút Filter + Giỏ hàng (mobile) */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">

                                            <div className="mt-1 w-full" >
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-base font-semibold mb-2 flex items-center gap-2">
                                                        🎲 Chọn cửa hàng
                                                    </p>
                                                    <Button
                                                        type="primary"
                                                        icon={<ShoppingCartOutlined />}
                                                        onClick={handleOpenCart}
                                                        className="sm:hidden"
                                                        block
                                                    >
                                                        Giỏ hàng
                                                    </Button>

                                                </div>

                                                <StoreSelector
                                                    value={selectedStoreId || ""}
                                                    onChange={setSelectedStoreId}
                                                    placeholder="Tìm cửa hàng..."
                                                />
                                                {/* Sort */}
                                                <div className="flex items-center gap-2 justify-end w-full sm:w-auto mt-3">
                                                    <AppstoreOutlined />
                                                    <span className="font-medium whitespace-nowrap">Sắp xếp theo:</span>
                                                    <Select
                                                        defaultValue="default"
                                                        className="min-w-[160px]"
                                                        popupMatchSelectWidth={false}
                                                        options={[
                                                            { value: "default", label: "Bán chạy nhất" },
                                                            { value: "price-asc", label: "Giá tăng dần" },
                                                            { value: "price-desc", label: "Giá giảm dần" },
                                                            { value: "popularity", label: "Phổ biến" },
                                                            { value: "newest", label: "Mới nhất" },
                                                        ]}
                                                    />
                                                </div>

                                            </div>

                                        </div>


                                    </Card>
                                    <div className="py-4">
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {Array.isArray(data?.data) && data.data.length > 0 ? (
                                                data.data.map((boardgame: AvailableRentBoardGame) => (
                                                    <RentalProductCard
                                                        key={boardgame.id}
                                                        AvailableProduct={boardgame}
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
                                    </div>
                                </Col>
                            </Row>







                        </>
                    )}
                </main>

                {/* Cart (desktop) */}

                <CartRental showBookingTable={showBookingTable} onChooseTable={(value) => setShowBookingTable(value)} forceOpen={openCart} />
            </div>
        </div>
    );
}