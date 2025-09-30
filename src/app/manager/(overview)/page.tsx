"use client";
import React, { useState } from "react";
import {
  Card,
  Statistic,
  DatePicker,
  Select,
  Row,
  Col,
  Table,
  Progress,
  Button,
  List,
  Typography,
} from "antd";
import {
  ShoppingCartOutlined,
  CalendarOutlined,
  DollarOutlined,
  ContainerOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { inter } from "@/src/fonts/fonts";
import { dashBoardApiRequest } from "@/src/apiRequests/dashBoard";
import { useAppContext } from "../../app-provider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import layout from "../../(overview)/layout";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  // Title,
  Tooltip,
  Legend,
  ArcElement
);

const { Title, Text } = Typography;

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

type TimeRangeType = "day" | "weekly" | "monthly";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ManagerDashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeType>("day");
  const [dateRange, setDateRange] = useState([]);
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

  const dashboardData = data?.data;

  // console.log("Dashboard data:", data);

  // const revenueData: Record<
  //   TimeRangeType,
  //   { purchase: number; rental: number }
  // > = {
  //   day: {
  //     purchase: 2500000,
  //     rental: 1200000,
  //   },
  //   weekly: {
  //     purchase: 12500000,
  //     rental: 6500000,
  //   },
  //   monthly: {
  //     purchase: 48500000,
  //     rental: 22500000,
  //   },
  // };
  const revenueData: Record<TimeRangeType, RevenueData> = {
    day: { purchase: 2500000, rental: 1200000, consignment: 500000 },
    weekly: { purchase: 12500000, rental: 6500000, consignment: 2500000 },
    monthly: { purchase: 48500000, rental: 22500000, consignment: 8500000 },
  };
  const getCurrentRevenue = () => {
    return revenueData[timeRange] || revenueData.day;
  };

  const calculateTotalRevenue = (): number => {
    const current = getCurrentRevenue();
    return current.purchase + current.rental + current.consignment;
  };

  const recentActivities = [
    {
      id: 1,
      type: "order",
      message: "Đơn hàng #ORD-001 đã hoàn thành",
      time: "5 phút trước",
      status: "completed",
    },
    {
      id: 2,
      type: "payment",
      message: "Thanh toán thành công #PAY-002",
      time: "15 phút trước",
      status: "success",
    },
    {
      id: 3,
      type: "product",
      message: "Sản phẩm mới đã được thêm",
      time: "1 giờ trước",
      status: "info",
    },
    {
      id: 4,
      type: "alert",
      message: "Tồn kho sản phẩm XYZ sắp hết",
      time: "2 giờ trước",
      status: "warning",
    },
  ];  

  const recentOrders = [
    {
      key: "1",
      orderId: "ORD-001",
      type: "Thuê",
      customer: "Nguyễn Văn A",
      amount: 350000,
      status: "completed",
      date: "2024-01-15",
    },
    {
      key: "2",
      orderId: "ORD-002",
      type: "Mua",
      customer: "Trần Thị B",
      amount: 1200000,
      status: "processing",
      date: "2024-01-15",
    },
    {
      key: "3",
      orderId: "ORD-003",
      type: "Ký gửi",
      customer: "Lê Văn C",
      amount: 500000,
      status: "pending",
      date: "2024-01-14",
    },
  ];

  //chart cricle

  const pieData = {
    // labels: ["Order", "Book List", "Consignment"],
    datasets: [
      {
        data: getCurrentRevenue()
          ? [
              getCurrentRevenue().purchase,
              getCurrentRevenue().rental,
              getCurrentRevenue().consignment,
            ]
          : [0, 0, 0],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: true, text: "Tỷ lệ doanh thu" },
      layout: { padding: 20 },
    },
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <span
          className={
            type === "Thuê"
              ? "text-blue-600"
              : type === "Mua"
              ? "text-green-600"
              : "text-orange-600"
          }
        >
          {type}
        </span>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `${amount.toLocaleString("vi-VN")}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={
            status === "completed"
              ? "text-green-600"
              : status === "processing"
              ? "text-blue-600"
              : "text-orange-600"
          }
        >
          {status === "completed"
            ? "Hoàn thành"
            : status === "processing"
            ? "Đang xử lý"
            : "Chờ xử lý"}
        </span>
      ),
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const topProducts = [
    { name: "Catan", sales: 45, revenue: 22500000 },
    { name: "Ticket to Ride", sales: 32, revenue: 16000000 },
    { name: "Codenames", sales: 28, revenue: 8400000 },
    { name: "7 Wonders", sales: 25, revenue: 12500000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2} className="!mb-1">
              Dashboard Quản trị cửa hàng
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
              <Option value="day">Hôm nay</Option>
              <Option value="weekly">Tuần này</Option>
              <Option value="monthly">Tháng này</Option>
            </Select>
            {/* <RangePicker /> */}
            {/* <Button icon={<ReloadOutlined />}>Làm mới</Button>
            <Button type="primary" icon={<DownloadOutlined />}>
              Xuất báo cáo
            </Button> */}
          </div>
        </div>
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
              value={dashboardData?.TotalBookList}
              prefix={<CalendarOutlined className="text-blue-500" />}
              valueStyle={{ color: "#3b82f6" }}
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
              value={dashboardData?.TotalConsignmentOrder}
              prefix={<ShoppingCartOutlined className="text-green-500" />}
              valueStyle={{ color: "#10b981" }}
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
              value={dashboardData?.TotalOrders}
              prefix={<ContainerOutlined className="text-orange-500" />}
              valueStyle={{ color: "#f59e0b" }}
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
              // value={
              //   dashboardData.totalPurchaseRevenue +
              //   dashboardData.totalRentalRevenue
              // }
              value={data?.data.TotalProduct || 0}
              prefix={<DollarOutlined className="text-purple-500" />}
              valueStyle={{ color: "#8b5cf6" }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <div className="mt-2 text-sm text-gray-500">
              <ArrowUpOutlined className="text-green-500 mr-1" />+
              {/* {dashboardData.revenueChange}% so với tuần trước */}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Revenue Section */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card
            title="Doanh thu theo thời gian"
            className="rounded-xl shadow-sm h-full"
            // extra={<Button type="link">Xem chi tiết</Button>}
          >
            <div className="h-auto flex items-center justify-center  rounded-lg">
              <div className="text-center">
                {/* <LineChartOutlined className="text-4xl text-gray-400 mb-2" /> */}
                {/* <p className="text-gray-500">Biểu đồ doanh thu sẽ hiển thị tại đây</p> */}
                <Pie data={pieData} options={pieOptions}/>
                <p className="text-sm text-gray-400">
                  Tổng doanh thu: {formatCurrency(calculateTotalRevenue())}
                </p>
              </div>
            </div>
            <Row gutter={[16, 16]} className="mt-4">
              <Col span={8}>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 font-semibold">
                    {formatCurrency(getCurrentRevenue().purchase)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Doanh thu bán hàng
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-green-600 font-semibold">
                    {formatCurrency(getCurrentRevenue().rental)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Doanh thu cho thuê
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-orange-600 font-semibold">
                    {formatCurrency(getCurrentRevenue().consignment)}
                  </div>
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
                      <div className="font-semibold">
                        {formatCurrency(product.revenue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.sales} lượt bán
                      </div>
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
            extra={
              <Button type="link" size="small">
                Xem tất cả
              </Button>
            }
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <div className="flex items-start w-full">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                        item.status === "completed"
                          ? "bg-green-500"
                          : item.status === "success"
                          ? "bg-blue-500"
                          : item.status === "warning"
                          ? "bg-orange-500"
                          : "bg-gray-500"
                      }`}
                    />
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
          <Card title="⚡ Thống kê nhanh" className="rounded-xl shadow-sm">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">
                    {(data?.data.TotalOrders || 0) * 2}
                  </div>
                  <div className="text-sm text-gray-600">Lượt truy cập</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">
                    {(data?.data.TotalProduct || 0) * 0.3}
                  </div>
                  <div className="text-sm text-gray-600">Sản phẩm mới</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">
                    {(data?.data.TotalOrders || 0) * 0.15}
                  </div>
                  <div className="text-sm text-gray-600">Đơn chờ xử lý</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">
                    {(data?.data.TotalOrders || 0) * 0.85}
                  </div>
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
