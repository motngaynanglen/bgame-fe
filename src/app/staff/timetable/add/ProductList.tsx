'use client';

import React, { useMemo, useState } from 'react';
import { Drawer, List, Button, Tag, message, Input, Spin, AutoComplete, Empty, Image, Typography, Tooltip, Card, Switch } from 'antd';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { BoardGame, BookItem, ProductViewModel } from './types';
import { useAppContext } from '@/src/app/app-provider';
import { useMutation, useQuery } from '@tanstack/react-query';
import productApiRequest from '@/src/apiRequests/product';
import { on } from 'events';
import { Tool } from 'react-feather';

interface ProductListProps {
    onAddProduct: (product: ProductViewModel | BoardGame) => void;
    currentOrders: BoardGame[];
}


export default function ProductList({ onAddProduct, currentOrders }: ProductListProps) {
    const { user } = useAppContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [options, setOptions] = useState<BoardGame[]>([]);
    const [showAll, setShowAll] = useState(false);
    const handleSwitchChange = (checked: boolean) => {
        setShowAll(checked);
    };
    // const { data: products } = useQuery({
    //     queryKey: ["storeProducts", searchTerm, user?.token],
    //     queryFn: async () => {
    //         if (!user?.token) {
    //             throw new Error("User token is not available");
    //         }
    //         const res = await productApiRequest.getByCode({ code: searchTerm, productType: 0 }, user?.token);
    //         return res.data;
    //     },
        
    //     enabled: !!user?.token,
    // });

    const searchProducts = useMutation({
        mutationFn: async (code: string) => {
            const res = await productApiRequest.getByCode({ code, productType: 0 }, user?.token);
            return res.data;
        },
        onSuccess: (products) => {
            if (Array.isArray(products) && products.length > 0) {
                const searchResults = Array.isArray(products) ? products as BoardGame[] : [];
                setOptions(searchResults);

            } else {
                message.warning("Không tìm thấy sản phẩm");
            }
        },
        onError: () => {
            setOptions([]);
            message.error("Không tìm thấy sản phẩm");
        },

    });
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (value.trim() && user?.token) {
            searchProducts.mutate(value);
        } else {
            setOptions([]);
        }
    };
    const orderProductCodes = useMemo(() => new Set(currentOrders.map(o => o.code)), [currentOrders]);

    const displayList = useMemo(() => {
        const uniqueProducts = new Map<string, BoardGame>();

        // Thêm các sản phẩm đang có trong đơn hàng vào map
        currentOrders.forEach(p => uniqueProducts.set(p.code, p));

        // Thêm các sản phẩm từ kết quả tìm kiếm, nếu chưa tồn tại
        options.forEach(p => {
            if (!uniqueProducts.has(p.code)) {
                uniqueProducts.set(p.code, p);
            }
        });

        return Array.from(uniqueProducts.values());
    }, [currentOrders, options]);
    // const handleSelect = (value: string) => {
    //     const selected = options.find((o) => (o.code === value) || (o.product_name === value));
    //     if (selected) {
    //         onAddProduct(selected);
    //         setSearchTerm("");
    //         setOptions([]);
    //     }
    // };
    return (

        <div className="mb-4">
            <div className="mb-4">
                <Typography.Title level={4}>Danh sách sản phẩm</Typography.Title>

                <Input
                    placeholder="Nhập mã/tên sản phẩm..."
                    prefix={<SearchOutlined />}
                    size="large"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="mb-4"
                />
                <div className="flex justify-end items-center mb-2">

                    <Switch onChange={(e) => handleSwitchChange(e)} className='d-flex justify-end' checkedChildren="Gồm sản phẩm đã chọn" unCheckedChildren="Chỉ sản phẩm chưa thêm" defaultChecked />
                </div>
            </div>

            {searchProducts.isPending ? (
                <div className="flex justify-center items-center h-20">
                    <Spin />
                </div>
            ) : (
                <List
                    dataSource={showAll ? displayList : displayList.filter(item => !orderProductCodes.has(item.code))}
                    locale={{ emptyText: <Empty description="Không có sản phẩm nào được tìm thấy" /> }}
                    renderItem={item => {
                        const isAdded = orderProductCodes.has(item.code);
                        return (
                            <List.Item
                                key={item.code}
                            >
                                <div className='w-full flex-col justify-between items-center p-1'>
                                    <List.Item.Meta
                                        avatar={<Image className='justify-center' src={item.image} alt={item.product_name} style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }} />}
                                        title={
                                            <div className="flex items-center justify-between">
                                                <Typography.Text className="font-semibold" ellipsis>
                                                    <Tooltip title={item.product_name} placement="topLeft">
                                                        {item.product_name}
                                                    </Tooltip>
                                                </Typography.Text>
                                                <span className={`ml-2 px-2 py-1 rounded-sm text-xs font-medium ${item.product_type === "SALES_PRODUCT" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                                                    {item.product_type === "SALES_PRODUCT" ? "Bán" : "Thuê"}
                                                </span>
                                            </div>
                                        }
                                        description={


                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-gray-600">Mã: {item.code}</p>
                                                <p className="font-bold text-green-600 text-lg">
                                                    {item.rent_price_per_hour?.toLocaleString()}₫
                                                    {item.product_type === "RENT_PRODUCT" && <span className="text-xs text-gray-500 ml-1">/giờ</span>}
                                                </p>
                                            </div>


                                        }
                                    />
                                    <span className='pt-2 w-full flex justify-end items-center'>
                                        {[
                                            isAdded ? (
                                                <Tag className='w-full' icon={<CheckCircleOutlined />} color="success">Đang sử dụng</Tag>
                                            ) : (
                                                <Button
                                                    className='w-full'
                                                    type="primary"
                                                    onClick={() => onAddProduct(item)}
                                                    disabled={item.status !== "ACTIVE"}
                                                >
                                                    {item.status === "ACTIVE" ? "Thêm" : "Không khả dụng"}
                                                </Button>
                                            ),
                                        ]}
                                    </span>
                                </div>
                            </List.Item>
                        );
                    }}
                />
            )}
        </div>


    );
}