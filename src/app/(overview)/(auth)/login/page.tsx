"use client";

import authApiRequest from "@/src/apiRequests/auth";
import Link from "next/link";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAppContext } from "../../../app-provider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAppContext();
  const router = useRouter();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  interface LoginFormElements extends HTMLFormControlsCollection {
    username: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface LoginFormElement extends HTMLFormElement {
    readonly elements: LoginFormElements;
  }

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<LoginFormElement>) => {
    e.preventDefault();
    // console.log(e.currentTarget.elements.username.value);
    // console.log(e.currentTarget.elements.password.value);
    try {
      console.log(credentials);
      
      // LOGIN BẮT ĐẦU TỪ ĐÂY
      const result = await authApiRequest.login(credentials);
      console.log(result);
      const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();

      await authApiRequest.auth({
        sessionToken: result.data.jwt,
        sessionRole: result.data.role,
        expiresAt: expires,
      });
      setUser({
        id: result.data.name,
        name: result.data.name,
        role: result.data.role,
        token: result.data.jwt
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
        <img
          src="/assets/images/bg-login.jpg"
          alt="Placeholder img"
          className="object-cover w-full h-full"
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
        <form action="#" method="POST" onSubmit={handleSubmit}>
          <div className="mb-4 bg-sky-100">
            <label htmlFor="username" className="block text-gray-600">
              Tài Khoản
            </label>
            {/* nhap username */}
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 text-black-2"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-800">
              Mật Khẩu
            </label>
            {/* nhap password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 text-black-2"
                onChange={handleChange}
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
          <button
            type="submit"
            className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Đăng Nhập
          </button>
        </form>
        <div className="mt-6 text-green-500 text-center">
          <Link href="/register" className="hover:underline">
            Đăng kí tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
}
