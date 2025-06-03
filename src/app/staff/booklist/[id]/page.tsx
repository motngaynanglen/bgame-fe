"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { useAppContext } from "@/src/app/app-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface BooklistDetail {
  id: string;
  code: string;
  status: "ACTIVE" | "ENDED";
  created_at: string;
  total_price: number;
  book_items: Array<{
    book_item_id: string;
    template_product_name: string;
    template_image: string;
    template_price: number;
    template_rent_price: number;
    template_description?: string;
    book_item_status: "ACTIVE" | "INACTIVE";
    product_id: string;
  }>;
}

export default function page() {
  const { id } = useParams();
  const { user } = useAppContext();

  const { data, isLoading } = useQuery<BooklistDetail>({
    queryKey: ["bookListDetail", id],
    queryFn: async () => {
      const res = await bookListApiRequest.getBookListById(
        {
          bookListId: id,
        },
        user?.token
      );
      // if (!res.ok) {
      //   throw new Error("Network response was not ok");
      // }
      return res.data;
    },
    enabled: !!user?.token && !!id, // Chỉ fetch khi có token và id
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Không tự động refetch
    retry: 1, // Số lần retry khi fail
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({
      bookItemId,
      code,
    }: {
      bookItemId: string;
      code: string;
    }) => {
      const res = await bookListApiRequest.updateBookItemProduct(
        {
          bookItemId,
          code,
        },
        user?.token
      );  
      return res;
    },
  });

  console.log("data", data);

  // if (!data) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <p className="text-red-500 text-xl">Không tìm thấy đơn hàng</p>
  //     </div>
  //   );
  // }

  // Hàm định dạng ngày tháng
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">
                Chi tiết đơn thuê #{data?.id.slice(0, 8)}
              </h1>
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    data?.status === "ENDED"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {data?.status === "ENDED" ? "Đã kết thúc" : "Đang hoạt động"}
                </span>
                <p className="text-gray-600 text-sm">
                  Ngày tạo: {formatDate(data?.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Thông tin tổng quan */}
          <div className="px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ">
              {/* <div className="mt-3 space-y-2"> */}
              <p>
                <span className="font-medium text-xl text-gray-600">
                  Mã đơn hàng:
                </span>{" "}
                <span className="text-gray-800">{data?.code}</span>
              </p>
              <p>
                <span className="font-medium text-xl text-gray-600">
                  Tổng giá thuê:
                </span>{" "}
                <span className="text-xl text-gray-800">
                  {formatCurrency(data?.total_price ?? 0)}
                </span>
              </p>
              {/* </div> */}
            </div>
            {/* Chỗ này có thể thêm thông tin bổ sung nếu cần */}
          </div>

          {/* Danh sách sản phẩm */}
          <div className="px-8 py-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Sản phẩm đã thuê
            </h2>
            <div className="space-y-6">
              {data?.book_items.map((item) => (
                <div
                  key={item.book_item_id}
                  className="flex flex-col md:flex-row bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Hình ảnh */}
                  <div className="md:w-1/3 h-48">
                    <img
                      src={item.template_image.split("||")[0]}
                      alt={item.template_product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Thông tin chi tiết */}
                  <div className="md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {item.template_product_name}
                      </h3>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <div className="space-y-1">
                          <p>
                            <span className="font-medium text-lg">
                              Giá gốc:
                            </span>{" "}
                            <span className="text-gray-800 text-lg">
                              {formatCurrency(item.template_price)}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium text-lg">
                              Giá thuê:
                            </span>{" "}
                            <span className="text-gray-800 text-lg">
                              {formatCurrency(item.template_rent_price)}
                            </span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="flex items-center">
                            <span className="font-medium text-lg">
                              Trạng thái:
                            </span>
                            <span
                              className={`ml-2 px-2 py-1 text-lg rounded-full ${
                                item.book_item_status === "ACTIVE"
                                  ? "bg-green-100 text-green-800 text-lg"
                                  : "bg-gray-200 text-gray-700 text-lg"
                              }`}
                            >
                              {item.book_item_status === "ACTIVE"
                                ? "Hoạt động"
                                : "Ngừng hoạt động"}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium text-lg">
                              ID sản phẩm:
                            </span>{" "}
                            <span className="text-gray-800 text-lg">
                              {item.product_id.slice(0, 8)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {item.template_description && (
                      <div className="mt-4 text-gray-600">
                        <h4 className="font-medium text-gray-700">Mô tả:</h4>
                        <p className="mt-1">{item.template_description}</p>
                      </div>
                    )}
                    {data.status !== "ENDED" && (
                      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <input
                          type="text"
                          className="p-2 w-auto"
                          placeholder="Nhập mã code"
                          // value={codesByItem[item.order_item_id] || ""}
                          // onChange={(e) =>
                          //   handleCodeChange(item.order_item_id, e.target.value)
                          // }
                          // onBlur={() => handleUpdateItem(item.order_item_id)}
                        />
                        <button
                          onClick={() => {
                            // Xử lý sự kiện khi nhấn nút "Xem chi tiết"
                            console.log(
                              "Xem chi tiết sản phẩm",
                              item.book_item_id
                            );
                          }}
                          className="px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Cập nhật
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-100 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => window.history.back()}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
