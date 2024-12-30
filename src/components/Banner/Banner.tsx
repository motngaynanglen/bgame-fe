import { Button, Carousel, Col, Image, Row } from "antd";
import React from "react";

export default function Banner() {
  return (
    <div className="container mx-auto pt-5">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={18}>
          <Carousel
            autoplay
            arrows
            className="rounded-lg overflow-hidden shadow-lg"
          >
        
            <div className="relative">
              <Image
                src="/assets/images/carousel1.jpg"
                alt="Banner 1"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-start justify-center px-8 bg-gradient-to-r from-black/30 via-transparent to-transparent">
                <h2 className="text-white text-3xl font-bold">
                  Khai trí tưởng tượng <br /> Chạm vạn niềm vui
                </h2>
                <Button
                  type="primary"
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Chạm ngay
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/assets/images/carousel2.jpg"
                alt="Banner 2"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-start justify-center px-8 bg-gradient-to-r from-black/30 via-transparent to-transparent">
                <h2 className="text-white text-3xl font-bold">
                  Trí nhớ siêu phàm <br /> Tâm linh tương thông
                </h2>
                <Button
                  type="primary"
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Mua ngay
                </Button>
              </div>
            </div>
          </Carousel>
        </Col>
        <Col xs={24} lg={6}>
          <Image
            src="https://i.pinimg.com/736x/98/cf/03/98cf0386e7394df6a0fb5077c3cd3acf.jpg"
            className="w-full h-[100px] object-cover rounded-lg"
          />
          <Image
            src="https://i.pinimg.com/736x/8f/f8/9d/8ff89d23c2aeed786214bfbfe8f8064c.jpg"
            className="w-full h-[190px] object-cover rounded-lg"
          />
        </Col>
      </Row>
    </div>
  );
}
