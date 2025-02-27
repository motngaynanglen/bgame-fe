"use client"

import { formatTimeStringRemoveSeconds, formatTimeStringToTimestamp } from "@/src/lib/utils";
import { Button, Card, Col, Row, Space, Table, TableProps, Tag, Typography } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { LuSettings2 } from "react-icons/lu";

interface DataType {
    key: string;
    name: string;
    tags: string[];
    time: string;
    imagehref: string | undefined;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Sản Phẩm',
        dataIndex: 'name',
        key: 'name',
        render: (_, record) => (
            <div className="flex justify-start">
                <Image
                    width={28}
                    height={28}
                    src={(record.imagehref) ?? '/assets/images/blog-author.png'}
                    className="rounded-full me-2"
                    alt={""}
                />
                <p>{_}</p>
            </div>
        ),
    },
    {
        title: 'Thời gian',
        dataIndex: 'time',
        key: 'time',
        render: (_, record) => (
            <>
                {formatTimeStringRemoveSeconds(record.time)}
            </>
        ),
        onFilter: (value, record) => record.name.indexOf(value as string) === 0,
        sorter: (a, b) => (formatTimeStringToTimestamp(a.time) - formatTimeStringToTimestamp(b.time)),
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Phân loại',
        key: 'tags',
        dataIndex: 'tags',
        filterMode: "menu",
        render: (_, { tags }) => (
            <>
                {tags.map((tag) => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
        filters: [
            {
                text: 'Theo giờ',
                value: 'time',
            },
            {
                text: 'Thoải mái',
                value: 'day',
            },
        ],
    },
    {
        title: <></>,
        key: 'action',
        render: (_, record) => (
            <div className="flex justify-end">
                <Button icon={<AiFillEye />}>Xem</Button>
            </div>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        time: "07:11:00",
        tags: ['nice', 'developer'],
        imagehref: undefined,
    },
    {
        key: '2',
        name: 'PHÚC THIỆN',
        time: "10:11:00",
        tags: ['loser'],
        imagehref: undefined,
    },
    {
        key: '3',
        name: 'Joe Black',
        time: "14:00:00",
        tags: ['cool', 'teacher'],
        imagehref: undefined,
    },
    {
        key: '4',
        name: 'John Brown',
        time: "09:45:00",
        tags: ['nice', 'developer'],
        imagehref: undefined,
    },
    {
        key: '5',
        name: 'Jim Green',
        time: "17:11:00",
        tags: ['loser'],
        imagehref: undefined,
    },
    {
        key: '6',
        name: 'Joe Black',
        time: "18:51:00",
        tags: ['cool', 'teacher'],
        imagehref: undefined,
    },

];
export default function StaffDashboardToDayOrder() {
    const [useData, setData] = useState<DataType[] | undefined>(undefined);

    useEffect(() => {
        const fetchData = () => {
            return new Promise<DataType[]>((resolve) => {
                setTimeout(() => {
                    resolve(data);
                }, 5000); // 3-second delay
            });
        };

        fetchData().then((result) => {
            setData(result);
        });
    }, []);
    function CardTitle() {
        return (
            <>
                <div className="flex justify-between max-h-150">
                    <div className="text-center">
                        <h4 >Lịch thuê hôm nay <span>: 14 đơn</span> </h4>

                    </div>
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
    function CardBody() {
        return (
            <>
                <Table<DataType> columns={columns} dataSource={useData} pagination={false} />
            </>
        )
    }
    return (
        <>
            <Card title={CardTitle()}>
                <CardBody />
            </Card>
        </>
    )
}