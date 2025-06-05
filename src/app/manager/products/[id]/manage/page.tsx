"use client";
import { useAppContext } from "@/src/app/app-provider";
import { useProduct } from "@/src/hooks/api/product/useProduct";
import ProductDetailUI from "./ProductTemplateForm";
import ProductListCard from "./ProductsWrapper";
import { Breadcrumb } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { inter } from "@/src/fonts/fonts";

const breadcrumb: BreadcrumbItemType[] =
    [
        {
            href: '/manager',
            title: <HomeOutlined />,
        },
        {
            // href: baseUrl,
            title: (
                <>
                    <UserOutlined />
                    <span>Board Game List</span>
                </>
            ),
        },

    ];
interface requestBodyType {
    templateID: string;
    conditionFilter: number; // 0: All, 1: Sales, 2: Rent
}
export default function ManageProductTemplate({ params, searchParams }: { params: { id: string }, searchParams?: { query?: string; page?: string; }; }) {
    const user = useAppContext().user;
    const [filterParams, setFilterParams] = useState<requestBodyType>({
        templateID: params.id,
        conditionFilter: 0
    });
    const handleFilterChange = (value: number) => {
        setFilterParams((prev) => ({ ...prev, conditionFilter: value }));
    }
    const productTemplate = useProduct({
        query: {
            type: "GET_BY_ID",
            params: { productID: params.id },
        },
    });
    const products = useProduct({
        query: {
            type: "GET_LIST_BY_TEMPLATE_ID",
            params: {
                templateID: params.id,
                conditionFilter: filterParams.conditionFilter,
                paging: {
                    pagenum: searchParams?.page ? parseInt(searchParams.page) : 1,
                    pageSize: 20, 
                }
            },
        },
        authToken: user?.token,
    });


    return (
        <>
            <Breadcrumb items={breadcrumb} className="pb-4" />

            <ProductDetailUI product={productTemplate.products[0]} />
            <h1>Product List</h1>
            <ProductListCard products={products.products.sort((a, b) => a.code.localeCompare(b.code))}
                totalPages={products.paging?.paging?.pageCount ?? 1} currentPage={products.paging?.paging?.pageNum ?? 1} onFilterChange={handleFilterChange} />
        </>
    )
}