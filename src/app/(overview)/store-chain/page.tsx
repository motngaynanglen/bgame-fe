"use client";
import Breadcrumb from "@/src/components/Breadcrumb/Breadcrumb";
import { useSelectedStore } from "@/src/hooks/useSelectStoreId";
import { useStores } from "@/src/hooks/useStores";
import { ClockCircleFilled, MailFilled, PhoneFilled } from "@ant-design/icons";
import { List, Space } from "antd";
import Link from "next/link";
import React from "react";

const data = Array.from({ length: 5 }).map((_, i) => ({
  href: "https://ant.design",
  title: `Cửa hàng số ${i + 1}`,

  description: "7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh 700000, Việt Nam",
  content:
    "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
}));

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default function StoreChain() {
  const { stores, isLoading, isError, error } = useStores();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Failed to load stores."}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb title="Danh sách cửa hàng" subtitle="của Board Game Impact" />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Store Image/Map Section */}
              <div className="relative h-48">
                <img
                  width="100%"
                  height="100%"
                  // src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.609941530484!2d${store.longitude}!3d${store.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1742293278218!5m2!1svi!2s`}
                  src="/assets/images/bg1.jpg"
                  loading="lazy"
                  // allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: "none" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Store Info Section */}
              <div className="p-6">
                {/* Store Name and Address */}
                <Link
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    store.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block mb-4"
                >
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {store.store_name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1 group-hover:text-blue-500 transition-colors">
                    📍 {store.address}
                  </p>
                </Link>

                {/* Contact Information */}
                <div className="space-y-3">
                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <PhoneFilled className="text-blue-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Điện thoại</p>
                      <a
                        href={`tel:${store.hotline}`}
                        className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                      >
                        {store.hotline}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <MailFilled className="text-green-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Email</p>
                      <a
                        href={`mailto:${store.email}`}
                        className="text-gray-900 font-medium hover:text-green-600 transition-colors"
                      >
                        {store.email}
                      </a>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <ClockCircleFilled className="text-orange-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Giờ mở cửa</p>
                      <p className="text-gray-900 font-medium">
                        8:00 - 22:00 (cả tuần)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <a
                    href={`tel:${store.hotline}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors text-center"
                  >
                    📞 Gọi ngay
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      store.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors text-center"
                  >
                    🗺️ Chỉ đường
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {stores.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có cửa hàng nào
            </h3>
            <p className="text-gray-500">
              Hệ thống đang cập nhật thông tin cửa hàng
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
