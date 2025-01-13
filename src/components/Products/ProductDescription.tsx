'use client';
import { Rate, Tabs, TabsProps } from "antd";
import Link from "next/link";
import React, { useMemo } from "react";

function SingleProductDescription() {
  const items: TabsProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: "Mô tả sản phẩm",
        children: (
          <div id="description" className="space-y-4">
            <p className="text-gray-600">TAM QUỐC SÁT QUỐC SÁT</p>
            <p className="text-gray-600">
              ✔️ Hội tụ đầy đủ tứ đại Quân Chủ: Lưu Bị (Thục), Trương Giác (Quần
              hùng), Tôn Quyền (Ngô) và Tào Tháo (Ngụy).
              <br /> ✔️ Trọn bộ 4 gói tướng mở rộng: “Trận”, “Thế”, “Biến” và
              “Quyền”
              <br /> ✔️ Ra mắt chế độ mới: “Quân lệnh”
              <br /> ✔️ Sản phẩm chính hãng từ Yokagames với thiết kế hộp game
              độc quyền, độc đáo, chất lượng in đạt chuẩn.
            </p>
          </div>
        ),
      },
      {
        key: "2",
        label: "Bản mở rộng",
        children: (
          <div id="info" className="space-y-4">
            <table className="table-auto w-full border-collapse">
              <tbody>
                {[
                  [
                    "Ứng Biến Thiên",
                    "Bộ thẻ bài mở rộng Tam Quốc Sát: Ứng Biến Thiên dành cho phiên bản Quốc Chiến.",
                    "https://shopee.vn/",
                  ],
                  [
                    "Bản mở rộng Bất Thần Thiên - Bản Hạ",
                    "Bản mở rộng Bất Thần Thiên - Bản Hạ là một bản mở rộng mới của trò chơi Tam Quốc Sát Quốc Chiến, được phát hành vào năm 2023. Bản mở rộng này bổ sung thêm 14 tướng mới, bao gồm 4 dã tâm gia, 6 tướng song thế lực và 4 tướng đơn thế lực.",
                    "https://shopee.vn/",
                  ],
                ].map(([key, value, href]) => (
                  <tr key={key}>
                    <td className="border px-4 py-2 font-semibold uppercase">
                      <Link href={href}>{key}</Link>
                    </td>
                    <td className="border px-4 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
      {
        key: "3",
        label: "Đánh giá",
        children: (
          <div id="review" className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Đánh giá (02):</h3>
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
                      <h5 className="font-semibold">{review.name}</h5>
                      <Rate disabled defaultValue={review.rating} />
                    </div>
                    <div className="flex space-x-1 text-orange-500">
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-8 mb-32">
      <Tabs defaultActiveKey="1" items={items} type="card" size="large" />
    </div>
  );
}

export default SingleProductDescription;
