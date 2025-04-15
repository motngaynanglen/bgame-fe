"use client";
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
    <div className="container min-h-screen mx-auto max-w-screen-xl">
      <List
        itemLayout="vertical"
        size="large"
        dataSource={stores}
        renderItem={(store) => (
          <List.Item
            key={store.id}
            extra={
              <iframe
                width="100%"
                height="100%"
                // src={`https://www.google.com/maps/place/search?q=${encodeURIComponent(
                //   store.address
                // )}&key=YOUR_GOOGLE_MAPS_API_KEY`} // Thay YOUR_GOOGLE_MAPS_API_KEY
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.609941530484!2d${store.longitude}!3d${store.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1742293278218!5m2!1svi!2s`}
                loading="lazy"
                allowFullScreen
              ></iframe>
            }
          >
            <List.Item.Meta
              title={
                <Link
                  href={"https://maps.app.goo.gl/zMYvU3sV4LiMevgr5"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h1 className="text-2xl text-gray-800">
                    {store.store_name} - {store.address}
                  </h1>
                </Link>
              }
              description={
                <>
                  <div>
                    <h1 className="text-xl">
                      <PhoneFilled /> Số điện thoại: {store.hotline}
                    </h1>
                    <h1 className="text-xl">
                      <MailFilled /> Email: {store.email}
                    </h1>
                    <h1 className="text-xl">
                      <ClockCircleFilled /> Mở cửa: 8:00 - 22:00 (cả tuần)
                    </h1>
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}
