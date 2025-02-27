"use client"
import { Button, Card, Col, Divider, Row } from "antd";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { LuSettings2 } from "react-icons/lu";
// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
    labels: ["Đang chơi", "Đặt trước", "Khả dụng"],
    datasets: [
        {
            data: [200, 50, 100],
            backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
        },
    ],
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
};
export default function StaffDashboardRemainGame() {
    function ChartTitle() {
        return (
            <>
                <div className="flex justify-between">
                    <h4>Thống kê kho</h4>
                    <Row gutter={12}>
                        <Col>
                            <Button className="text-base font-medium py-4" loading={false} icon={<LuSettings2 />}>Tải lại</Button>
                        </Col>
                        <Col>
                            <Button className="text-base font-medium py-4">Xem tất cả</Button>
                        </Col>
                    </Row>
                </div>
            </>
        )
    }
    return (
        <>
            <Card title={ChartTitle()}>
                <Doughnut style={{ maxHeight: "300px" }} data={data} options={options} />
                <Divider style={{ borderColor: "black" }} variant="solid"> Công cụ</Divider>
                <Row gutter={24}>
                    <Col span={8}>
                        <Button className="w-full">Xem tất cả</Button>
                    </Col>
                    <Col span={8}>
                        <Button className="w-full">Xem </Button>

                    </Col>
                    <Col span={8}>
                        <Button className="w-full"></Button>

                    </Col>
                </Row>
            </Card>
        </>
    )
}