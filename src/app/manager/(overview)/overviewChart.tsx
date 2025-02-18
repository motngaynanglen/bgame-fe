"use client"
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Button, Space, Card, Row, Col } from 'antd';

import Chart from 'chart.js/auto';
import dayjs, { Dayjs } from 'dayjs';
dayjs.locale('vi');
const { RangePicker } = DatePicker;

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    borderWidth: number;
    fill: boolean;
  }[];
}

const OverviewChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const [data, setData] = useState<ChartData>({
    labels: ['Label 1', 'Label 2', 'Label 3'],
    datasets: [
      {
        label: 'Người',
        data: [65, 59, 80],
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Khỉ',
        data: [12, 50, 100],
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  });

  const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
    // Xử lý dữ liệu theo khoảng ngày được chọn
    console.log(dates);
  };

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // 🔹 Hủy biểu đồ cũ trước khi tạo mới
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        responsive: true,
      },
    });

    // 🔹 Cleanup function để hủy chart khi component unmount hoặc data thay đổi
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);
  const chartHeader = () => {
    return (
      <>
        <div className='flex justify-between'>
          <h2 className=''>Đề mục của biểu đồ</h2>

          <Space>
            <button type="button" className="my-button text-sm font-normal text-gray-900 focus:outline-none bg-white rounded-md border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              <span>Hôm nay</span>
            </button>
            <button type="button" className="my-button text-sm font-normal text-gray-900 focus:outline-none bg-white rounded-md border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              <span>Tuần này</span>
            </button>
            <button type="button" className="my-button text-sm font-normal text-gray-900 focus:outline-none bg-white rounded-md border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              <span>Tháng này</span>
            </button>
            <RangePicker className='font-normal' format={"DD-MM-YYYY"}/>
           
          </Space>

        </div>
      </>
    )
  }
  return (
    <div className='px-3 w-full'>
      <Card variant='outlined' cover title={chartHeader()} >

        <Row className=''>
          <Col span={16}>
            <canvas ref={chartRef} />
          </Col>
          <Col span={8} style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
            <p>Nội dung tổng quát 1</p>
            <p>Nội dung tổng quát 2</p>
            <p>Nội dung tổng quát 3</p>
          </Col>
        </Row>

      </Card>
    </div>
  );
};

export default OverviewChart;
