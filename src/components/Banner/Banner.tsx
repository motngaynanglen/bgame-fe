'use client';
import { Button, Carousel, Col, Image, Row } from "antd";
import { useRouter } from "next/navigation";
import React from "react";


export default function Banner() {
  const router = useRouter();

  return (
    <div className="pt-5">
      {/* <Row gutter={[16, 16]}> */}
        {/* <Col xs={24} lg={18}> */}
          <Carousel
            autoplay
            arrows
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative">
              <img
                src="/assets/images/carousel1.jpg"
                alt="Banner 1"
                className="w-full h-[50vw] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-start justify-center px-8 bg-gradient-to-r from-black/30 via-transparent to-transparent">
                <h2 className="text-white text-3xl font-bold uppercase">
                  Dịch vụ thuê board <br /> tại Board Game Impact
                </h2>
                <Button
                  type="primary"
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  onClick={() => router.push("/rental")}
                >
                  Trải ngiệm ngay
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src="/assets/images/carousel2.jpg"
                alt="Banner 2"
                className="w-full h-[50vw] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-start justify-center px-8 bg-gradient-to-r from-black/30 via-transparent to-transparent">
                <h2 className="text-white text-3xl font-bold uppercase">
                  Khám phá thế giới board game <br /> Board Game Impact
                </h2>
                <Button
                  type="primary"
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  onClick={() => router.push("/products")}
                >
                  Mua ngay
                </Button>
              </div>
            </div>
          </Carousel>
        {/* </Col> */}

        {/* Two  Images */}
        {/* <Col xs={24} lg={6} className="hidden lg:block">
          <Image
            src="https://i.pinimg.com/736x/98/cf/03/98cf0386e7394df6a0fb5077c3cd3acf.jpg"
            className="w-full h-[50vw] lg:h-[245px] object-cover rounded-lg"
            style={{height: '245px'}}
          />
          <Image
            src="https://i.pinimg.com/736x/8f/f8/9d/8ff89d23c2aeed786214bfbfe8f8064c.jpg"
            className="w-full h-[50vw] lg:h-[245px] object-cover rounded-lg mt-4"
            style={{height: '245px'}}

          />
        </Col> */}
      {/* </Row> */}
    </div>
  );
}
