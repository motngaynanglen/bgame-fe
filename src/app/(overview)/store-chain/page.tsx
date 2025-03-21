"use client";
import React from "react";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, List, Space } from "antd";
import Link from "next/link";
import { useStoreStore } from "@/src/store/shopStore";

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
  const { stores } = useStoreStore();
  // const getGoogleMapsUrl = (address: string) => {
  //   const encodedAddress = encodeURIComponent(address);
  //   return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  // };

  return (
    <div className="py-6">
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
          position: "bottom",
          align: "center",
        }}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.609941530484!2d106.80730807451786!3d10.841132857997911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1742293278218!5m2!1svi!2s"
                loading="lazy"
                allowFullScreen
              ></iframe>
            }
          >
            <List.Item.Meta
              title={<h1>{store.store_name}</h1>}
              description={
                <Link
                  href={"https://maps.app.goo.gl/zMYvU3sV4LiMevgr5"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h1>{store.address}</h1>
                </Link>
              }
            />
            {
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,"
            }
          </List.Item>
        )}
      />
    </div>
  );
}
