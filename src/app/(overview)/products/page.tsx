"use client";
import productApiRequest from "@/src/apiRequests/product";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import CategoryFilter from "@/src/components/Filter/CategoryFilter";
import CardProduct from "@/src/components/Products/CardProduct";
import { useProducts } from "@/src/hooks/useProduct";
import { AppstoreOutlined, FilterOutlined } from "@ant-design/icons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button, Drawer, Pagination } from "antd";
import { useState } from "react";

interface BoardGame {
  id: string;
  product_group_ref_id: string;
  product_name: string;
  sell_price: number;
  status: boolean;
  image: string;
  sales_quantity: number;
  rent_quantity: number;
  publisher: string;
  category: string;
  player: string;
  time: string;
  age: number;
  complexity: number;
}

interface responseModel {
  data: BoardGame[];
  message: string;
  statusCode: number;
  paging: {
    pageNum: number; // Thay đổi kiểu dữ liệu
    pageSize: number; // Thay đổi kiểu dữ liệu
    pageCount: number;
  };
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const { products, isLoading, isError, error, pageCount, pageSize } =
    useProducts(currentPage);
  // const { data, isLoading, isError, error } = useQuery<responseModel>({
  //   queryKey: ["boardGames", currentPage],
  //   queryFn: async () => {
  //     const res = await productApiRequest.getList({
  //       search: "",
  //       filter: [],
  //       paging: {
  //         pageNum: currentPage,
  //         pageSize: 10,
  //       },
  //     });
  //     return res;
  //   },
  //   placeholderData: keepPreviousData,
  // });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Failed to load products."}</div>;
  }

  const totalItems = pageCount * pageSize;
  console.log("pageCount", pageCount);
  console.log("pageSize", pageSize);
  console.log("totalItems", totalItems);

  return (
    <div className="flex ">
      <main className="pt-4">
        <div className=" mb-4 flex justify-start items-center divide-x-2 divide-gray-900">
          <div className="pr-2">
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={showDrawer}
            >
              Bộ Lọc
            </Button>
          </div>

          <div className="flex items-center">
            <AppstoreOutlined className="mx-2" />
            <p className="mr-2 font-bold">Sắp xếp theo</p>
            <select
              className="border-none bg-transparent outline-none text-gray-900 dark:text-white cursor-pointer"
              defaultValue="default"
            >
              <option value="default">Bán chạy nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="popularity">Phổ biến</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          {/* Filter */}
          {/* <div className="hidden lg:block lg:basis-1/4 pr-4">
              <CategoryFilter />
            </div> */}
          {/* <div className="block lg:hidden mb-4">
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={showDrawer}
              >
                Bộ Lọc
              </Button>
            </div> */}

          {/* Drawer cho mobile */}
          <Drawer title="Bộ Lọc" placement="left" onClose={onClose} open={open}>
            <CategoryFilter />
          </Drawer>
          {/* Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {products
              // .filter((boardgame) => boardgame.sales_quantity > 0)
              .map((product) => {
                const imageUrls = product.image?.split("||") || [];
                return (
                  <CardProduct
                    key={product.id}
                    id={product.id}
                    image={imageUrls[0]}
                    price={product.sell_price}
                    title={product.product_name}
                    time={product.time}
                    player={product.player}
                    age={product.age}
                    complexity={product.complexity}
                    soldOut={product.status}
                    quantity={product.sales_quantity}
                  />
                );
              })}
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          className="m-5"
          align="center"
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
        />
        {/* <AntdCustomPagination totalPages={totalItems}/> */}
      </main>
    </div>
  );
}
