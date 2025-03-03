import { Col, Row } from "antd";
import CardWrapper from "./card";
import StaffDashboardRemainGame from "./remainGameChart";
import StaffDashboardToDayOrder from "./todayOrder";
import { Suspense } from "react";

export default function StaffManageDashboard() {
    return (
        <>
            <Row gutter={[24, 0]}>
                <Suspense>
                    <CardWrapper />
                </Suspense>
            </Row>
            <Row gutter={[24, 0]}>
                <Col span={10}>
                    <Suspense>
                        <StaffDashboardRemainGame />
                    </Suspense>
                </Col>
                <Col span={14}>
                    <Suspense>
                        <StaffDashboardToDayOrder />
                    </Suspense>

                </Col>
            </Row>
        </>
    )
}