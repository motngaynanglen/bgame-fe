"use client";
import React, { useState } from "react";
import { useAppContext } from "../app-provider";
import { CldUploadButton, CldUploadWidget } from "next-cloudinary";
import { SubmitHandler, useForm } from "react-hook-form";
import Avatar from "../../components/Customer/Avatar";
interface IFormInput {
  name: string;
  email: string;
  birthDate: string;
  address: string;
  gender: string;
  phone: string;
}

interface UploadResponse {
  imageUrl: string;
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSubmit = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    console.log("File selected:", file);

    // Tạo FormData và đảm bảo key là 'file'
    const formData = new FormData();
    formData.append("file", file); // API yêu cầu key là 'file'

    try {
      const response = await fetch("http://14.225.207.72/api/upload/image", {
        method: "POST",
        body: formData,
        headers: {
          // Không đặt Content-Type ở đây, để trình duyệt tự thêm boundary
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  console.log(user);
  return (
    <div className=" flex flex-col items-center bg-sky-50">
      <div className="w-full max-w-4xl bg-white pt-2 p-6 rounded-lg shadow-md ">
        <h1 className="text-2xl font-semibold mb-4 text-black-2">
          Thông tin cá nhân
        </h1>
        <div className="flex justify-around">
          <div className="">
            <Avatar />
            {/* <div>
              <input type="file" onChange={handleFileSubmit} />
              {selectedFile && <p>Ảnh đã chọn: {selectedFile.name}</p>}
            </div> */}
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  <p className="text-red-500 text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Số điện thoại</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2 "
                  defaultValue="0969696969"
                  {...register("phone", {
                    required: "số điện thoại là bắt buộc",
                  })}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>
              {/* <div>
                <label className="block text-gray-700">Địa chỉ</label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2 row-2"
                  defaultValue="123 Điện Biên Phủ, Quận 1, TP.HCM"
                  {...register("address", { required: "Địa chỉ là bắt buộc" })}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div> */}
              <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Lưu thay đổi
              </button>
            </div>
            </div>
            {/* <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Lưu thay đổi
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}
