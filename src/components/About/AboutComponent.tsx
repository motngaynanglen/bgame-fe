import React from "react";

export default function AboutComponent() {
  return (
    <div>
      <div className="hidden lg:block py-4 ">
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <img
            src="/assets/images/carousel2.jpg"
            alt="Banner 2"
            className="w-full lg:h-[400px] object-cover rounded-t-lg  md:h-auto  md:rounded-none md:rounded-s-lg"
          />
          <div className="md:ml-6 mt-4 md:mt-0">
            <h2 className="text-gray-500 text-base">VỀ CHÚNG TÔI</h2>
            <h1 className="text-4xl font-bold text-black-2">
              Board Game Impact
            </h1>
            <p className="mt-4 text-gray-700 text-lg">
              Board Game Impact là chuỗi hệ thống cửa hàng board game lớn nhất
              tại Việt Nam. Với nhiều năm kinh nghiệm trong lĩnh vực board game,
              chúng tôi tự hào là địa chỉ tin cậy của người chơi board game tại
              Việt Nam. Cửa hàng luôn cập nhật những sản phẩm mới nhất, chất
              lượng
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
            <button className="mt-4 bg-orange-500 border-none rounded-md text-white px-4 py-2">
              Tìm mua board game
              {/* <i className="fas fa-arrow-right"></i> */}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
