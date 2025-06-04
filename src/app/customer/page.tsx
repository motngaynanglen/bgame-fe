"use client";
import { DatePicker, DatePickerProps, Modal } from "antd";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Avatar from "../../components/Customer/Avatar";
import { useAppContext } from "../app-provider";

import userApiRequest from "@/src/apiRequests/user";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

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
    <div className=" flex flex-col items-center ">
      <div className="w-full bg-white pt-2 p-6 rounded-lg shadow-md ">
        <h1 className="text-2xl font-semibold mb-4 text-black-2">
          Thông tin cá nhân
        </h1>
        <div className="flex justify-around">
          <div className="">
            <Avatar />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700">Tên</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2"
                  type="text"
                  defaultValue={data?.full_name}
                  {...register("fullName", { required: "Tên là bắt buộc" })}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2"
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
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700">Giới tính</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2.5 mt-1 text-black-2"
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
                  defaultValue={data?.phone_number}
                  {...register("phoneNumber", {
                    required: "số điện thoại là bắt buộc",
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Ngày sinh</label>
                {/* <input
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2"
                  defaultValue={data?.date_of_birth}
                  {...register("dateOfBirth", {
                    required: "Ngày sinh là bắt buộc",
                  })}
                /> */}
                <DatePicker
                  onChange={onChange}
                  size="large"
                  defaultValue={dayjs(data?.date_of_birth)}
                  format={dateFormat}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm">
                    {errors.dateOfBirth.message}
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
            </div>
            <div className="flex justify-end mt-6">
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
      <div className="w-full bg-white pt-2 p-6 rounded-lg shadow-md mt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold mb-4 text-black-2">
            Địa chỉ giao hàng của bạn
          </h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            onClick={() => showModal()}
          >
            Thêm địa chỉ mới{" "}
          </button>
        </div>

        <div className="flex flex-col space-y-4">
          {data?.address ? (
            <div className="border p-4 rounded">
              <p className="text-gray-700">Tên: {data?.full_name}</p>
              <p className="text-gray-700">Điện thoại: {data?.phone_number}</p>
              <p className="text-gray-700">Địa chỉ: {data?.address}</p>
            </div>
          ) : (
            <p className="text-gray-500">Bạn chưa có địa chỉ giao hàng nào.</p>
          )}
        </div>
      </div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmitAddress(onSubmitAddress)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700">Tên người nhận</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2"
                type="text"
                defaultValue={data?.full_name}
                {...register("fullName", { required: "Tên là bắt buộc" })}
              />
              {errorsAddress.name && (
                <p className="text-red-500 text-sm">
                  {errorsAddress.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Điện thoại</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2"
                defaultValue={data?.phone_number}
              />
              {errorsAddress.phone && (
                <p className="text-red-500 text-sm">
                  {errorsAddress.phone.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Địa chỉ</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2"
              defaultValue=""
            />
            {errorsAddress.address && (
              <p className="text-red-500 text-sm">
                {errorsAddress.address.message}
              </p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}
