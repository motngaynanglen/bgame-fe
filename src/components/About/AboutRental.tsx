"use client";
import { useRouter } from "next/navigation";
import React from "react";
import StarBorder from "../Bits/StarBorder";
import { Button, Card, Col, Divider, Row, Tag, Typography } from "antd";
import {
  CalendarOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  SwapOutlined,
} from "@ant-design/icons";
const { Title, Paragraph, Text } = Typography;

const services = [
  {
    icon: <ShoppingCartOutlined className="text-4xl" />,
    title: "Mua Board Game",
    description:
      "Sở hữu những board game chính hãng với giá tốt nhất. Đa dạng thể loại từ gia đình đến chiến thuật.",
    features: [
      "Giá cả cạnh tranh",
      "Sản phẩm chính hãng",
      "Giao hàng toàn quốc",
    ],
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    action: "Mua ngay",
    route: "/products"
  },
  {
    icon: <CalendarOutlined className="text-4xl" />,
    title: "Thuê Board Game",
    description:
      "Trải nghiệm hàng ngàn board game ngay tại cửa hàng với không gian chơi game thoải mái, hiện đại.",
    features: [
      "Hơn 200 tựa game",
      "Không gian riêng tư",
      "Hướng dẫn viên",
    ],
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    action: "Đặt chỗ ngay",
    route: "/rental"
  },
  {
    icon: <SwapOutlined className="text-4xl" />,
    title: "Ký Gửi Board Game",
    description:
      "Mang board game của bạn đến ký gửi và kiếm thêm thu nhập. Chúng tôi  bảo quản cẩn thận.",
    features: [
      "Hoa hồng hấp dẫn",
      "Bảo quản chuyên nghiệp",
      "Thanh toán định kỳ",
    ],
    color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    action: "Ký gửi ngay",
    route: "/consignment"
  },
];

export default function AboutRental() {
  const router = useRouter();
  return (
    <div className="hidden lg:block pb-6 ">
      <section className="py-8  bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            {/* <Tag color="blue" className="text-lg px-4 py-1 mb-4">
              DỊCH VỤ
            </Tag> */}
            <Divider variant="dashed" style={{ borderColor: "#7cb305" }}>
              <Title level={2} className="!text-4xl !font-bold">
                Trải Nghiệm Board Game Trọn Vẹn
              </Title>
            </Divider>

            <Paragraph className="!text-xl !text-gray-600 max-w-2xl mx-auto">
              Chúng tôi mang đến đa dạng dịch vụ để bạn có thể tận hưởng thế
              giới board game theo cách của riêng mình
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {services.map((service, index) => (
              <Col xs={24} lg={8} key={index}>
                <Card
                  className="h-full rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
                  bodyStyle={{ padding: 0 }}
                >
                  <div
                    className="h-48 flex items-center justify-center text-white"
                    style={{ background: service.color }}
                  >
                    {service.icon}
                  </div>

                  <div className="p-8">
                    <Title level={3} className="!text-2xl !mb-4">
                      {service.title}
                    </Title>

                    <Paragraph className="!text-gray-600 !mb-6">
                      {service.description}
                    </Paragraph>

                    <div className="space-y-2 mb-8">
                      {service.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-gray-700"
                        >
                          <StarOutlined className="text-green-500 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      block
                      className="h-12 text-lg"
                      style={{
                        background: service.color.split("0%")[0] + "100%)",
                      }}
                      onClick={() => router.push(service.route)}
                    >
                      {service.action}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </div>
  );
}
