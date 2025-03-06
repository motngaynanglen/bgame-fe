import React from "react";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-sky-100">
      <div className="flex justify-center pt-10">
        <div className="xl:w-1/2 lg:w-3/4 md:w-4/5">
          <div className="bg-white p-10 rounded-md shadow lg">
            <div className="text-center mb-5">
              <h3 className="text-4xl font-bold text-gray-800">
                Board Game Impact
              </h3>
            </div>
            <div className="text-center mb-5">
              <p className="text-lg font-normal text-gray-700">
                Quên mật khẩu của bạn? Hãy nhập email của bạn và chúng tôi sẽ
                gửi cho bạn một liên kết để đặt lại mật khẩu
              </p>
            </div>
            <form>
              <div>
                <label className="text-lg font-medium text-gray-800">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Nhập email của bạn ở đây"
                  className="w-full h-11 px-4 text-sm text-gray-600 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button
                className="mt-6 w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-300"
                type="submit"
              >
                Yêu cầu đặt lại mật khẩu
              </button>
            </form>
          </div>
        </div>
      </div>
      <h1>Board Game Impact</h1>
    </div>
  );
}
