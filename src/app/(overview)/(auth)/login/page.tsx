"use client";

import authApiRequest from "@/src/apiRequests/auth";
import Link from "next/link";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAppContext } from "../../../app-provider";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginBody, LoginBodyType } from "@/src/schemaValidations/auth.schema";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { Button, Form, Input } from "antd";
import Image from "next/image";
// import Image from "next/image";

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
  });
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAppContext();
  const router = useRouter();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (value: LoginBodyType) => {
    // e.preventDefault();
    // console.log(e.currentTarget.elements.username.value);
    // console.log(e.currentTarget.elements.password.value);
    try {
      console.log(value);

      // LOGIN BẮT ĐẦU TỪ ĐÂY
      const result = await authApiRequest.login(value);
      console.log(result);
      const expires = new Date(Date.now() + 6 * 60 * 60 * 1000).toUTCString();

      await authApiRequest.auth({
        sessionToken: result.data.jwt,
        sessionRole: result.data.role,
        expiresAt: expires,
      });
      setUser({
        id: result.data.name,
        name: result.data.name,
        role: result.data.role,
        token: result.data.jwt,
        expiresAt: expires, // <-- thêm dòng này để lưu expiresAt
      });
      router.push("/");
      router.refresh();
      // KẾT THÚC SAU KHI SET COOKIE
      // const response = await axios.post(
      //   "/api/Login/login",
      //   credentials
      // );
      // const { jwt, refreshToken } = response.data;

      // console.log("data nè: ", response.data);
      // console.log(JSON.stringify(response.data.data));
      // console.log("token nè: ", jwt);
      // // Store the tokens in localStorage or secure cookie for later use
      // localStorage.setItem("token", jwt);
      // localStorage.setItem("refreshToken", refreshToken);

      // await axios.get("/api/Login/GetUser", {});
    } catch (error) {
      console.log("lỗi nè: ", error);
    }
  };
  return (
    <div className="bg-sky-100 flex justify-center items-center ">
      <div className="w-1/2 h-screen hidden lg:block">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          src="/assets/images/bg-login.jpg"
          alt="Placeholder img"
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <div className="mb-6 text-6xl font-semibold text-center text-green-900">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            BoGemStore
          </span>
        </div>
        {/* <h1 className="text-2xl font-semibold mb-4 text-green-900">Login</h1> */}
        <Form onFinish={handleSubmit(onSubmit)}>
          <div className="mb-4 bg-sky-100">
            <label htmlFor="username" className="block text-gray-600">
              Tài Khoản
            </label>
            {/* nhap username */}
            <FormItem
              control={control}
              name="username"
              label=""
              className="w-full border rounded-md focus:outline-none focus:border-blue-500 text-black-2"
            >
              <Input required type="text" />
            </FormItem>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-800">
              Mật Khẩu
            </label>
            {/* nhap password */}
            <div className="relative">
              <FormItem
                control={control}
                name="password"
                label=""
                className="w-full border rounded-md focus:outline-none focus:border-blue-500 text-black-2"
              >
                <Input required type={showPassword ? "text" : "password"} />
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
              </FormItem>
            </div>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="text-red-500"
            />
            <label htmlFor="remember" className="text-green-900 ml-2">
              Remember Me
            </label>
          </div>
          <div className="mb-6 text-blue-500">
            {/* forgot password */}
            <Link href="/forgot-password" className="hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <Form.Item>
            <Button
              className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-5 px-4 w-full"
              htmlType="submit"
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
        <div className="mt-6 text-green-500 text-center">
          <Link href="/register" className="hover:underline">
            Đăng kí tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
}
