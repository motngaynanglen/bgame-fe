"use client";
import { useAppContext } from "@/src/app/app-provider";
import { useProduct } from "@/src/hooks/api/product/useProduct";

import { Breadcrumb } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import ProductListCard from "./ProductsWrapper";
import ProductDetailView from "./ProductTemplateForm";

const breadcrumb: BreadcrumbItemType[] = [
  {
    href: "/manager",
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

export default function page({ params, searchParams }: { params: { id: string }, searchParams?: { query?: string; page?: string; }; }) {
  const user = useAppContext().user;
  console.log(params.id);
  const productTemplate = useProduct({
    query: {
      type: "GET_BY_ID",
      params: { productID: params.id },
    },
  });
  const products = useProduct({
    query: {
      type: "GET_LIST_BY_TEMPLATE_ID",
      params: { templateID: params.id, conditionFilter: 0 },
    },
    authToken: user?.token,
  });

  return (
    <>
      <Breadcrumb items={breadcrumb} className="pb-4" />

      <ProductDetailView product={productTemplate.products[0]} />
      <h1>Product List</h1>
      <ProductListCard
        products={products.products}
        totalPages={10}
        currentPage={10}
      />
    </>
  );
}
