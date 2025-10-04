'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Card, message, Statistic, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { book, BookInfo, BookTable, Table, TableViewModel } from './types';
import moment from 'moment';
import { ConvertSlotToDateTime, ConvertTimeToSlot } from '@/src/lib/utils';
const { Timer } = Statistic;
const { Text } = Typography;

interface TableCardProps {
  table: TableViewModel;
  onClick: () => void;
  isSelected: boolean;
}

const getStatusColor = (book: BookInfo | undefined) => {
  switch (book?.bookData.status) {
    case 'ACTIVE':
      return '#52c41a'; // Xanh lá
    case 'REPARED':
      return '#faad14'; // Vàng
    case 'RESERVED':
      return '#1890ff'; // Xanh dương
    default:
      return '#52c41a'; // Xám
  }
};
export default function TableCard({ table, onClick, isSelected }: TableCardProps) {

  const cardStyle: React.CSSProperties = {
    backgroundColor: getStatusColor(table.BookInfo ?? undefined),
    cursor: 'pointer',
    // Viền xanh khi được chọn, như trong ảnh
    border: isSelected ? '2px solid #1890ff' : 'none', // Bỏ border mặc định
    borderRadius: 8, // Góc bo tròn cho cả 2 loại bàn
    // Điều chỉnh kích thước để bàn 8 người dài hơn, bàn 4 người vuông hơn
    width: table.Capacity === 4 ? 160 : 200, // Chiều rộng
    height: 90, // Chiều cao cố định
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 0 rgba(0, 0, 0, 0.04)', // Thêm shadow nhẹ
  };
  return (
    <Card onClick={onClick} style={cardStyle} className='w-full'>
      <Text style={{ fontSize: '16px', color: '#fff', marginBottom: '5px' }}>Bàn {table.TableName}</Text>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <UserOutlined style={{ marginRight: '5px', color: '#fff' }} />
        <Text style={{ color: '#fff' }}>{table.Capacity}</Text>
      </div>
      {table.BookInfo ? (
        <div >
          <Text>{(table?.BookInfo.type == 'present') ? 'Thời gian còn lại:' : "Đơn bắt đầu sau:"}    </Text>
          <Timer className='flex justify-end' valueStyle={{ fontSize: "14px" }} type='countdown' value={table?.BookInfo.deadline?.time} format="HH h, mm phút" />

        </div>
      ) : (
        <Text style={{ color: '#fff' }}>Bàn trống</Text>
      )}
    </Card>
  );
}