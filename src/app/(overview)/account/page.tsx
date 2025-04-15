'use client';
import React from "react";
import { useAppContext } from "../../app-provider";
import Image from "next/image";
// cai page nay k phai la page chinh cua app
// cai nay la page cua account fake
export default function AccountInformation() {
  const user = useAppContext().user;
  console.log(user)
  return (
    <div className="min-h-screen flex flex-col items-center bg-sky-50">
      <div className="w-full max-w-4xl bg-white mt-6 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-black-2">Thông tin cá nhân</h1>
        <div className="flex items-center mb-6">
          <Image
            alt="User avatar"
            className="w-24 h-24 rounded-full mr-4"
            height="50"
            src="https://storage.googleapis.com/a1aa/image/unsNjiOyD5Ylj2cj_LdnUyUwRWFzVkbzM_z-ZX1ywVs.jpg"
            width="50"
            loading="lazy"
          />
          <div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
              Cập nhật ảnh đại diện
            </button>
            {/* <button className="bg-gray-300 text-black px-4 py-2 rounded">
              Remove
            </button> */}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Tên</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2"
              type="text"
              value="Sẽ thêm vào sau"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2">
              <option>fpt@.edu.vn</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Ngày sinh</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2">
              <option>DD/MM/YYYY</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Địa chỉ</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2">
              <option>Đường nào đó ở phố nào đó</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Giới tính</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black-2">
              <option>Nam</option>
              <option>Nữ</option>
              <option>Không xác định</option>
            </select>
            {/* <p className="text-gray-500 text-sm mt-1">Current Time: 22:37</p> */}
          </div>
          <div>
            <label className="block text-gray-700">Country</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 mt-1">
              <option>Indonesia</option>
            </select>
          </div>
          {/* <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700">Welcome Message</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              rows={3}
            >
              Welcome to my scheduling page. Please follow the instruction to
              add an event calendar
            </textarea>
          </div> */}
        </div>
        <div className="flex justify-between mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Change
          </button>
          <button className="bg-gray-300 text-black px-4 py-2 rounded">
            Cancel
          </button>
          {/* <button className="bg-red-500 text-white px-4 py-2 rounded">
            Delete Account
          </button> */}
        </div>
      </div>
    </div>
  );
}
