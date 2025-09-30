"use client";
import React, { useState } from "react";
import {
  Card,
  Statistic,
  Row,
  Col,
  Select,
  DatePicker,
  Table,
  Progress,
  Tag,
  Button,
  Spin,
  Alert,
  List,
  Typography,
} from "antd";
import {
  ShopOutlined,
  DollarOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
  StarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface StorePerformance {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  growth: number;
  status: "excellent" | "good" | "average" | "poor";
  location: string;
}

interface RevenueData {
  totalRevenue: number;
  rentalRevenue: number;
  purchaseRevenue: number;
  consignmentRevenue: number;
  growthRate: number;
  storeCount: number;
  totalOrders: number;
  activeUsers: number;
}

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">(
    "month"
  );
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>("all");

  // Mock data - Replace with actual API calls
  const dashboardData: RevenueData = {
    totalRevenue: 125000000,
    rentalRevenue: 45000000,
    purchaseRevenue: 65000000,
    consignmentRevenue: 15000000,
    growthRate: 12.5,
    storeCount: 8,
    totalOrders: 1247,
    activeUsers: 3241,
  };

  const storePerformance: StorePerformance[] = [
    {
      id: "1",
      name: "Board Game Hub Q1",
      revenue: 25000000,
      orders: 312,
      growth: 15.2,
      status: "excellent",
      location: "Quận 1",
    },
    {
      id: "2",
      name: "Board Game Center Q3",
      revenue: 22000000,
      orders: 298,
      growth: 8.7,
      status: "good",
      location: "Quận 3",
    },
    {
      id: "3",
      name: "Game Universe Q7",
      revenue: 18000000,
      orders: 245,
      growth: 5.3,
      status: "average",
      location: "Quận 7",
    },
    {
      id: "4",
      name: "Strategy Games Q10",
      revenue: 15000000,
      orders: 198,
      growth: -2.1,
      status: "poor",
      location: "Quận 10",
    },
    {
      id: "5",
      name: "Family Games Q5",
      revenue: 12000000,
      orders: 156,
      growth: 3.4,
      status: "average",
      location: "Quận 5",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      store: "Board Game Hub Q1",
      action: "Đơn hàng lớn #ORD-0012",
      amount: 12500000,
      time: "10 phút trước",
    },
    {
      id: 2,
      store: "Game Universe Q7",
      action: "Sản phẩm mới được thêm",
      amount: 0,
      time: "25 phút trước",
    },
    {
      id: 3,
      store: "Board Game Center Q3",
      action: "Thanh toán thành công",
      amount: 3500000,
      time: "1 giờ trước",
    },
    {
      id: 4,
      store: "Strategy Games Q10",
      action: "Đánh giá 5 sao mới",
      amount: 0,
      time: "2 giờ trước",
    },
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      excellent: "green",
      good: "blue",
      average: "orange",
      poor: "red",
    };
    return colors[status as keyof typeof colors] || "gray";
  };

  const getStatusText = (status: string): string => {
    const texts = {
      excellent: "Xuất sắc",
      good: "Tốt",
      average: "Trung bình",
      poor: "Cần cải thiện",
    };
    return texts[status as keyof typeof texts] || "Không xác định";
  };

  const performanceColumns = [
    {
      title: "Cửa hàng",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: StorePerformance) => (
        <div>
          <div className="font-semibold">{text}</div>
          <div className="text-xs text-gray-500">{record.location}</div>
        </div>
      ),
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (amount: number) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: "Đơn hàng",
      dataIndex: "orders",
      key: "orders",
      render: (orders: number) => formatNumber(orders),
    },
    {
      title: "Tăng trưởng",
      dataIndex: "growth",
      key: "growth",
      render: (growth: number) => (
        <span className={growth >= 0 ? "text-green-600" : "text-red-600"}>
          {growth >= 0 ? <RiseOutlined /> : <FallOutlined />}
          {Math.abs(growth)}%
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: StorePerformance) => (
        <Button type="link" icon={<EyeOutlined />}>
          Chi tiết
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" tip="Đang tải dữ liệu hệ thống..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2} className="!mb-1">
              Dashboard Quản trị Hệ thống
            </Title>
            <Text type="secondary">
              Tổng quan toàn bộ chuỗi cửa hàng Board Game
            </Text>
          </div>
          <div className="flex gap-2">
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
            >
              <Option value="week">Tuần này</Option>
              <Option value="month">Tháng này</Option>
              <Option value="quarter">Quý này</Option>
            </Select>
            <RangePicker />
            {/* <Button icon={<ReloadOutlined />}>Làm mới</Button>
            <Button type="primary" icon={<DownloadOutlined />}>
              Xuất báo cáo
            </Button> */}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card className="rounded-xl shadow-sm border-0">
            <Statistic
              title="Tổng doanh thu"
              value={dashboardData.totalRevenue}
              prefix={<DollarOutlined className="text-green-500" />}
              valueStyle={{ color: "#10b981" }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <div className="flex items-center mt-2">
              <RiseOutlined className="text-green-500 mr-1" />
              <Text type="secondary">
                {dashboardData.growthRate}% so với kỳ trước
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="rounded-xl shadow-sm border-0">
            <Statistic
              title="Tổng cửa hàng"
              value={dashboardData.storeCount}
              prefix={<ShopOutlined className="text-blue-500" />}
              valueStyle={{ color: "#3b82f6" }}
              suffix="cửa hàng"
            />
            <div className="mt-2">
              <Text type="secondary">Đang hoạt động</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="rounded-xl shadow-sm border-0">
            <Statistic
              title="Tổng đơn hàng"
              value={dashboardData.totalOrders}
              prefix={<TrophyOutlined className="text-orange-500" />}
              valueStyle={{ color: "#f59e0b" }}
            />
            <div className="mt-2">
              <Text type="secondary">Across all stores</Text>
            </div>
          </Card>
        </Col>

        {/* <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl shadow-sm border-0">
            <Statistic
              title="Doanh thu trung bình"
              // value={dashboardData.avgRevenuePerStore}
              prefix={<DollarOutlined className="text-purple-500" />}
              valueStyle={{ color: "#8b5cf6" }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <div className="mt-2">
              <Text type="secondary">Mỗi cửa hàng</Text>
            </div>
          </Card>
        </Col> */}
      </Row>

      {/* Revenue Breakdown and Performance */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card
            title="Phân bổ doanh thu"
            className="rounded-xl shadow-sm border-0 h-full"
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <Text>Doanh thu bán hàng</Text>
                  <Text strong>
                    {formatCurrency(dashboardData.purchaseRevenue)}
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    (dashboardData.purchaseRevenue /
                      dashboardData.totalRevenue) *
                      100
                  )}
                  strokeColor="#10b981"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <Text>Doanh thu cho thuê</Text>
                  <Text strong>
                    {formatCurrency(dashboardData.rentalRevenue)}
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    (dashboardData.rentalRevenue / dashboardData.totalRevenue) *
                      100
                  )}
                  strokeColor="#3b82f6"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <Text>Doanh thu ký gửi</Text>
                  <Text strong>
                    {formatCurrency(dashboardData.consignmentRevenue)}
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    (dashboardData.consignmentRevenue /
                      dashboardData.totalRevenue) *
                      100
                  )}
                  strokeColor="#f59e0b"
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Cửa hàng hàng đầu"
            className="rounded-xl shadow-sm border-0 h-full"
          >
            <List
              dataSource={storePerformance.slice(0, 3)}
              renderItem={(store, index) => (
                <List.Item>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-600"
                            : index === 1
                            ? "bg-gray-100 text-gray-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        <TrophyOutlined />
                      </div>
                      <div>
                        <div className="font-semibold">{store.name}</div>
                        <div className="text-xs text-gray-500">
                          {store.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {formatCurrency(store.revenue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {store.orders} đơn hàng
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Store Performance Table */}
      <Card
        title=" Hiệu suất cửa hàng"
        className="rounded-xl shadow-sm border-0 mb-6"
        extra={
          <Select
            value={selectedStore}
            onChange={setSelectedStore}
            style={{ width: 200 }}
            placeholder="Tất cả cửa hàng"
          >
            <Option value="all">Tất cả cửa hàng</Option>
            {storePerformance.map((store) => (
              <Option key={store.id} value={store.id}>
                {store.name}
              </Option>
            ))}
          </Select>
        }
      >
        <Table
          columns={performanceColumns}
          dataSource={storePerformance}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Recent Activities and Quick Stats */}
      {/* <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="🔄 Hoạt động gần đây" 
            className="rounded-xl shadow-sm border-0"
          >
            <List
              dataSource={recentActivities}
              renderItem={item => (
                <List.Item>
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <div className="font-medium">{item.action}</div>
                      <div className="text-sm text-gray-500">{item.store}</div>
                      <div className="text-xs text-gray-400">{item.time}</div>
                    </div>
                    {item.amount > 0 && (
                      <div className="font-semibold text-green-600">
                        +{formatCurrency(item.amount)}
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title="📈 Chỉ số hiệu suất" 
            className="rounded-xl shadow-sm border-0"
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(dashboardData.totalRevenue / dashboardData.storeCount / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-blue-700">Doanh thu trung bình/cửa hàng</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(dashboardData.totalOrders / dashboardData.storeCount)}
                  </div>
                  <div className="text-sm text-green-700">Đơn hàng trung bình/cửa hàng</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {dashboardData.growthRate}%
                  </div>
                  <div className="text-sm text-orange-700">Tăng trưởng doanh thu</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(dashboardData.activeUsers / dashboardData.storeCount)}
                  </div>
                  <div className="text-sm text-purple-700">Người dùng tích cực/cửa hàng</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row> */}
    </div>
  );
};

export default AdminDashboard;
