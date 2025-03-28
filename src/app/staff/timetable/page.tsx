"use client"
import bookListApiRequest from "@/src/apiRequests/bookList";
import { CreateButton } from "@/src/components/admin/Button";
import { InvoicesTableSkeleton, TableSkeleton } from "@/src/components/admin/layout/skeletons";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import SearchBar from "@/src/components/admin/table/search";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, Collapse, DatePicker, Dropdown, Pagination, Row, Select, Space, Table, Tag, TimePicker } from "antd";
import type { CollapseProps, TableProps } from "antd"
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Suspense, useEffect, useState } from "react";


const { RangePicker } = DatePicker;

interface DataType {
    id: string;
    customer_id: string;
    from: number;
    to: string;
    type: number,
    rent: number;
    rent_per_hour: number;
    status: string;
}
const statusName = ["hours", "date"]

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Customer_id',
        dataIndex: 'customer_id',
        key: 'customer_id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'From',
        dataIndex: 'from',
        key: 'from',
    },
    {
        title: 'To',
        dataIndex: 'to',
        key: 'to',
    },
    {
        title: 'Type',
        key: 'type',
        dataIndex: 'type',
        render: (_, { type }) => (
            <>
                <Tag>{(statusName[type - 1]).toLocaleUpperCase()}</Tag>
            </>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>llll</a>
                <a>Delete</a>
            </Space>
        ),
    },
];


const role: string = "manager";
const baseUrl: string = "/" + role + "/" + "boardgames";
const createUrl: string = baseUrl + "/" + "create";

const breadcrumb: BreadcrumbItemType[] =
    [
        {
            href: '/manager',
            title: <HomeOutlined />,
        },
        {
            // href: baseUrl,
            title: (
                <>
                    <UserOutlined />
                    <span>Board Game List</span>
                </>
            ),
        },

    ];

const AddButtons: CollapseProps['items'] = [
    {
        key: '1',
        label: <p className="p-0 m-0">Bổ xung sản phẩm mới</p>,
        children: (
            <>

            </>
        ),

    },
]
const apiBody = {
    from: new Date(),
    to: new Date()
}
export default function StaffManageTimeTable() {
    const [useData, setData] = useState<DataType[] | undefined>(undefined);
    const [mode, setMode] = useState<number>(0);
    const onChange = (value: number) => {
        setMode(value);
    }
    useEffect(() => {
        const fetchData = async () => {
            const response = await bookListApiRequest.getBookListByDate(apiBody);
            const data: DataType[] = response.data;
            return data;

        };

        fetchData().then((result) => {
            setData(result);
        });
    }, []);
    return (
        <>
            <Breadcrumb items={breadcrumb} className="pb-4" />

            <Row gutter={[16, 16]}>
                <Col span={14}>
                    <Suspense>
                        <SearchBar placeholder={"Tìm kiếm theo mã sản phẩm..."} />
                    </Suspense>
                </Col>
                <Col span={10}>
                    <Row gutter={[12, 12]}>
                        <Col >
                            <Select defaultValue={0} options={[
                                { value: 0, label: <span>Theo ngày </span> },
                                { value: 1, label: <span>Theo khoảng</span> }
                            ]} className="w-30 h-10 me-4" onChange={(value) => onChange(value)} />
                            {(mode == 0 ?
                                (<DatePicker picker="date" className="h-10" placeholder={"Chọn ngày"} />) :
                                (<RangePicker picker="date" className="h-10" placeholder={["Từ ngày", "Đến ngày"]} />))}


                        </Col>
                    </Row>

                </Col>
            </Row>

            <br />
            <Table<DataType> loading={false} columns={columns} dataSource={useData} pagination={false} />
            <br />
            <AntdCustomPagination totalPages={2}/>
            {/* {useData === undefined ? (
                <TableSkeleton />
            ) : (
                <>
                    <Table<DataType> loading={true} columns={columns} dataSource={useData} pagination={false} />
                    <br />
                    <AntdCustomPagination totalPages={20} />
                </>
            )} */}
        </>
    )
}