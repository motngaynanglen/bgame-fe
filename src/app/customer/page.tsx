"use client";
import React, { useState } from "react";
import { useAppContext } from "../app-provider";
import { CldUploadButton, CldUploadWidget } from "next-cloudinary";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  name: string;
  email: string;
  birthDate: string;
  address: string;
  gender: string;
}
export default function ProfilePage() {
  const user = useAppContext().user;

  const [uploaded, setUploaded] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  const handleUploadSuccess = (result: any, widget: any) => {
    const imageUrl = result.info.secure_url; // Lấy URL của ảnh
    console.log("URL ảnh:", imageUrl);
    // setUploaded(true);
    // widget.close(); // Đóng widget sau khi tải lên thành công
  };

  console.log(user);
  return (
    <div className=" flex flex-col items-center bg-sky-50">
      <div className="w-full max-w-4xl bg-white mt-2 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-black-2">
          Thông tin cá nhân
        </h1>
        <div className="flex items-center mb-6">
          <img
            alt="User avatar"
            className="w-24 h-24 rounded-full mr-4"
            height="50"
            src="/assets/images/tqs.jpg"
            width="50"
          />
          <div>
            <CldUploadWidget
              // uploadPreset="BoardgameImpact"
              // onSuccess={handleUploadSuccess}
              signatureEndpoint="/api/sign-cloudinary-params"
              options={{ sources: ["local", "url"] }}
              // onQueuesEnd={(result, { widget }) => {
              //   widget.close();
              // }}
            >
              {({ open }: { open: () => void }) => (
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                  onClick={() => open()}
                  // disabled={uploaded}
                >
                  Cập nhật ảnh đại diện
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Tên</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2"
                type="text"
                defaultValue={user?.name}
                {...register("name", { required: "Tên là bắt buộc" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2"
                defaultValue="email@pbt.edu"
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Ngày sinh</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2"
                defaultValue="11/2/2000"
                {...register("birthDate", {
                  required: "Ngày sinh là bắt buộc",
                })}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-sm">
                  {errors.birthDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Địa chỉ</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2"
                defaultValue="123 Điện Biên Phủ, Quận 1, TP.HCM"
                {...register("address", { required: "Địa chỉ là bắt buộc" })}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Giới tính</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2"
                {...register("gender", { required: "Giới tính là bắt buộc" })}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Không xác định</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
