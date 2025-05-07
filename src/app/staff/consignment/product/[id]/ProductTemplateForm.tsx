import React, { useState } from 'react';
import {
    Row,
    Col,
    Card,
    Image,
    Tag,
    Typography,
    Button,
    Space,
    Divider,
    Collapse,
    Empty
} from 'antd';
import {
    EditOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ProductResType } from '@/src/schemaValidations/product.schema';
import { formatVND } from '@/src/lib/utils';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export default function ProductDetailView({ product }:{ product: ProductResType }){
    const [showDetails, setShowDetails] = useState(true);
    if (!product) {
        return null;
    }
    const images = product.image?.split('||').filter(Boolean) || [];

    // Format giá tiền và xử lý trường null
    const formatField = (value: any) => {
        if (value === null || value === undefined || value === '') {
            return (
                <Text type="warning">
                    <ExclamationCircleOutlined /> Cần bổ sung
                </Text>
            );
        }
        return typeof value === 'number'
            ? formatVND(value)
            : value;
    };

    // Thông tin cơ bản
    const getConditionTag = (condition: string) => {
        switch (condition) {
            case 'SALES_PRODUCT':
                return { color: 'blue', label: 'Bán' };
            case 'RENT_PRODUCT':
                return { color: 'purple', label: 'Cho thuê' };
            default:
                return { color: 'orange', label: 'Mẫu' };
        }
    };
    const conditionTag = getConditionTag(product.condition);

    const basicInfo = [
        { label: 'Mã sản phẩm', value: product.code, copyable: true },
        { label: 'Tên sản phẩm', value: product.product_name },
        {
            label: 'Loại sản phẩm',
            value: (
                <Tag color={conditionTag.color}> {conditionTag.label}</Tag>
            )
        },
        {
            label: 'Trạng thái',
            value: (
                <Tag color={product.status === 'ACTIVE' ? 'green' : 'red'}>
                    {product.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                </Tag>
            )
        },
    ];

    // Thông tin giá
    const priceInfo = [
        { label: 'Giá bán', value: formatField(product.price) },
        { label: 'Giá thuê', value: formatField(product.rent_price) },
        { label: 'Giá thuê theo giờ', value: formatField(product.rent_price_per_hour) },
    ];

    // Thông tin bổ sung
    const additionalInfo = [
        { label: 'Nhà xuất bản', value: formatField(product.publisher) },
        { label: 'Độ tuổi', value: formatField(product.age) },
        { label: 'Số người chơi tối thiểu', value: formatField(product.number_of_player_min) },
        { label: 'Số người chơi tối đa', value: formatField(product.number_of_player_max) },
        { label: 'Độ khó', value: formatField(product.hard_rank) },
    ];
    const DetailsHeader = () => {
        return (
            /* Header với nút toggle */
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={3}>Chi tiết sản phẩm</Title>
                <Button
                    type="text"
                    icon={showDetails ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? 'Ẩn chi tiết' : 'Hiện chi tiết'}
                </Button>
            </div>

        )
    }
    return (
        <div style={{ margin: '0 auto', }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Collapse activeKey={showDetails ? ['details'] : []} bordered={false}>
                    <Panel key="details" showArrow={false} header={<DetailsHeader />}>
                        <Row gutter={24} align="stretch">
                            {/* Cột hình ảnh */}
                            <Col xs={24} md={12}>
                                <Card style={{ height: '100%' }}>
                                    {images.length > 0 ? (
                                        <>
                                            <Image.PreviewGroup items={images}>
                                                <Image
                                                    src={images[0]}
                                                    alt="Ảnh đại diện"
                                                    style={{
                                                        width: '100%',
                                                        height: 300,
                                                        objectFit: 'contain',
                                                        borderRadius: 8,
                                                        marginBottom: 16
                                                    }}
                                                />
                                            </Image.PreviewGroup>

                                            <div style={{ marginTop: 'auto' }}>
                                                <Image.PreviewGroup items={images}>
                                                    <Row gutter={8}>
                                                        {images.slice(1).map((img, index) => (
                                                            <Col key={index} span={6}>
                                                                <Image
                                                                    src={img}
                                                                    alt={`Ảnh ${index + 2}`}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: 80,
                                                                        objectFit: 'cover',
                                                                        borderRadius: 4,
                                                                        cursor: 'pointer'
                                                                    }}
                                                                />
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </Image.PreviewGroup>
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Empty
                                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                description="Không có hình ảnh"
                                            />
                                            <Text type="warning" style={{ marginTop: 8 }}>
                                                <ExclamationCircleOutlined /> Cần bổ sung hình ảnh
                                            </Text>
                                        </div>
                                    )}
                                    <Divider style={{ margin: '8px 0' }} />
                                    {/* Mô tả sản phẩm */}
                                    <div>
                                        <Title level={5} style={{ marginBottom: 16 }}>Mô tả sản phẩm </Title>
                                        {product.description ? (
                                            <Card
                                                title="Mô tả sản phẩm"
                                                style={{ marginTop: 24 }}
                                            >
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                                    style={{
                                                        lineHeight: 1.8,
                                                        wordBreak: 'break-word'
                                                    }}

                                                />

                                            </Card>
                                        ) : (formatField(product.description))}
                                    </div>

                                </Card>
                            </Col>

                            {/* Cột thông tin */}
                            <Col xs={24} md={12}>
                                <Card style={{ height: '100%' }}>
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        {/* Thông tin cơ bản */}
                                        <div>
                                            <Title level={5} style={{ marginBottom: 16 }}>Thông tin chung</Title>
                                            {basicInfo.map((item, index) => (
                                                <Paragraph key={index} style={{ marginBottom: 12 }}>
                                                    <Text strong>{item.label}: </Text>
                                                    {item.copyable ? (
                                                        <Text copyable>{item.value}</Text>
                                                    ) : (
                                                        <Text>{item.value}</Text>
                                                    )}
                                                </Paragraph>
                                            ))}
                                        </div>

                                        <Divider style={{ margin: '8px 0' }} />

                                        {/* Thông tin giá */}
                                        <div>
                                            <Title level={5} style={{ marginBottom: 16 }}>Thông tin giá</Title>
                                            {priceInfo.map((item, index) => (
                                                <Paragraph key={index} style={{ marginBottom: 12 }}>
                                                    <Text strong>{item.label}: </Text>
                                                    <Text>{item.value}</Text>
                                                </Paragraph>
                                            ))}
                                        </div>

                                        <Divider style={{ margin: '8px 0' }} />

                                        {/* Thông tin bổ sung */}
                                        <div>
                                            <Title level={5} style={{ marginBottom: 16 }}>Thông tin bổ sung</Title>
                                            {additionalInfo.map((item, index) => (
                                                <Paragraph key={index} style={{ marginBottom: 12 }}>
                                                    <Text strong>{item.label}: </Text>
                                                    <Text>{item.value}</Text>
                                                </Paragraph>
                                            ))}
                                        </div>

                                        {/* Nút chỉnh sửa */}
                                        <div style={{ marginTop: 'auto', textAlign: 'right' }}>
                                            <Button
                                                type="primary"
                                                icon={<EditOutlined />}
                                                onClick={() => window.location.href = `/products/edit/${product.id}`}
                                            >
                                                Chỉnh sửa sản phẩm
                                            </Button>
                                        </div>
                                    </Space>
                                </Card>
                            </Col>
                        </Row>


                    </Panel>
                </Collapse>
            </Space>
        </div>
    );
};

