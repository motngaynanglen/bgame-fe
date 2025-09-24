'use client';

import { Alert, Button, Card, Col, DatePicker, List, Row, Select, Space, Spin, Statistic } from "antd";
import { useAppContext } from "../../app-provider";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashBoardApiRequest } from "@/src/apiRequests/dashBoard";
import { AppstoreOutlined, ArrowDownOutlined, ArrowUpOutlined, CalendarOutlined, ContainerOutlined, DownloadOutlined, LineChartOutlined, ReloadOutlined, ShoppingCartOutlined } from "@ant-design/icons";

interface StatisticsModel {
  TotalOrders: number;
  TotalBookList: number;
  TotalConsignmentOrder: number;
  TotalProduct: number;
  TotalRevenue?: number;
  MonthlyGrowth?: number;
  PendingOrders?: number;
  CompletedOrders?: number;
}

interface ResponseModel {
  data: StatisticsModel;
  message: string;
  statusCode: number;
  paging: null;
}

interface RevenueData {
  purchase: number;
  rental: number;
  consignment: number;
}

interface ChartData {
  date: string;
  revenue: number;
  orders: number;
}

type TimeRangeType = "day" | "weekly" | "monthly";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ManagerDashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeType>("day");
  const [dateRange, setDateRange] = useState<any>([]);
  const user = useAppContext().user;

  const { data, isLoading, error } = useQuery<ResponseModel>({
    queryKey: ["revenueStatistics", user?.token, timeRange],
    queryFn: async () => {
      console.log("user token:", user?.token);
      const res = await dashBoardApiRequest.getStatistics(user?.token);
      return res;
    },
    enabled: !!user?.token,
  });

  // Mock data for charts and additional features
  const revenueData: Record<TimeRangeType, RevenueData> = {
    day: { purchase: 2500000, rental: 1200000, consignment: 500000 },
    weekly: { purchase: 12500000, rental: 6500000, consignment: 2500000 },
    monthly: { purchase: 48500000, rental: 22500000, consignment: 8500000 },
  };

  const chartData: ChartData[] = [
    { date: '01/01', revenue: 4500000, orders: 12 },
    { date: '02/01', revenue: 5200000, orders: 15 },
    { date: '03/01', revenue: 4800000, orders: 14 },
    { date: '04/01', revenue: 6100000, orders: 18 },
    { date: '05/01', revenue: 5500000, orders: 16 },
    { date: '06/01', revenue: 7200000, orders: 22 },
  ];

  const recentActivities = [
    { id: 1, type: 'order', message: 'Đơn hàng #ORD-001 đã hoàn thành', time: '5 phút trước', status: 'completed' },
    { id: 2, type: 'payment', message: 'Thanh toán thành công #PAY-002', time: '15 phút trước', status: 'success' },
    { id: 3, type: 'product', message: 'Sản phẩm mới đã được thêm', time: '1 giờ trước', status: 'info' },
    { id: 4, type: 'alert', message: 'Tồn kho sản phẩm XYZ sắp hết', time: '2 giờ trước', status: 'warning' },
  ];

  const topProducts = [
    { name: 'Catan', sales: 45, revenue: 22500000 },
    { name: 'Ticket to Ride', sales: 32, revenue: 16000000 },
    { name: 'Codenames', sales: 28, revenue: 8400000 },
    { name: '7 Wonders', sales: 25, revenue: 12500000 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getCurrentRevenue = (): RevenueData => {
    return revenueData[timeRange];
  };

  const calculateTotalRevenue = (): number => {
    const current = getCurrentRevenue();
    return current.purchase + current.rental + current.consignment;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" tip="Đang tải dữ liệu dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert 
          message="Lỗi tải dữ liệu" 
          description="Không thể tải dữ liệu dashboard. Vui lòng thử lại sau." 
          type="error" 
          showIcon 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Quản lý</h1>
            <p className="text-gray-600">Theo dõi hoạt động kinh doanh của cửa hàng</p>
          </div>
          <div className="flex items-center gap-2">
            <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
              Làm mới
            </Button>
            <Button type="primary" icon={<DownloadOutlined />}>
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-xl shadow-sm mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
            <Select value={timeRange} onChange={setTimeRange} className="w-full">
              <Option value="day">Hôm nay</Option>
              <Option value="weekly">Tuần này</Option>
              <Option value="monthly">Tháng này</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={10}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng thời gian</label>
            <RangePicker className="w-full" />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Actions</label>
            <Space>
              <Button size="small">Xem tất cả đơn hàng</Button>
              <Button size="small">Quản lý sản phẩm</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
            <Statistic
              title="Tổng đơn hàng"
              value={data?.data.TotalOrders || 0}
              prefix={<ShoppingCartOutlined className="text-blue-500" />}
              valueStyle={{ color: "#3b82f6" }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-green-500">
                <ArrowUpOutlined /> +12%
              </span>
              <span className="text-xs text-gray-500">So với tuần trước</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-green-500">
            <Statistic
              title="Đơn thuê"
              value={data?.data.TotalBookList || 0}
              prefix={<CalendarOutlined className="text-green-500" />}
              valueStyle={{ color: "#10b981" }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-green-500">
                <ArrowUpOutlined /> +8%
              </span>
              <span className="text-xs text-gray-500">So với tuần trước</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
            <Statistic
              title="Đơn ký gửi"
              value={data?.data.TotalConsignmentOrder || 0}
              prefix={<ContainerOutlined className="text-orange-500" />}
              valueStyle={{ color: "#f59e0b" }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-red-500">
                <ArrowDownOutlined /> -3%
              </span>
              <span className="text-xs text-gray-500">So với tuần trước</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
            <Statistic
              title="Tổng sản phẩm"
              value={data?.data.TotalProduct || 0}
              prefix={<AppstoreOutlined className="text-purple-500" />}
              valueStyle={{ color: "#8b5cf6" }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-green-500">
                <ArrowUpOutlined /> +5%
              </span>
              <span className="text-xs text-gray-500">So với tuần trước</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Revenue Section */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card 
            title="📈 Doanh thu theo thời gian" 
            className="rounded-xl shadow-sm h-full"
            extra={<Button type="link">Xem chi tiết</Button>}
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <LineChartOutlined className="text-4xl text-gray-400 mb-2" />
                <p className="text-gray-500">Biểu đồ doanh thu sẽ hiển thị tại đây</p>
                <p className="text-sm text-gray-400">Tổng doanh thu: {formatCurrency(calculateTotalRevenue())}</p>
              </div>
            </div>
            <Row gutter={[16, 16]} className="mt-4">
              <Col span={8}>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 font-semibold">{formatCurrency(getCurrentRevenue().purchase)}</div>
                  <div className="text-sm text-gray-600">Doanh thu bán hàng</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-green-600 font-semibold">{formatCurrency(getCurrentRevenue().rental)}</div>
                  <div className="text-sm text-gray-600">Doanh thu cho thuê</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-orange-600 font-semibold">{formatCurrency(getCurrentRevenue().consignment)}</div>
                  <div className="text-sm text-gray-600">Doanh thu ký gửi</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="🔥 Sản phẩm bán chạy" 
            className="rounded-xl shadow-sm h-full"
          >
            <List
              dataSource={topProducts}
              renderItem={(product, index) => (
                <List.Item>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(product.revenue)}</div>
                      <div className="text-xs text-gray-500">{product.sales} lượt bán</div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activities and Quick Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="🔄 Hoạt động gần đây" 
            className="rounded-xl shadow-sm"
            extra={<Button type="link" size="small">Xem tất cả</Button>}
          >
            <List
              dataSource={recentActivities}
              renderItem={item => (
                <List.Item>
                  <div className="flex items-start w-full">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                      item.status === 'completed' ? 'bg-green-500' :
                      item.status === 'success' ? 'bg-blue-500' :
                      item.status === 'warning' ? 'bg-orange-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium">{item.message}</div>
                      <div className="text-xs text-gray-500">{item.time}</div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title="⚡ Thống kê nhanh" 
            className="rounded-xl shadow-sm"
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{(data?.data.TotalOrders || 0) * 2}</div>
                  <div className="text-sm text-gray-600">Lượt truy cập</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{(data?.data.TotalProduct || 0) * 0.3}</div>
                  <div className="text-sm text-gray-600">Sản phẩm mới</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{(data?.data.TotalOrders || 0) * 0.15}</div>
                  <div className="text-sm text-gray-600">Đơn chờ xử lý</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{(data?.data.TotalOrders || 0) * 0.85}</div>
                  <div className="text-sm text-gray-600">Đơn hoàn thành</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
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

// export default function admin() {
//   const user = useAppContext().user;

//   const { data, isLoading } = useQuery<ResponseModel>({
//     queryKey: ["revenueStatistics", user?.token],
//     queryFn: async () => {
//       console.log("user token:", user?.token);
//       const res = await dashBoardApiRequest.getStatistics(user?.token);
//       return res;
//     },
//     enabled: !!user?.token,
//   });

//   console.log("Dashboard data:", data);
//   return (
//     <>
//       <Row gutter={[24, 0]}>
//         <CardWrapper />
//       </Row>
//     </>
//   );
// }
