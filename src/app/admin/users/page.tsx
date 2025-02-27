
"use client"
import { CreateButton } from "@/src/components/admin/Button";
import { InvoicesTableSkeleton, TableSkeleton } from "@/src/components/admin/layout/skeletons";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import SearchBar from "@/src/components/admin/table/search";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, Pagination, Row, Space, Table, Tag } from "antd";
import type { TableProps } from "antd"
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Suspense, useEffect, useState } from "react";

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
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
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
    {
        key: '4',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '5',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '6',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },

];

const role: string = "admin";
const baseUrl: string = "/" + role + "/" + "users";
const createUrl: string = baseUrl + "/" + "create";

const breadcrumb: BreadcrumbItemType[] =
    [
        {
            href: '/admin',
            title: <HomeOutlined />,
        },
        {
            // href: baseUrl,
            title: (
                <>
                    <UserOutlined />
                    <span>Users List</span>
                </>
            ),
        },

    ];



export default function AdminTableUser({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
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
    return (
        <>
            <Breadcrumb items={breadcrumb} className="pb-4" />
            <Row gutter={[16, 16]}>
                <Col flex={"auto"}>
                    <Suspense>
                        <SearchBar placeholder={"searching something..."} />
                    </Suspense>
                </Col>
                <Col flex={"150px"}>
                    <CreateButton link={createUrl} title="add" />
                </Col>
            </Row>
            <br />
            {useData === undefined ? (
                <TableSkeleton />
            ) : (
                <>
                    <Table<DataType> columns={columns} dataSource={useData} pagination={false} />
                    <br />
                    <AntdCustomPagination totalPages={20} />
                </>
            )}
        </>
    )
}