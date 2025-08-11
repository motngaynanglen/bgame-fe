"use client";
import { newsApiRequest } from "@/src/apiRequests/news";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading";
import { ArrowRightOutlined } from "@ant-design/icons";
import Image from "next/image";

interface newsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  author: string;
  createdBy: string;
  updatedBy: string;
}

interface responseModel {
  data: newsItem[];
  message: string;
  statusCode: number;
  paging: {
    pageNum: number; // Thay đổi kiểu dữ liệu
    pageSize: number; // Thay đổi kiểu dữ liệu
    pageCount: number;
  };
}

export default function NewsPage() {
  const { data, isLoading } = useQuery<responseModel>({
    queryKey: ["news"],
    queryFn: () =>
      newsApiRequest.getNews({
        paging: {
          pageNum: 1,
          pageSize: 12,
        },
      }),
  });

  if (isLoading) {
    return <Loading />;
  }
  console.log("news data", data);
  return (
    <div>
      <ul className="grid grid-cols-1 xl:grid-cols-3 gap-y-10 gap-x-6 items-start p-8">
        {(Array.isArray(data?.data) && data.data.length > 0) || isLoading ? (
          data?.data.map((item) => (
            <li
              key={item.id}
              className="relative flex flex-col sm:flex-row xl:flex-col items-start"
            >
              <div className="mt-2 order-1 sm:ml-6 xl:ml-0">
                {/* <h3 className="mb-1 text-slate-900 font-semibold">
                  <span className="mb-1 block text-sm leading-6 text-indigo-500">
                    {item.author}
                  </span>
                </h3> */}
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  {item.title ||
                    "Completely unstyled, fully accessible UI components"}
                </h2>
                <div className="prose prose-slate prose-sm text-slate-600">
                  <p>
                    {item.content ||
                      "Completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS."}
                  </p>
                </div>
                <div className="mt-4">
                  <button className="group bg-tertiary cursor-pointer slide-anime px-5 py-3 rounded-full w-[180px] dark:bg-white bg-primary-base text-white dark:text-black flex justify-between items-center font-semibold ">
                    Tìm hiểu thêm{" "}
                    <div className="group-hover:translate-x-2 transition-all">
                      <ArrowRightOutlined />
                    </div>
                  </button>
                </div>
              </div>
              <div className="relative h-[200px] w-full overflow-hidden rounded-t-md">
                <Image
                  className={`transition-opacity rounded-t-md `}
                  src={item.image || "/assets/images/bg1.jpg"}
                  alt={item.title || "Hình ảnh tin tức"}
                  fill={true}
                  style={{ objectFit: 'cover' }}
                //   onError={(e) => {
                //     (e.target as HTMLImageElement).src = defaultImage;
                //   }}
                />
              </div>
            </li>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            Cửa hàng chưa có sản phẩm cho thuê.
          </div>
        )}
      </ul>
    </div>
  );
}
