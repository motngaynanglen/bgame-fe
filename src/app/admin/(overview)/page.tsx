import { Card, Col, Row } from "antd";
import Title from "antd/es/typography/Title";

export default function admin() {
    return (
        <>
            <Row gutter={16}>
                <Col span={6}>
                    <Card loading={false} bordered={false}>
                        <div className="number">
                            <Row align="middle" gutter={[24, 0]}>
                                <Col xs={18}>
                                    <span>{"ok"}</span>
                                    <Title level={3}>
                                        {"c.title"} <small className={".bnb"}>{"c.persent"}</small>
                                    </Title>
                                </Col>
                                <Col xs={6}>
                                    <div className="icon-box">{"c.icon"}</div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Card title" bordered={false}>
                        Card content
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Card title" bordered={false}>
                        Card content
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Card title" bordered={false}>
                        Card content
                    </Card>
                </Col>
            </Row>
        </>
    )
}