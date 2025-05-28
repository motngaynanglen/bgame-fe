"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import CardProductRent from "@/src/components/Card/CardProductRent";
import { Card } from "antd";
import { useEffect, useState } from "react";

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
export default function ProductWrapper({ storeid, date }: { storeid: string, date?: Date }) {
    const [products, setProducts] = useState<BoardGame[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTimeSlots = async () => {
            try {
                setLoading(true);
                // Mock data - replace with real API call

                const response = await bookListApiRequest.getBookAvailableProduct({
                    storeId: storeid,
                    date: date ?? new Date()
                });
                const products: BoardGame[] = response.data;

                setProducts(products);
            } catch (error) {
                console.error('Error fetching time slots:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTimeSlots();
    }, [storeid]);

    return (
        <>
            <Card className="my-5" loading={loading} title="Danh sách sản phẩm cho thuê" >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                    {(products?.map((boardgame, index) => (
                        <CardProductRent
                            key={index}
                            id={boardgame.id}
                            idGroup={boardgame.product_group_ref_id}
                            storeId={storeid ?? null}
                            quantity={boardgame.quantity}
                            image={boardgame.image}
                            price={boardgame.price}
                            title={boardgame.product_name}
                            isRented={false}
                            rent_price={boardgame.rent_price}
                            rent_price_per_hour={boardgame.rent_price_per_hour}
                            complexity={boardgame.complexity}
                            age={boardgame.age}
                            time={boardgame.time}
                            player={boardgame.player}
                        />
                    )))}

                </div>
                <div className="m-5">
                    <AntdCustomPagination totalPages={2} />
                </div>
            </Card>
        </>
    );
}