"use client";
import { Avatar, DatePicker, DatePickerProps, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppContext } from "../app-provider";

import userApiRequest from "@/src/apiRequests/user";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  fullName: string;
  email: string;
  dateOfBirth: Date;
  image: string;
  gender: number;
  phoneNumber: string;
}

interface userProfile {
  full_name: string;
  address: IFormOutputAddress[];
  phone_number: string;
  email: string;
  gender: number;
  date_of_birth: Date;
  image: string;
}

const dateFormat = "DD/MM/YYYY";

interface IFormInputAddress {
  name: string;
  phoneNumber: string;
  address: string;
}
interface IFormOutputAddress {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
}
interface UploadResponse {
  imageUrl: string;
}

export default function ProfilePage() {
  const user = useAppContext().user;

  const [editingAddress, setEditingAddress] = useState<IFormOutputAddress | null>(null); // State để theo dõi địa chỉ đang sửa
  const [tempAddresses, setTempAddresses] = useState<IFormOutputAddress[]>([]);

  const [uploaded, setUploaded] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>();

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: errorsAddress },
    reset: resetAddressForm,
    setValue: setAddressValue,
  } = useForm<IFormInputAddress>();

  const [isModalOpen, setIsModalOpen] = useState(false);



  const handleOk = () => {
    setIsModalOpen(false);
  };
  //  const showModal = () => {
  //   setIsModalOpen(true);
  // };
  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setValue('dateOfBirth', date.toDate());
  };

  const { data, isLoading, refetch: refetchProfile } = useQuery<userProfile>({
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
  useEffect(() => {
    if (data?.address) {
      const addressesWithId = data.address.map((addr, index) => ({
        ...addr,
        id: Date.now() + index,
      }));
      setTempAddresses(addressesWithId);
    }
  }, [data]);
  const updateProfileMutation = useMutation({
    mutationFn: (formData: IFormInput) => {
      const rawGender = formData.gender ?? (data?.gender ?? 0);
      const numericGender = Number(rawGender);

      const body: IFormInput = {
        phoneNumber: formData.phoneNumber ?? data?.phone_number,
        email: formData.email ?? data?.email,
        fullName: formData.fullName ?? data?.full_name,
        dateOfBirth: formData.dateOfBirth ?? data?.date_of_birth,
        image: formData.image ?? data?.image,
        gender: numericGender

      };
      return userApiRequest.updateProfile(body, user?.token);
    },
    onSuccess: () => {
      message.success("Cập nhật profile thành công!");
      refetchProfile(); // Tải lại profile để cập nhật dữ liệu gốc
    },
    onError: (error) => {
      message.error("Cập nhật profile thất bại!",8);
    },
  });
  const updateAddressMutation = useMutation({
    mutationFn: (newAddressList: IFormOutputAddress[]) => {
      // Thực hiện API cập nhật profile, chỉ gửi danh sách địa chỉ mới
      const body = {
        address: newAddressList
      }
      return userApiRequest.updateAddress(body, user?.token);
    },
    onSuccess: () => {
      message.success("Cập nhật địa chỉ thành công!");
      refetchProfile(); // Tải lại profile để cập nhật dữ liệu gốc
    },
    onError: (error) => {
      console.error("Lỗi cập nhật địa chỉ:", error);
      message.error("Cập nhật địa chỉ thất bại!",8);
    },
  });
  const onSubmitAddress: SubmitHandler<IFormInputAddress> = (formData) => {
    if (editingAddress) {
      // Chế độ SỬA
      setTempAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? { ...addr, ...formData }
            : addr
        )
      );
    } else {
      // Chế độ THÊM MỚI

      const newAddress: IFormOutputAddress = {
        ...formData,
        id: Date.now(), // Tạo ID tạm thời
        // is_default: false, // Thêm logic mặc định nếu cần
      };
      setTempAddresses((prev) => [...prev, newAddress]);

    }

    handleCancel();
  };

  const handleEdit = (address: IFormOutputAddress) => {
    setEditingAddress(address);
    setAddressValue("name", address.name);
    setAddressValue("phoneNumber", address.phoneNumber);
    setAddressValue("address", address.address);
    setIsModalOpen(true);
  };
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn xóa địa chỉ này? Việc này sẽ được lưu sau khi bạn cập nhật.",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        setTempAddresses((prev) => prev.filter((addr) => addr.id !== id));
      },
    });
  };
  // --- CÁC HANDLER KHÁC ---
  const showModal = () => {
    if (tempAddresses.length > 2) {
      message.warning(<>Số địa chỉ tối đa là <span className="text-warning font-bold">3</span>. Vui lòng xóa bớt nếu muốn thêm...</>, 5);
    } else {
      setEditingAddress(null);
      resetAddressForm();
      setIsModalOpen(true);
    }
  };

  const handleCancel = () => {
    setEditingAddress(null);
    resetAddressForm();
    setIsModalOpen(false);
  };
  const onSubmit: SubmitHandler<IFormInput> = (formData) => {
    updateProfileMutation.mutate(formData)
    updateAddressMutation.mutate(tempAddresses);
  };
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
  const createMapSearchUrl = (address: string) => {
    if (!address) return '#';
    // Dùng encodeURIComponent để mã hóa chuỗi địa chỉ
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
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
                      <option value="1">Nam</option>
                      <option value="2">Nữ</option>
                      <option value="0">Không xác định</option>
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
              <span className="text-xs font-thin float-right"> Hãy chắc chắn bạn nhập đúng địa chỉ giao hàng!</span>
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

              {tempAddresses.length > 0 ? (
                tempAddresses.map((fields) => (
                  <div
                    key={fields.id} // Dùng ID tạm thời để React theo dõi
                    className="border border-green-300 bg-white shadow-sm rounded-lg p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        {/* Hàng 1: Tên người nhận */}
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-gray-900 font-bold text-base">
                            Tên người nhận:
                          </p>
                          <span>{fields.name}</span>
                        </div>

                        {/* Hàng 2: Số điện thoại */}
                        <div className="flex items-center text-gray-700">
                          <span className="font-semibold w-30 text-sm text-gray-500">
                            Số điện thoại:
                          </span>
                          <span className="text-sm">{fields.phoneNumber}</span>
                        </div>

                        {/* Hàng 3: Chi tiết địa chỉ + Xem bản đồ */}
                        <div className="flex items-start text-gray-800">
                          <span className="font-semibold w-20 text-sm text-gray-500 mt-0.5">
                            Địa chỉ:
                          </span>
                          <p className="text-sm leading-relaxed flex-1 flex items-center justify-between">
                            <span>{fields.address}</span>

                            <a
                              href={createMapSearchUrl(fields.address)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Xem trên Google Maps"
                              className="text-blue-500 hover:text-blue-700 transition-colors ml-3 flex items-center text-xs font-medium"
                            >
                              <span className="mr-1">🗺️</span>
                              Xem Bản đồ
                            </a>
                          </p>
                        </div>
                      </div>

                      {/* Cột thao tác: Edit/Delete */}
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          title="Chỉnh sửa"
                          onClick={() => handleEdit(fields)} // Gọi hàm sửa
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50"
                        >
                          <EditOutlined style={{ fontSize: "18px" }} />
                        </button>
                        <button
                          title="Xóa"
                          onClick={() => fields.id && handleDelete(fields.id)} // Gọi hàm xóa
                          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-50"
                        >
                          <DeleteOutlined style={{ fontSize: "18px" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <div className="text-4xl mb-4">🏠</div>
                  <p className="text-gray-600 font-medium mb-1">
                    Bạn chưa có địa chỉ giao hàng nào
                  </p>
                  <p className="text-gray-400 text-sm">
                    Thêm địa chỉ để nhận hàng thuận tiện hơn.
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
              {editingAddress ? <EditOutlined /> : <PlusOutlined />}
              <span>{editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</span>
            </div>
          }
          open={isModalOpen}
          onOk={handleSubmitAddress(onSubmitAddress)} // Dùng handleSubmitAddress cho onOk
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
                  // Bỏ defaultValue để dùng reset/setValue của form hook
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
                  // Bỏ defaultValue
                  {...registerAddress("phoneNumber", {
                    required: "Số điện thoại là bắt buộc",
                  })}
                />
                {errorsAddress.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {errorsAddress.phoneNumber.message}
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
                {editingAddress ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
