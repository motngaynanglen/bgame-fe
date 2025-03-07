"use client"
import { CreateButton } from "@/src/components/admin/Button";
import { InvoicesTableSkeleton, TableSkeleton } from "@/src/components/admin/layout/skeletons";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import SearchBar from "@/src/components/admin/table/search";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, Collapse, Pagination, Row, Space, Table, Tag } from "antd";
import type { CollapseProps, TableProps } from "antd"
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
                <Row gutter={[12,12]}>
                    <Col>
                        <Button>
                            Thêm mới sản phẩm chưa có sẵn
                        </Button>
                    </Col>
                    <Col>
                        <Button>
                            Thêm mới chỉ là sản phẩm mẫu (0 số lượng)
                        </Button>
                    </Col>
                    <Col>
                        <Button>
                            Bổ sung số lượng sản phẩm theo mẫu có sẵn
                        </Button>
                    </Col>
                </Row>
            </>
        ),

    },
]
export default function ManagerTableBoardgame() {
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
                <Col span={16}>
                    <Suspense>
                        <SearchBar placeholder={"Tìm kiếm theo mã sản phẩm..."} />
                    </Suspense>
                </Col>
                <Col span={8}>
                    <Collapse items={AddButtons}>

                    </Collapse >

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