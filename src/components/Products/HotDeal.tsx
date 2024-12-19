import { Button, Card, Carousel } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";

// const SampleNextArrow: React.FC<{
//   className?: "string";
//   style?: React.CSSProperties;
//   onClick?: () => void;
// }> = (props) => {
//   const { className, onClick } = props;
//   return (
//     <div
//       className={`${className} flex items-center justify-center fill-green-950`}
//       onClick={onClick}
//     />
//   );
// };

// const SamplePrevArrow: React.FC<{
//   className?: string;
//   onClick?: () => void;
// }> = (props) => {
//   const { className, onClick } = props;
//   return <div className={className} onClick={onClick} />;
// };

// const settings = {
//   nextArrow: <SampleNextArrow />,
//   prevArrow: <SamplePrevArrow />,
// };
export default function HotDeal() {
  const items = [1, 2, 3, 4];

  return (
    <div className="relative pt-3  ">
      <div className=" text-white p-4 flex justify-between items-center bg-green-600 rounded-md">
        <h1 className="text-xl font-bold">Hot deal</h1>
        <a href="#" className="text-white">
          View All
        </a>
      </div>
      <Carousel
        autoplay
        arrows
        slidesToShow={5}
        slidesToScroll={1}
        dots={false}
        infinite
        // {...settings}
        // className="bg-gray-100 rounded-b-md"
      >
        {items.map((_, index) => (
          <div
            key={index}
            className="flex flex-wrap-reverse items-center justify-items-center p-4 "
          >
            <Card
              hoverable
              cover={<img alt="example" src="/assets/images/tqs.jpg" />}
              className="flex flex-col items-center"
              actions={[
                <Button
                  key="add-to-cart"
                  className="bg-green-500 text-white font-semibold hover:bg-green-600 rounded-md "
                >
                  Thêm vào giỏ hàng
                </Button>,
              ]}
            >
              <Meta
                title="Tam Quốc Sát"
                description="800.000đ"
                className="text-center"
              />
            </Card>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
