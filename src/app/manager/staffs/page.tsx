
"use client"
import { CreateButton } from "@/src/components/admin/Button";
import { InvoicesTableSkeleton, TableSkeleton } from "@/src/components/admin/layout/skeletons";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import SearchBar from "@/src/components/admin/table/search";
import dayjs from "@/src/lib/dayjs ";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, message, Pagination, Row, Space, Table, Tag } from "antd";
import type { TableProps } from "antd"
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Suspense, useEffect, useState } from "react";
import { useAppContext } from "../../app-provider";
import { PagingBodyType, PagingResType } from "@/src/schemaValidations/common.schema";
import userApiRequest from "@/src/apiRequests/user";
import { formatDateTime } from "@/src/lib/utils";

interface DataType {
    id: string,
    code: string,
    full_name: string,
    date_of_birth: dayjs.Dayjs,
    image: string,
    gender: string,
    status: string,
    username: string,
    role: string,
    email: string,
    phone_number: string
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Tên',
        dataIndex: 'full_name',
        key: 'full_name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Mã',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: 'Năm sinh',
        dataIndex: 'date_of_birth',
        key: 'date_of_birth',
        render: (text) => <span>{formatDateTime(text, "DATE")}</span>,
    },
    {
        title: 'Vai trò',
        key: 'role',
        dataIndex: 'role',
        render: (text) => {
            let color = text.length > 5 ? 'geekblue' : 'green';
            if (text === 'MANAGER') {
                color = 'volcano';
            }
            return (
                <Tag color={color} key={text}>
                    {text.toUpperCase()}
                </Tag>
            );
        },
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <>
                <Row gutter={[12, 12]}>
                    <Col span={12}>
                        <Button color="primary" variant="dashed" >View {record.username}</Button>

                    </Col>
                    <Col span={12} className="flex justify-center">
                        {(() => {
                            switch (record.status) {
                                case "ACTIVE":
                                    return <Button color="red" variant="filled">DEACTIVE</Button>;
                                case "DEACTIVE":
                                    return (
                                        <Space className="flex justify-between">
                                            <Button color="yellow" variant="filled" >ACTIVE</Button>
                                        </Space>
                                    );
                                default:
                                    return null;
                            }
                        })()}
                    </Col>

                </Row>
            </>
        ),
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



export default function ManagerTableStaff({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const [useData, setData] = useState<DataType[] | undefined>(undefined);
    const [paging, setPaging] = useState<PagingResType | undefined>(undefined);
    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const { user } = useAppContext();

    const apiBody: PagingBodyType = {
        // search: searchParams?.query ?? "",
        // filter: [
        //     "string"
        // ],
        paging: {
            pageNum: searchParams?.page ? parseInt(searchParams.page) : 1,
            pageSize: 5
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
            const response = await userApiRequest.getListByAdmin(apiBody, user.token);
            // const response = await userApiRequest.getListByManager(apiBody);
            const data: DataType[] = response.data.map((item: DataType) => ({
                ...item,
                key: item.id, // Gán id vào key
            }));
            console.log(data);
            setPaging(response.paging);

            return data;
        } catch (error) {
            message.error(error as string);
        } finally {
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
                    <Table<DataType> columns={columns} dataSource={useData ?? []} pagination={false} loading={tableLoading}/>
                    <br />
                    <AntdCustomPagination totalPages={paging?.paging.pageCount ?? 1} />
                </>
            )}
        </>
    )
}