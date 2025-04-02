"use client"
import { CreateButton } from "@/src/components/admin/Button";
import { InvoicesTableSkeleton, TableSkeleton } from "@/src/components/admin/layout/skeletons";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import SearchBar from "@/src/components/admin/table/search";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, Collapse, message, Pagination, Row, Space, Table, Tag } from "antd";
import type { CollapseProps, TableProps } from "antd"
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Suspense, useEffect, useState } from "react";
import { useAppContext } from "../../app-provider";
import productApiRequest from "@/src/apiRequests/product";

interface DataType {
    key: string;
    id: string;
    product_group_ref_id: string;
    product_name: string;
    image: string;
    price: number;
    rent_price: number;
    rent_price_per_hour: number;
    sales_quantity: number;
    rent_quantity: number;
    tags: string[];
}
interface PagingType {
    pageNum: number,
    pageSize: number,
    pageCount: number,
}
const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Tên sản phẩm',
        dataIndex: 'product_name',
        key: 'product_name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Giá cơ bản',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Số lượng bán',
        dataIndex: 'sales_quantity',
        key: 'sales_quantity',
    },
    {
        title: 'Số lượng thuê',
        dataIndex: 'rent_quantity',
        key: 'rent_quantity',
    },
    // {
    //     title: 'Tags',
    //     key: 'tags',
    //     dataIndex: 'tags',
    //     render: (_, { tags }) => (
    //         <>
    //             {tags.map((tag) => {
    //                 let color = tag.length > 5 ? 'geekblue' : 'green';
    //                 if (tag === 'loser') {
    //                     color = 'volcano';
    //                 }
    //                 return (
    //                     <Tag color={color} key={tag}>
    //                         {tag.toUpperCase()}
    //                     </Tag>
    //                 );
    //             })}
    //         </>
    //     ),
    // },
    {
        title: '',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Action</a>
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
                <Row gutter={[12, 12]}>
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
export default function ManagerTableBoardgame({ searchParams }: { searchParams?: { query?: string; page?: string; }; }) {

    const [useData, setData] = useState<DataType[] | undefined>(undefined);
    const [paging, setPaging] = useState<PagingType | undefined>(undefined);
    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const { user } = useAppContext();

    const apiBody = {
        search: searchParams?.query ?? "",
        filter: [
            "string"
        ],
        paging: {
            pageNum: searchParams?.page ?? 1,
            pageSize: 10
        }
    };

    const fetchTableData = async () => {
        setTableLoading(true);
        if (!user) {
            message.error("Bạn cần đăng nhập để đặt trước.");
            setTableLoading(false);
            return;
        }
        try {
            const response = await productApiRequest.getListByRole(apiBody, user.token);
            const data: DataType[] = response.data.map((item: DataType) => ({
                ...item,
                key: item.id, // Gán id vào key
            }));
            console.log(data);
            setPaging(response.paging);
            setTableLoading(false);
            return data;
        } catch (error) {
            setTableLoading(false);
        }
    };
    useEffect(() => {

        fetchTableData().then((result) => {
            setData(result);
        });

    }, [searchParams]);
    // useEffect(() => {
    //     const fetchData = () => {
    //         return new Promise<DataType[]>((resolve) => {
    //             setTimeout(() => {
    //                 resolve(data);
    //             }, 5000); // 3-second delay
    //         });
    //     };

    //     fetchData().then((result) => {
    //         setData(result);
    //     });
    // }, []);
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
            <Table<DataType> loading={tableLoading} columns={columns} dataSource={useData} pagination={false} />
            <br />
            <AntdCustomPagination totalPages={paging?.pageCount ?? 1} />
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