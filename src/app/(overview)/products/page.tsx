"use client";
import CategoryFilter from "@/src/components/Filter/CategoryFilter";
import CardProduct from "@/src/components/Card/CardProduct";
import { useProducts } from "@/src/hooks/useProduct";
import { AppstoreOutlined, FilterOutlined } from "@ant-design/icons";
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
    <div className="container min-h-screen mx-auto max-w-screen-3xl">
      <div className="flex flex-col lg:flex-row">
        <aside className="hidden lg:block w-1/4  text-white sticky top-[64px] h-[calc(100vh-64px)] border-l-2 border-gray-200 overflow-y-auto">
          <CategoryFilter />
        </aside>
        <main className="w-full lg:w-3/4 p-4">
          <div className="mb-4 flex flex-col lg:flex-row justify-between items-start lg:items-center border-2 border-gray-900 p-4 rounded-lg bg-gray-800 text-white space-y-4 lg:space-y-0">
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold pr-2">Sản phẩm</h1>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center w-full lg:w-auto">
              {/* Bộ lọc */}
              <div className="flex justify-end lg:hidden mb-2">
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  onClick={showDrawer}
                  className="w-full md:w-auto"
                >
                  Bộ Lọc
                </Button>
              </div>

              {/* Sắp xếp */}
              <div className="flex items-center justify-between w-full sm:justify-end">
                <AppstoreOutlined className="mx-2" />
                <p className="mr-2 font-bold whitespace-nowrap">Sắp xếp theo</p>
                <select
                  className="border-none outline-none bg-gray-800 p-2 text-white cursor-pointer w-full md:w-auto"
                  defaultValue="default"
                >
                  <option value="default">Bán chạy nhất</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="popularity">Phổ biến</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
            </div>
          </div>
          {/* Drawer cho mobile */}
          <Drawer
            title="Bộ Lọc"
            placement="right"
            onClose={onClose}
            open={open}
          >
            <CategoryFilter />
          </Drawer>
          <div className="flex flex-col lg:flex-row">
            {/* Product Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 w-full">
              {products
                // .filter((boardgame) => boardgame.sales_quantity > 0)
                .map((product) => {
                  const imageUrls = product.image?.split("||") || [];
                  return (
                    <CardProduct
                      key={product.id}
                      id={product.id}
                      product_group_ref_id={product.product_group_ref_id}
                      image={imageUrls[0]}
                      price={product.sell_price}
                      title={product.product_name}
                      time={product.time}
                      player={product.player}
                      age={product.age}
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
    </div>
  );
}
