import React from 'react';
import { Card, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Table } from './types';

const { Text } = Typography;

interface TableCardProps {
    table: Table;
    onClick: () => void;
    isSelected: boolean;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'empty':
            return '#52c41a'; // Xanh lá
        case 'occupied':
            return '#faad14'; // Vàng
        case 'reserved':
            return '#1890ff'; // Xanh dương
        default:
            return '#d9d9d9'; // Xám
    }
};

export default function TableCard({ table, onClick, isSelected }: TableCardProps) {
  const cardStyle: React.CSSProperties = {
    backgroundColor: getStatusColor(table.Status),
    cursor: 'pointer',
    // Viền xanh khi được chọn, như trong ảnh
    border: isSelected ? '2px solid #1890ff' : 'none', // Bỏ border mặc định
    borderRadius: 8, // Góc bo tròn cho cả 2 loại bàn
    // Điều chỉnh kích thước để bàn 8 người dài hơn, bàn 4 người vuông hơn
    width: table.Capacity === 4 ? 120 : 180, // Chiều rộng
    height: 90, // Chiều cao cố định
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 0 rgba(0, 0, 0, 0.04)', // Thêm shadow nhẹ
  };

  return (
    <Card onClick={onClick} style={cardStyle} bodyStyle={{ padding: '10px 10px' }}>
      <Text style={{ fontSize: '16px', color: '#fff', marginBottom: '5px' }}>Bàn {table.TableName}</Text>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <UserOutlined style={{ marginRight: '5px', color: '#fff' }} />
        <Text style={{ color: '#fff' }}>{table.Capacity}</Text>
      </div>
    </Card>
  );
}