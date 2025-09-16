"use client";
import { Avatar, DatePicker, DatePickerProps, Modal } from "antd";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppContext } from "../app-provider";

import userApiRequest from "@/src/apiRequests/user";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

dayjs.extend(customParseFormat);
interface IFormInput {
  personID: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  image: string;
  gender: number;
  phoneNumber: string;
}

interface userProfile {
  personID: string;
  full_name: string;
  address: string;
  phone_number: string;
  email: string;
  gender: string;
  date_of_birth: string;
  image: string;
}

const dateFormat = "DD/MM/YYYY";

interface IFormInputAddress {
  name: string;
  phone: string;
  address: string;
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

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: errorsAddress },
  } = useForm<IFormInputAddress>();

  const onSubmitAddress: SubmitHandler<IFormInputAddress> = (data) => {
    console.log(data);
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const { data, isLoading } = useQuery<userProfile>({
    queryKey: ["userProfile", user?.token],
    queryFn: async () => {
      if (!user?.token) {
        throw new Error("User token is not available");
      }
      const res = await userApiRequest.getProfile(user?.token);
      // if (!res.ok) {
      //   throw new Error("Failed to fetch user profile");
      // }
      return res.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("User Profile Data:", data);

  // const { data, isLoading, isError, error } = useQuery<IFormInput>({
  //   queryKey: ["userProfile", user?.token],
  //   queryFn: async () => {
  //     const res = await userApiRequest.updateProfile(
  //       {
  //         personID: "",
  //         fullName: "",
  //         email: "",
  //         phoneNumber: "",
  //         dateOfBirth: "",
  //         image: "",
  //         gender: 1,
  //       },
  //       user?.token
  //     );
  //     return res;
  //   },
  // });

  // console.log(user);
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              👤 Thông tin cá nhân
            </h1>
            <p className="text-blue-100 text-sm">
              Cập nhật thông tin tài khoản của bạn
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row  gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col  lg:items-start">
                <div className="relative">
                  <Avatar
                    size={200}
                    src={data?.image}
                    className="border-4 border-blue-100 shadow-lg"
                  >
                    {data?.full_name?.[0]?.toUpperCase() || "U"}
                  </Avatar>
                  <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <EditOutlined className="text-sm" />
                  </button>
                </div>
                {/* <p className="text-gray-500 text-sm mt-3">
                  Nhấn để thay đổi ảnh
                </p> */}
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Họ và tên *
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      type="text"
                      defaultValue={data?.full_name}
                      {...register("fullName", { required: "Tên là bắt buộc" })}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <ExclamationCircleOutlined />
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Email *
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      defaultValue={data?.email}
                      {...register("email", {
                        required: "Email là bắt buộc",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email không hợp lệ",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <ExclamationCircleOutlined />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Giới tính *
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      {...register("gender", {
                        required: "Giới tính là bắt buộc",
                      })}
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Không xác định</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <ExclamationCircleOutlined />
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Số điện thoại *
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      defaultValue={data?.phone_number}
                      {...register("phoneNumber", {
                        required: "Số điện thoại là bắt buộc",
                      })}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <ExclamationCircleOutlined />
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Ngày sinh *
                    </label>
                    <DatePicker
                      onChange={onChange}
                      size="large"
                      className="w-full rounded-xl"
                      defaultValue={dayjs(data?.date_of_birth)}
                      format={dateFormat}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <ExclamationCircleOutlined />
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 
                         rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 
                         transition-all shadow-lg hover:shadow-xl"
                  >
                    💾 Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              📦 Địa chỉ giao hàng
            </h1>
            <p className="text-green-100 text-sm">
              Quản lý địa chỉ nhận hàng của bạn
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Địa chỉ giao hàng mặc định
                </h2>
                <p className="text-gray-500 text-sm">
                  Địa chỉ sẽ được sử dụng cho đơn hàng
                </p>
              </div>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold 
                     hover:bg-green-700 transition-all mt-4 sm:mt-0 flex items-center gap-2"
                onClick={() => showModal()}
              >
                <PlusOutlined />
                Thêm địa chỉ mới
              </button>
            </div>

            <div className="space-y-4">
              {data?.address ? (
                <div className="border-2 border-green-200 bg-green-50 rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          Mặc định
                        </span>
                        <span className="text-green-600">✓</span>
                      </div>
                      <p className="text-gray-700 font-medium">
                        {data.full_name}
                      </p>
                      <p className="text-gray-600">{data.phone_number}</p>
                      <p className="text-gray-800 mt-2">{data.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <EditOutlined />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors">
                        <DeleteOutlined />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                  <div className="text-4xl mb-4">🏠</div>
                  <p className="text-gray-500">
                    Bạn chưa có địa chỉ giao hàng nào
                  </p>
                  <p className="text-gray-400 text-sm">
                    Thêm địa chỉ để nhận hàng thuận tiện hơn
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <PlusOutlined />
              <span>Thêm địa chỉ mới</span>
            </div>
          }
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <form
            onSubmit={handleSubmitAddress(onSubmitAddress)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tên người nhận *
                </label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                  type="text"
                  defaultValue={data?.full_name}
                  {...registerAddress("name", { required: "Tên là bắt buộc" })}
                />
                {errorsAddress.name && (
                  <p className="text-red-500 text-sm">
                    {errorsAddress.name.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Điện thoại *
                </label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                  defaultValue={data?.phone_number}
                  {...registerAddress("phone", {
                    required: "Số điện thoại là bắt buộc",
                  })}
                />
                {errorsAddress.phone && (
                  <p className="text-red-500 text-sm">
                    {errorsAddress.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Địa chỉ *
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none"
                rows={3}
                {...registerAddress("address", {
                  required: "Địa chỉ là bắt buộc",
                })}
              />
              {errorsAddress.address && (
                <p className="text-red-500 text-sm">
                  {errorsAddress.address.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
              >
                Lưu địa chỉ
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
