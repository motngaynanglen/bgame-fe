"use client";
import { useQueryClient } from "@tanstack/react-query";
import type { DescriptionsProps } from "antd";
import { Collapse, Descriptions, Rate } from "antd";
import { useEffect, useMemo, useState } from "react";

interface BoardGameInfo {
  id: string;
  product_group_ref_id: string;
  product_name: string;
  sell_price: number;
  code: string;
  image: string;
  publisher: string;
  category: string;
  age: number;
  number_of_players_min: number;
  number_of_players_max: number;
  hard_rank: number;
  time: string;
  description: string;
  sales_quantity: number;
  rent_quantity: number;
}

function SingleProductDescription({
  productData,
}: {
  productData: BoardGameInfo | undefined;
}) {
  console.log("productData at 1 ", productData);
  
  const items: DescriptionsProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: <h1 className="text-xl">Nhà phát hành</h1>,
        span: 1,
        children: <p className="text-xl">{productData?.publisher}</p>,
      },
      {
        key: "2",
        label: <h1 className="text-xl">Số người chơi</h1>,
        children: <p className="text-xl">{productData?.number_of_players_min} - {productData?.number_of_players_max}</p>,
      },
      {
        key: "3",
        label: <h1 className="text-xl">Thời gian chơi</h1>,
        children: <p className="text-xl">{productData?.time}</p>,
      },
      {
        key: "4",
        label: <h1 className="text-xl">Độ tuổi đề xuất</h1>,
        children: <p className="text-xl">{productData?.age}</p>,
      },
      {
        key: "5",
        label: <h1 className="text-xl">Bản mở rộng</h1>,
        children: (
          <p className="text-xl">
            Bản mở rộng số 1 <br />
            Bản mở rộng số 2
          </p>
        ),
      },
    ],
    []
  );

  console.log("productData", productData);

  return (
    <div className="space-y-8 pb-16 ">
      <Collapse
        defaultActiveKey={["1"]}
        expandIconPosition="right"
        items={[
          {
            key: "1",
            label: <h1 className="text-xl">Mô tả sản phẩm</h1>,
            children: (
              <div>
                <Descriptions bordered items={items} column={1} />
                <p className="text-gray-600 mt-4 ml-2 text-xl">
                  {productData?.description || "Boardgame rất hay"}
                </p>
              </div>
            ),
          },
        ]}
      />

      {/* <div id="review" className="space-y-4">
        <h3 className="text-xl font-bold mb-4 text-black-2">Đánh giá (02):</h3>
        <ul className="space-y-6">
          {[
            {
              name: "Rocky Mike",
              date: "06 July, 2022",
              comment:
                "I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born.",
              rating: 5,
            },
            {
              name: "Rony Jhon",
              date: "07 July, 2022",
              comment:
                "I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born.",
              rating: 5,
            },
          ].map((review, index) => (
            <li key={index} className="flex space-x-4">
              <img
                src={`/assets/images/review-img-3.png`}
                alt="Reviewer"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h5 className="font-semibold text-black-2">{review.name}</h5>
                  <Rate disabled defaultValue={review.rating} />
                </div>
                <div className="flex space-x-1 text-orange-500">
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default SingleProductDescription;
