"use client";
import React from "react";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, List, Space } from "antd";
import Link from "next/link";

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

export default function page() {
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
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            key={item.title}
            extra={
              <img
                width={272}
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            }
          >
            <List.Item.Meta
              title={
                <Link href={"https://maps.app.goo.gl/zMYvU3sV4LiMevgr5"}>
                  <h1>{item.title}</h1>
                </Link>
              }
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
    </div>
  );
}
