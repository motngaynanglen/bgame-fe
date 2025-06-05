"use client";
import React, { Suspense, useState } from 'react';
import { Card, Row, Col, Button, Tag, Space, Typography, message, Table, Select } from 'antd';
import {
    SwapOutlined,
    StopOutlined,
    ShoppingOutlined,
    ShopOutlined
} from '@ant-design/icons';
import type { ProductResType } from '@/src/schemaValidations/product.schema';
import { Grid } from 'antd';
import { LuLayoutTemplate } from 'react-icons/lu';
import AntdCustomPagination from '@/src/components/admin/table/pagination';
import SearchBar from "@/src/components/admin/table/search";

const { useBreakpoint } = Grid;


const { Text } = Typography;

interface ProductListCardProps {
    products: ProductResType[];
    totalPages: number;
    currentPage: number;
    onFilterChange?: (conditionFilter: number) => void;
}
const getProductTypeTag = (product_type: string) => {
    switch (product_type) {
        case 'SALES_PRODUCT':
            return { color: 'blue', label: 'Cho Bán', icon: <ShoppingOutlined /> };
        case 'RENT_PRODUCT':
            return { color: 'purple', label: 'Cho thuê', icon: <ShopOutlined /> };
        default:
            return { color: 'orange', label: 'Mẫu', icon: <LuLayoutTemplate /> };
    }
};

export default function ProductListCard({ products, totalPages, currentPage, onFilterChange }: ProductListCardProps) {
    const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

    const handleConvertToRent = (productId: string) => {
        message.info(`Converting product ${productId} to rental`);
    };

    const handleDeactivate = (productId: string) => {
        message.warning(`Deactivating product ${productId}`);
    };
    const handleSelectChange = (value: number) => {
        if (onFilterChange) {
            onFilterChange(value);
        }
    }
    const rows: ProductResType[][] = [];
    for (let i = 0; i < Math.min(products.length, 24); i += 4) {
        rows.push(products.slice(i, i + 4));
    }

    const ProductCardView = ({ product }: { product: ProductResType }) => {
        const productType = getProductTypeTag(product.product_type);
        return (
            <Card
                size="small"
                style={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
            >
                <Space
                    direction="vertical"
                    size="small"
                    style={{ width: '100%', flex: 1, justifyContent: 'space-between' }}
                >
                    {/* Product Code */}
                    <Text strong copyable style={{ display: 'block' }}>
                        {product.code}
                    </Text>


                    <div className='flex justify-between items-center'>
                        {/* Product Type Tag */}
                        <Tag
                            icon={productType.icon}
                            color={productType.color}
                        >
                            {productType.label}
                        </Tag>
                        {/* Status Tag */}
                        <Tag
                            color={product.status === 'ACTIVE' ? 'green' : 'red'}
                            style={{ marginRight: 0 }}
                        >
                            {product.status === 'ACTIVE' ? 'Hoạt Động' : 'Tạm Ngừng'}
                        </Tag>

                    </div>



                    {/* Action Buttons */}
                    <Space
                        size="small"
                        style={{ marginTop: 'auto', justifyContent: 'space-between', width: '100%' }}
                    >
                        {product.product_type === 'SALES_PRODUCT' && (
                            <Button
                                size="small"
                                icon={<SwapOutlined />}
                                onClick={() => handleConvertToRent(product.id)}
                                style={{ flex: 1 }}
                            >
                                Convert
                            </Button>
                        )}

                        <Button
                            size="small"
                            danger
                            icon={<StopOutlined />}
                            onClick={() => handleDeactivate(product.id)}
                            style={{ flex: 1 }}
                        >
                            Deactivate
                        </Button>
                    </Space>
                </Space>
            </Card>
        );
    }
    const columns = [
        {
            title: 'Mã SP',
            dataIndex: 'code',
            key: 'code',
            render: (text: string) => <Text copyable>{text}</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
                    {status === 'ACTIVE' ? 'Hoạt động' : 'Tạm Ngừng'}
                </Tag>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'product_type',
            key: 'product_type',
            render: (product_type: string) => (
                <Tag
                    icon={getProductTypeTag(product_type).icon}
                    color={getProductTypeTag(product_type).color}
                >
                    {getProductTypeTag(product_type).label}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_: any, record: ProductResType) => (
                <Space>
                    {record.product_type === 'SALES_PRODUCT' && (
                        <Button
                            size="small"
                            icon={<SwapOutlined />}
                            onClick={() => handleConvertToRent(record.id)}
                        />
                    )}
                    <Button
                        danger
                        size="small"
                        icon={<StopOutlined />}
                        onClick={() => handleDeactivate(record.id)}
                    />
                </Space>
            ),
        },
    ];
    function ProductTable({ products }: { products: ProductResType[] }) {
        return (
            <>
                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: true }}
                />
                <br />
                <AntdCustomPagination
                    totalPages={totalPages}
                    pageSize={10}
                />
            </>


        );
    }
    function ProductGrid({ products }: { products: ProductResType[] }) {
        const screens = useBreakpoint();
        const columnCount = screens.xxl ? 5 : screens.xl ? 4 : screens.lg ? 3 : screens.md ? 2 : 2;

        return (
            <>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columnCount}, 1fr)`, gap: 16 }}>
                    {products.map((product) => (
                        <ProductCardView key={product.id} product={product} />
                    ))}
                </div>
                <br />
                <AntdCustomPagination
                    totalPages={totalPages}
                    pageSize={10}
                />
            </>

        );
    };
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <Suspense>
                        <SearchBar placeholder={"Tìm kiếm theo mã sản phẩm..."} />
                    </Suspense>
                </Col>
                <Col span={8}>
                    <Button onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}>
                        Switch to {viewMode === 'table' ? 'Card View' : 'Table View'}
                    </Button>
                    <Select
                        defaultValue={0}
                        onChange={(value) => handleSelectChange(value)}
                    >
                        <Select.Option value={0}>Tất cả</Select.Option>
                        <Select.Option value={1}>Bán</Select.Option>
                        <Select.Option value={2}>Cho thuê</Select.Option>
                    </Select>
                </Col>
            </Row>
            {viewMode === 'table' ? (
                <ProductTable products={products} />
            ) : (
                <ProductGrid products={products} />
            )}
        </>
    );
};

