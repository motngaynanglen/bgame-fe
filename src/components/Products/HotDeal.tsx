import { Carousel, Divider } from "antd";
import Link from "next/link";
import CardProduct from "./CardProduct";

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
export default function HotDeal({ category }: { category: string }) {
  const items = [1, 2, 3, 4];

  return (
    <div className="container md:p-3  ">
      {/* <div className=" text-black pt-4 flex justify-between items-center">
        <h1 className="text-2xl p-1 font-bold uppercase bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">{category}</h1>

        <Link className="hover:underline " href="/products">
          View All
        </Link>
      </div> */}
      <Divider style={{ borderColor: "#7cb305" }}>
        {" "}
        <h1 className="text-2xl p-1 font-bold uppercase bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          {category}
        </h1>
      </Divider>

      <Carousel

        arrows
        slidesToShow={4}
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
            <CardProduct
              image="/assets/images/tqs.jpg"
              price={800000}
              title="Tam quốc sát"
              soldOut={false}
            />
            {/* <Card
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
            </Card> */}
          </div>
        ))}
      </Carousel>
      <div className="flex justify-center">
        <Link className="hover:underline " href="/products">
          <button className="bg-green-500 text-white font-semibold hover:bg-green-600 rounded-full   px-5 py-2 mt-2">
            Xem Tất cả
          </button>
        </Link>
      </div>
    </div>
  );
}
