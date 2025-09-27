import React from 'react';
import { Row, Col, Typography, Divider, Card } from 'antd';
import TableCard from './TableCard';
import { Table } from './types';
import Clock from './Clock';

const { Title } = Typography;

interface FloorPlanProps {
    tables: Table[];
    onSelectTable: (table: Table) => void;
    selectedTableId: string | undefined;
}

export default function FloorPlan({ tables, onSelectTable, selectedTableId }: FloorPlanProps) {
    return (
        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={5}>Theo dõi bàn thời gian thực</Title>
                    <Clock />

                </div>
            }>
            <Divider className='!mt-0 !mb-3'>Sơ đồ bàn</Divider>

            <div style={{ flex: 1 }}> {/* Đảm bảo div này giãn nở */}
                <Row gutter={[24, 24]} style={{ marginTop: '20px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '10px' }}>
                    {tables.map(table => (
                        // Điều chỉnh kích thước cột để các bàn nằm ngang
                        // ví dụ: md={6} cho bàn 4 người, md={8} cho bàn 8 người hoặc dùng flex basis
                        <Col key={table.TableID} style={{ flexShrink: 0 }}>
                            <TableCard
                                table={table}
                                onClick={() => onSelectTable(table)}
                                isSelected={table.TableID === selectedTableId}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        </Card>
    );
}