"use client";
import authApiRequest from "@/src/apiRequests/auth";
import { notifyError, notifySuccess } from "@/src/components/Notification/Notification";
import { notification } from "antd";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

enum GenderEnum {
  female = "female",
  male = "male",
  other = "other",
}

interface IFormInput {
  username: string;
  password: string;
  email: string;
  confirmPassword: string;
  fullName: string;
}
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IFormInput>();

  const password = watch("password");
  const [api, contextHolder] = notification.useNotification();

  const onSubmit = async (data: IFormInput) => {
    const body = {
      username: data.username,
      password: data.password,
      email: data.email,
      fullName: data.fullName,
      dateOfBirth: "2025-05-21T07:52:16.443Z",
      phoneNumber: "123456789",
    };
    // console.log("thông tin đăng ký", body);
    
    try {
      const res = await authApiRequest.register(body);
      console.log("status", res);
      if (res.statusCode === "200") {
        notifySuccess(res.message);
        // console.log("Đăng ký thành công:", res.data);
      } if (res.statusCode === "404") {
         notifyError(res.message);
        // api.error({
        //   message: "Đăng ký thất bại",
        //   description: res.message,
        // });
      }
    } catch (error) {
      console.log("Lỗi đăng ký:", error);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      {contextHolder}
      <div className="bg-sky-100 pt-8 pb-32">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="xl:w-1/2 lg:w-3/4 md:w-4/5">
              <div className="bg-white p-10 md:p-6 rounded-md shadow-lg">
                <div className="text-center mb-5">
                  <h3 className="text-4xl font-bold text-gray-800">
                    Đăng kí tài khoản
                  </h3>
                  <p className="text-lg font-normal text-gray-700">
                    Bạn đã có tài khoản rồi ư?{" "}
                    <Link
                      legacyBehavior
                      href="/login"
                      className="font-semibold text-lg bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent"
                    >
                      Đăng nhập tại đây
                    </Link>
                  </p>
                </div>
                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-lg font-medium text-gray-800">
                        Tên người dùng *
                      </label>
                      <input
                        type="text"
                        placeholder="Hãy nhập tên của bạn"
                        className="w-full h-11 px-4 text-sm text-gray-600 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        {...register("fullName", { required: true })}
                      />
                      {errors.email && <span>This field is required</span>}
                    </div>

                    <div>
                      <label className="text-lg font-medium text-gray-800">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="Hãy nhập Email của bạn"
                        className="w-full h-11 px-4 text-sm text-gray-600 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        {...register("email", { required: true })}
                      />
                      {errors.email && <span>This field is required</span>}
                    </div>
                    <div>
                      <label className="text-lg font-medium text-gray-800">
                        Tài khoản *
                      </label>
                      <input
                        type="text"
                        placeholder="Hãy tạo một tên tài khoản"
                        className="w-full h-11 px-4 text-sm text-gray-600 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        {...register("username", { required: true })}
                      />
                      {errors.username && <span>This field is required</span>}
                    </div>
                    <div>
                      <label className="text-lg font-medium text-gray-800">
                        Tạo Mật khẩu *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Hãy tạo mật khẩu"
                          {...register("password", {
                            required: "Vui lòng nhập mật khẩu",
                          })}
                          className="w-full h-11 px-4 text-sm text-gray-600 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {showPassword ? (
                          <AiFillEye
                            className="absolute fill-black right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={togglePasswordVisibility}
                          />
                        ) : (
                          <AiFillEyeInvisible
                            className="absolute fill-black right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={togglePasswordVisibility}
                          />
                        )}
                        {errors.password && (
                          <p className="text-red-500 text-sm">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-lg font-medium text-gray-800">
                        Nhập lại mật khẩu *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Hãy nhập lại mật khẩu"
                          {...register("confirmPassword", {
                            required: "Vui lòng xác nhận mật khẩu",
                            validate: (value) =>
                              value === password ||
                              "Mật khẩu nhập lại không khớp",
                          })}
                          className="w-full h-11 px-4 text-sm text-gray-600 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {showConfirmPassword ? (
                          <AiFillEye
                            className="absolute fill-black right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={toggleConfirmPasswordVisibility}
                          />
                        ) : (
                          <AiFillEyeInvisible
                            className="absolute fill-black right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={toggleConfirmPasswordVisibility}
                          />
                        )}
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="agreement"
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <label
                        htmlFor="agreement"
                        className="text-sm font-medium text-gray-800"
                      >
                        Tôi đồng ý với{" "}
                        <Link href={"#"} className="text-blue-500">
                          điều khoản
                        </Link>{" "}
                        &amp;{" "}
                        <Link href={"#"} className="text-blue-500">
                          chính sách
                        </Link>
                      </label>
                    </div>
                  </div>
                  <button
                    className="mt-6 w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-300"
                    type="submit"
                  >
                    Tạo tài khoản
                  </button>
                </form>
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-700">
                    Bằng cách nhấp vào nút Tạo tài khoản, bạn đã đồng ý với{" "}
                    <Link href="#" className="text-blue-500 underline">
                      Điều khoản &amp; Điều kiện
                    </Link>{" "}
                    cùng với{" "}
                    <Link href="#" className="text-blue-500 underline">
                      Chính sách Bảo mật
                    </Link>{" "}
                    của BoGemStore
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
