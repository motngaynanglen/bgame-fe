"use client";
import consignmentApiRequest from "@/src/apiRequests/consignment";
import { useAppContext } from "@/src/app/app-provider";
import {
  notifyError,
  notifySuccess,
} from "@/src/components/Notification/Notification";
import { HttpError } from "@/src/lib/httpAxios";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";

import { useForm } from "react-hook-form";

const url = {
  home: "/admin",
  list: "/admin/users",
  create: "/admin/users/create",
};
const breadcrumb: BreadcrumbItemType[] = [
  {
    href: url.home,
    title: <HomeOutlined />,
  },
  {
    href: url.list,
    title: (
      <>
        <UserOutlined />
        <span>Danh sách sản phẩm</span>
      </>
    ),
  },
  {
    title: "Nhập BoardGame",
  },
];

interface IFormInput {
  name: string;
  phone: string;
  email: string;
  productName: string;
  description: string;
  condition: number;
  missing: string;
  expectedPrice: number;
  salePrice: number;
  image: [];
}

export default function Add() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const { user } = useAppContext();

  const onSubmit = async (data: IFormInput) => {
    const customerID = null;
    const body = {
      customerID,
      customerName: data.name,
      customerPhone: data.phone,
      customerEmail: data.email,
      productName: data.productName,
      description: data.description,
      condition: data.condition,
      missing: data.missing,
      expectedPrice: data.expectedPrice,
      salePrice: data.salePrice,
      image: data.image,
    };
    console.log("thông tin Sản phẩm :", body);

    try {
      const res = await consignmentApiRequest.createConsignment(
        body,
        user?.token
      );
      console.log("Đơn hàng đã được tạo:", body);
      if (res.statusCode == "200") {
        notifySuccess("Tạo sản phẩm ký gửi thành công!");
      } else
        notifyError(
          "Tạo sản phẩm thất bại!",
          res.message || "Vui lòng thử lại sau."
        );
    } catch (error: any) {
      if (error instanceof HttpError && error.status === 401) {
        notifyError("Đặt sản phẩm thất bại!", "bạn cần đăng nhập để tiếp tục");
        // router.push("/login");
      } else {
        // Xử lý lỗi khác nếu có
        console.error("Lỗi khác:", error);
        notifyError(
          "Đặt trước thất bại",
          "Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại sau."
        );
      }
    }
  };

  return (
    <>
      <Breadcrumb items={breadcrumb} />
      <div className="max-w-4xl mt-5 mx-auto p-6 bg-white shadow rounded-md text-sm text-gray-800">
        <h1 className="text-xl font-semibold mb-4">
          Đơn Đăng Ký Ký Gửi Sản Phẩm
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Tên người bán*</label>
              <input
                type="text"
                className="w-full mt-1 border rounded p-2"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-red-600">
                  Tên người bán không để trống
                </span>
              )}
            </div>
            <div>
              <label>Consignor #</label>
              <input type="text" className="w-full mt-1 border rounded p-2" />
            </div>
            <div>
              <label>Số điện thoại*</label>
              <input
                type="text"
                className="w-full mt-1 border rounded p-2 "
                {...register("phone", { required: true })}
              />
            </div>
            <div>
              <label>Email*</label>
              <input
                type="email"
                className="w-full mt-1 border rounded p-2"
                {...register("email", { required: true })}
              />
            </div>
            <div className="md:col-span-2">
              <label>Tên sản phẩm*</label>
              <input
                type="text"
                className="w-full mt-1 border rounded p-2"
                {...register("productName", { required: true })}
              />
            </div>
            <div className="md:col-span-2">
              <label>Giá mong muốn (Vnd)*</label>
              <input
                type="number"
                className="w-full mt-1 border rounded p-2"
                {...register("salePrice", { required: true })}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold">
              Tình trạng chung của các thành phần của sản phẩm*:
            </label>
            <div className="space-y-1 mt-2">
              {[
                "New in Shrink - Lớp bọc ngoài/niêm phong ban đầu còn nguyên vẹn. Chưa bao giờ mở.",
                "Như mới - Đã khui seal, những lá bài thành phần chưa khui, chưa bao giờ chơi.",
                "Rất tốt - Đã khui seal, các token, lá bài. Hầu như hoặc chưa bao giờ được chơi. Không có dấu hiệu hao mòn rõ rệt.",
                "Tốt - Đã chơi nhưng được bảo quản tốt. Hộp/sách hướng dẫn có dấu hiệu đã qua sử dụng.",
                "Khá - Có dấu hiệu hao mòn có thể nhận thấy. Hộp/sách hướng dẫn có hư hỏng nhẹ và/hoặc bị đánh dấu nhẹ.",
                "Kém - Đã cũ nhưng vẫn chơi được. Hộp/sách hướng dẫn có hư hỏng và/hoặc đã bị đánh dấu đáng kể.",
              ].map((text, i) => (
                <label key={i} className="flex items-start gap-2">
                  <input
                    value={i}
                    type="radio"
                    className="mt-1"
                    {...register("condition", { required: true })}
                  />
                  <span>{text}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold">Các thành phần bị thiếu*:</label>
            <div className="space-y-1 mt-2">
              {/* {[
                "Tôi đã kiểm kê các thành phần và không thiếu cái nào.",
                "Tôi đã kiểm kê các thành phần và thiếu một số cái.",
              ].map((text, i) => (
                <label key={i} className="flex items-start gap-2">
                  <input
                    type="radio"
                    className="mt-1"
                    {...register("missing", { required: true })}
                  />
                  <span>{text}</span>
                </label>
              ))} */}
              <div>
                <label className="block">
                  Liệt kê các thành phần bị thiếu:
                </label>
                <input
                  type="text"
                  className="w-full mt-1 border rounded p-2"
                  {...register("missing")}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold">Mô tả thêm về sản phẩm:</label>
            <textarea
              rows={3}
              className="w-full mt-1 border rounded p-2"
              {...register("description")}
            ></textarea>
          </div>
          {/* <div>
            <label className="font-semibold">Hình ảnh sản phẩm:</label>
            <input
              type="file"
              accept="image/*"
              className="w-full mt-1 border rounded p-2"
              {...register("image")}
            />
          </div> */}
          <div className="mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Tạo đơn 
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
