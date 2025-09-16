'use client';
import React, { useState } from 'react';
import { Card, Statistic, DatePicker, Select, Row, Col, Table, Progress } from 'antd';
import { 
  ShoppingCartOutlined, 
  CalendarOutlined, 
  DollarOutlined, 
  ContainerOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined 
} from '@ant-design/icons';



type TimeRangeType = 'day' | 'weekly' | 'monthly';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ManagerDashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeType>('day');
  const [dateRange, setDateRange] = useState([]);

  // Dummy data - Thay thế bằng API thực tế
  const dashboardData = {
    rentalOrders: 45,
    purchaseOrders: 28,
    consignmentOrders: 12,
    totalPurchaseRevenue: 18500000,
    totalRentalRevenue: 7500000,
    revenueChange: 15.3, // % thay đổi
  };

 const revenueData: Record<TimeRangeType, { purchase: number; rental: number }> = {
    day: {
      purchase: 2500000,
      rental: 1200000,
    },
    weekly: {
      purchase: 12500000,
      rental: 6500000,
    },
    monthly: {
      purchase: 48500000,
      rental: 22500000,
    }
  };

  const recentOrders = [
    {
      key: '1',
      orderId: 'ORD-001',
      type: 'Thuê',
      customer: 'Nguyễn Văn A',
      amount: 350000,
      status: 'completed',
      date: '2024-01-15',
    },
    {
      key: '2',
      orderId: 'ORD-002',
      type: 'Mua',
      customer: 'Trần Thị B',
      amount: 1200000,
      status: 'processing',
      date: '2024-01-15',
    },
    {
      key: '3',
      orderId: 'ORD-003',
      type: 'Ký gửi',
      customer: 'Lê Văn C',
      amount: 500000,
      status: 'pending',
      date: '2024-01-14',
    },
  ];

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <span className={type === 'Thuê' ? 'text-blue-600' : type === 'Mua' ? 'text-green-600' : 'text-orange-600'}>
          {type}
        </span>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={
          status === 'completed' ? 'text-green-600' : 
          status === 'processing' ? 'text-blue-600' : 'text-orange-600'
        }>
          {status === 'completed' ? 'Hoàn thành' : status === 'processing' ? 'Đang xử lý' : 'Chờ xử lý'}
        </span>
      ),
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getCurrentRevenue = () => {
    return revenueData[timeRange] || revenueData.day;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard Quản lý</h1>
        <p className="text-gray-600">Theo dõi hoạt động kinh doanh của cửa hàng</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Select 
              value={timeRange} 
              onChange={setTimeRange}
              className="w-full"
            >
              <Option value="day">Theo ngày</Option>
              <Option value="weekly">Theo tuần</Option>
              <Option value="monthly">Theo tháng</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={10}>
            <RangePicker className="w-full" />
          </Col>
        </Row>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        {/* Rental Orders */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Đơn thuê"
              value={dashboardData.rentalOrders}
              prefix={<CalendarOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3b82f6' }}
            />
            <div className="mt-2 text-sm text-gray-500">
              <ArrowUpOutlined className="text-green-500 mr-1" />
              +12% so với tuần trước
            </div>
          </Card>
        </Col>

        {/* Purchase Orders */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Đơn mua"
              value={dashboardData.purchaseOrders}
              prefix={<ShoppingCartOutlined className="text-green-500" />}
              valueStyle={{ color: '#10b981' }}
            />
            <div className="mt-2 text-sm text-gray-500">
              <ArrowUpOutlined className="text-green-500 mr-1" />
              +8% so với tuần trước
            </div>
          </Card>
        </Col>

        {/* Consignment Orders */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Đơn ký gửi"
              value={dashboardData.consignmentOrders}
              prefix={<ContainerOutlined className="text-orange-500" />}
              valueStyle={{ color: '#f59e0b' }}
            />
            <div className="mt-2 text-sm text-gray-500">
              <ArrowDownOutlined className="text-red-500 mr-1" />
              -3% so với tuần trước
            </div>
          </Card>
        </Col>

        {/* Total Revenue */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Tổng doanh thu"
              value={dashboardData.totalPurchaseRevenue + dashboardData.totalRentalRevenue}
              prefix={<DollarOutlined className="text-purple-500" />}
              valueStyle={{ color: '#8b5cf6' }}
              formatter={value => formatCurrency(Number(value))}
            />
            <div className="mt-2 text-sm text-gray-500">
              <ArrowUpOutlined className="text-green-500 mr-1" />
              +{dashboardData.revenueChange}% so với tuần trước
            </div>
          </Card>
        </Col>
      </Row>

      {/* Revenue Breakdown */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card 
            title="📈 Doanh thu đơn mua" 
            className="rounded-xl shadow-sm"
          >
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(getCurrentRevenue().purchase)}
            </div>
            <Progress 
              percent={75} 
              strokeColor="#10b981"
              className="mt-4"
            />
            <div className="mt-2 text-sm text-gray-500">
              Đạt 75% mục tiêu tháng
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title="📊 Doanh thu đơn thuê" 
            className="rounded-xl shadow-sm"
          >
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(getCurrentRevenue().rental)}
            </div>
            <Progress 
              percent={60} 
              strokeColor="#3b82f6"
              className="mt-4"
            />
            <div className="mt-2 text-sm text-gray-500">
              Đạt 60% mục tiêu tháng
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Card 
        title="📋 Đơn hàng gần đây" 
        className="rounded-xl shadow-sm"
      >
        <Table 
          columns={columns} 
          dataSource={recentOrders} 
          pagination={false}
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
};

export default ManagerDashboard;
// export default function admin() {
//     return (
//         <>
//             <Row gutter={[24, 0]}>
//                 <CardWrapper/>
//                 <OverviewChart/>
//             </Row>
//         </>
//     )
// }