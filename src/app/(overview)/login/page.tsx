import Link from "next/link";
import React from "react";

export default function LoginPage() {
  return (
    <div className="bg-sky-100 flex justify-center items-center ">
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="/assets/images/bg-login.jpg"
          alt="Placeholder Image"
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
        <form action="#" method="POST">
          <div className="mb-4 bg-sky-100">
            <label htmlFor="username" className="block text-gray-600">
              Tài Khoản
            </label>
            {/* nhap username */}
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-800">
              Mật Khẩu
            </label>
            {/* nhap password */}
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
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
            <Link href="#" className="hover:underline">
              Ai biểu đặt mật khẩu dài rồi quên?
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
