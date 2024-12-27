import CardWrapper from "@/src/components/admin/dashboard/Card";
import { Row } from "antd";
import Title from "antd/es/typography/Title";

export default function admin() {
    return (
        <>
            <Row gutter={16}>
                <CardWrapper/>
            </Row>
        </>
    )
}