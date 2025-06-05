"use client"

import { orderApiRequest } from "@/src/apiRequests/orders";
import { formatDateTime, formatTimeStringRemoveSeconds, formatTimeStringToTimestamp } from "@/src/lib/utils";
import { Button, Card, Col, message, Row, Space, Table, TableProps, Tag, Typography } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { LuSettings2 } from "react-icons/lu";
import { useAppContext } from "../../app-provider";
import dayjs from "@/src/lib/dayjs ";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { AxiosError } from "axios";

interface DataType {
    key: string;
    id: string;
    name: string;
    tag: string;
    time: string;
    imagehref: string | undefined;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Người thuê',
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
        title: 'Thời gian bắt đầu',
        dataIndex: 'time',
        key: 'time',
        render: (_, record) => (
            <>
                {record.time}
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
        render: (_, { tag }) => (
            <>
                <Tag color={
                    tag === 'CANCEL' ? 'volcano' :
                        tag.length > 5 ? 'geekblue' :
                            'green'
                }>
                    {tag.toUpperCase()}
                </Tag>
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

const defaultToDay = {
    from: dayjs().hour(1).minute(0).second(0).local().toISOString(),
    to: dayjs().hour(23).minute(0).second(0).local().toISOString(),
};
export default function StaffDashboardToDayOrder() {
    const [useData, setData] = useState<DataType[] | undefined>(undefined);
    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const { user } = useAppContext();
    const apiBody = {
        from: defaultToDay.from,
        to: defaultToDay.to,
        paging: {
            pageNum: 1,
            pageSize: 20,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            setTableLoading(true);
            if (!user) {
                message.error("Bạn cần đăng nhập để đặt trước.");
                setTableLoading(false);
                return;
            }
            try {
                const response = await bookListApiRequest.getBookListHistory(
                    apiBody,
                    user.token
                );
                if (!response || response.data === undefined || response.data.length === 0) {
                    message.error(response?.message || "Không có dữ liệu đơn hàng.");
                    setData([]);
                    setTableLoading(false);
                    return;
                }
                const data: DataType[] | undefined = response.data?.map(
                    (item: any) => ({
                        key: item.id,
                        id: item.id,
                        name: item.customer_name,
                        tag: item.status,
                        time: formatDateTime(item.from, "TIME") // Gán id vào key
                    })
                );
                if (!data || data.length === 0) {
                    message.error(response?.message || "Không có dữ liệu đơn hàng.");
                    setData([]);
                    setTableLoading(false);
                    return;
                }
                return data;

            }
            catch (error) {

                message.error("Lỗi khi tải dữ liệu đơn hàng.");

            } finally {
                setTableLoading(false);
            }
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
                        <h4 >Lịch thuê hôm nay <span>{useData?.length || 0}</span> </h4>

                    </div>
                    <Row gutter={12}>
                        <Col>
                            <Button className="text-base font-medium py-4">Tải lại</Button>
                        </Col>
                        <Col>
                            <Button className="text-base font-medium py-4" loading={false} icon={<LuSettings2 />}>Xem tất cả</Button>
                        </Col>

                    </Row>
                </div>
            </>
        )
    }
    function CardBody() {
        return (
            <>
                <Table<DataType> columns={columns} dataSource={useData} pagination={false} loading={tableLoading} />
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