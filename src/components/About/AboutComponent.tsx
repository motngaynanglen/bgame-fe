import React from "react";
import StarBorder from "../Bits/StarBorder";
import PixelTransition from "../Bits/PixelTransition";
import { ArrowRightOutlined } from "@ant-design/icons";

export default function AboutComponent() {
  return (
    <div>
      <div className="hidden lg:block py-4 ">
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <div className="w-full lg:h-[400px] object-cover rounded-t-lg  md:h-auto  md:rounded-none md:rounded-s-lg">
            <PixelTransition
              style={{ width: "100%", height: "100%" }}
              firstContent={
                <img
                  src="/assets/images/carousel2.jpg"
                  alt="Banner 2"
                  // className="w-full lg:h-[400px] object-cover rounded-t-lg  md:h-auto  md:rounded-none md:rounded-s-lg"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              }
              secondContent={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: "#111",
                  }}
                >
                  <img
                    src="/assets/images/carousel1.jpg"
                    alt="Banner 2"
                    // className="w-full lg:h-[400px] object-cover rounded-t-lg  md:h-auto  md:rounded-none md:rounded-s-lg"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              }
              gridSize={10}
              pixelColor="#ffffff"
              animationStepDuration={0.4}
              className="custom-pixel-card"
            />
          </div>

          <div className="md:mx-4 mt-4 md:mt-0">
            <h2 className="text-gray-500 text-base">VỀ CHÚNG TÔI</h2>
            <h1 className="text-4xl font-bold text-black-2">
              Board Game Impact
            </h1>
            <p className="mt-4 text-gray-700 text-lg">
              Board Game Impact là chuỗi hệ thống cửa hàng board game tại Việt
              Nam. Với nhiều năm kinh nghiệm trong lĩnh vực board game, chúng
              tôi tự hào là địa chỉ tin cậy của người chơi board game tại Việt
              Nam. Cửa hàng luôn cập nhật những sản phẩm mới nhất, chất lượng
              {/* <br /> Ngoài ra chúng tôi cũng cung cấp các dịch vụ liên quan đến
              board game như tổ chức giải đấu, tổ chức sự kiện, thuê board game
              tại những cửa hàng của chúng tôi. */}
            </p>
            {/* <div className="flex mt-12 justify-around text-center">
              <div>
                <h2 className="text-4xl font-bold text-black-2">150+</h2>
                <p className="mt-2 text-gray-700">Board game </p>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-black-2">5</h2>
                <p className="mt-2 text-gray-700">Cửa hàng</p>
              </div>
            </div> */}
            <div className="mt-4">
              <button className="group bg-tertiary cursor-pointer slide-anime px-5 py-3 rounded-full w-[180px] dark:bg-white bg-primary-base text-white dark:text-black flex justify-between items-center font-semibold ">
                Tìm hiểu thêm{" "}
                <div className="group-hover:translate-x-2 transition-all">
                  <ArrowRightOutlined />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
