'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Card, message, Statistic, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { book, BookTable, Table } from './types';
import moment from 'moment';
import { ConvertSlotToDateTime, ConvertTimeToSlot } from '@/src/lib/utils';
const { Timer } = Statistic;
const { Text } = Typography;

interface TableCardProps {
  table: Table;
  onClick: () => void;
  isSelected: boolean;
}

const getStatusColor = (book: book | undefined) => {
  switch (book?.bookingData.status) {
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
  const [book, setBook] = useState<book | undefined>(undefined);
  
  useEffect(() => {


    const checkAndUpdateBooking = () => {
      if (!table.bookTables || table.bookTables.length === 0) {
        setBook(undefined);
        return;
      }

      const now = moment();
      const nowSlot = (ConvertTimeToSlot(now.format('HH:mm')));

      const currentBooking = table.bookTables.find(
        booking => booking.from_slot <= nowSlot && booking.to_slot >= nowSlot
      );
      const nearestBooking = table.bookTables.find(
        booking => (nowSlot + 2) >= booking.from_slot
      )
      if (currentBooking) {
        const endTime = ConvertSlotToDateTime(currentBooking.to_slot, false);
        if (endTime) {
          const data: book = {
            deadline: {
              time: endTime.valueOf(),
              type: 'end'
            },
            bookingData: currentBooking,
            type: 'present'
          }
          setBook(data);
        }
      } else if (nearestBooking) {
        const endTime = ConvertSlotToDateTime(nearestBooking.from_slot, false);
        if (endTime) {
          const data: book = {
            deadline: {
              time: endTime.valueOf(),
              type: 'start'
            },
            bookingData: nearestBooking,
            type: 'future'
          }
          setBook(data);
        }
      } else {

        setBook(undefined);
      }

    };

    checkAndUpdateBooking();
    const timerId: NodeJS.Timeout = setInterval(checkAndUpdateBooking, 30000);

    return () => clearInterval(timerId);
  }, [table]);
  const cardStyle: React.CSSProperties = {
    backgroundColor: getStatusColor(book),
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
      {book ? (
        <div >
          <Text>{(book.type == 'present') ? 'Thời gian còn lại:' : "Đơn bắt đầu sau:"}    </Text>
          <Timer className='flex justify-end' valueStyle={{ fontSize: "14px" }} type='countdown' value={book.deadline.time} format="HH h, mm phút" />

        </div>
      ) : (
        <Text style={{ color: '#fff' }}>Bàn trống</Text>
      )}
    </Card>
  );
}