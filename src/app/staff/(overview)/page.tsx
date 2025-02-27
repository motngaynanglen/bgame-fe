import { Col, Row } from "antd";
import CardWrapper from "./card";
import StaffDashboardRemainGame from "./remainGame";
import StaffDashboardToDayOrder from "./todayOrder";

export default function StaffManageDashboard() {
    return (
        <>
            <Row gutter={[24, 0]}>
                <CardWrapper />
            </Row>
            <Row gutter={[24, 0]}>
                <Col span={10}>
                    <StaffDashboardRemainGame />
                </Col>
                <Col span={14}>
                    <StaffDashboardToDayOrder />
                </Col>
            </Row>
        </>
    )
}