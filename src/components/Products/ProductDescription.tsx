"use client";
import { useQueryClient } from "@tanstack/react-query";
import type { DescriptionsProps } from "antd";
import { Collapse, Descriptions, Rate } from "antd";
import { useEffect, useMemo, useState } from "react";
import TipTapEditor from "../TipTapEditor/TipTapEditor";

interface BoardGameInfo {
  id: string;
  product_group_ref_id: string;
  product_name: string;
  price: number;
  code: string;
  image: string;
  publisher: string;
  category: string;
  age: number;
  number_of_player_min: number;
  number_of_player_max: number;
  hard_rank: number;
  time: string;
  description: string;
  sales_quantity: number;
  rent_quantity: number;
  duration: string | null | undefined;
}

function SingleProductDescription({
  productData,
}: {
  productData: BoardGameInfo | undefined;
}) {
  const productInfoItems = useMemo(
    () => [
      {
        icon: '🏢',
        label: 'Nhà phát hành',
        value: productData?.publisher || 'Đang cập nhật',
      },
      {
        icon: '👥',
        label: 'Số người chơi',
        value: `${productData?.number_of_player_min || '?'} - ${productData?.number_of_player_max || '?'}`,
      },
      {
        icon: '⏰',
        label: 'Thời gian chơi',
        value: productData?.duration ? `${productData.duration} phút` : 'Đang cập nhật',
      },
      {
        icon: '🎂',
        label: 'Độ tuổi đề xuất',
        value: productData?.age ? `Từ ${productData.age}+` : 'Mọi lứa tuổi',
      },
    ],
    [productData]
  );

  return (
    <div className="space-y-6 pb-6">
      {/* Product Specifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Thông số kỹ thuật</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productInfoItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-700 text-lg">{item.label}</h3>
                <p className="text-gray-900 text-lg font-medium mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Collapse
          defaultActiveKey={['description']}
          expandIcon={({ isActive }) => (
            <div className="transform transition-transform">
              {isActive ? '▼' : '►'}
            </div>
          )}
          items={[
            {
              key: 'description',
              label: (
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  📝 Mô tả sản phẩm
                </h2>
              ),
              children: (
                <div className="p-6">
                  {productData?.description ? (
                    <div className="prose prose-lg max-w-none">
                      <TipTapEditor
                        value={productData.description}
                        isReadonly={true}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4">📖</div>
                      <p className="text-lg">Chưa có mô tả cho sản phẩm này</p>
                      <p className="text-sm">Sản phẩm đang được cập nhật thông tin</p>
                    </div>
                  )}
                </div>
              ),
              extra: (
                <div className="text-sm text-gray-500">
                  {productData?.description ? 'Nhấn để thu gọn' : 'Thông tin bổ sung'}
                </div>
              ),
            },
          ]}
          className="product-description-collapse"
        />
      </div>

    
    </div>
  );
}

export default SingleProductDescription;
