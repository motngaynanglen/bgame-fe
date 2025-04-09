"use client";
import { CreateButton } from "@/src/components/admin/Button";
import { HomeOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, message, Row, Space, Table, TableProps } from "antd";
import Breadcrumb, { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Suspense, useEffect, useState } from "react";
import SearchBar from "@/src/components/admin/table/search";
import { PagingBodyType, PagingResType } from "@/src/schemaValidations/common.schema";
import { useAppContext } from "../../app-provider";
import storeApiRequest from "@/src/apiRequests/stores";
import { TableSkeleton } from "@/src/components/admin/layout/skeletons";
import AntdCustomPagination from "@/src/components/admin/table/pagination";



const role: string = "admin";
const baseUrl: string = "/" + role + "/" + "stores";
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
                    <span>Board Game List</span>
                </>
            ),
        },

    ];

interface DataType {
    id: string;
    key: string;
    code: string;
    store_name: string;
    address: string;
    image: string;
    latitude: string;
    longtitude: string;
    email: string;
    hotline: string;
    status: string;
}
const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Mã',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: 'Tên cửa hàng',
        dataIndex: 'store_name',
        key: 'store_name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: 'address',
        render: (text) => <span className="overflow-hidden text-ellipsis truncate">{text}</span>,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        // render: (text) => <a>{text}</a>,
    },
    {
        title: 'Điện thoại',
        dataIndex: 'hotline',
        key: 'hotline',
        // render: (text) => <a>{text}</a>,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        // render: (text) => <a>{text}</a>,
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <>
                <Row gutter={[12, 12]}>
                    <Col span={12}>
                        <Button color="primary" variant="dashed" >View</Button>
                    </Col>
                    <Col span={12}>
                        <Button color="green" variant="filled" >Update</Button>
                    </Col>

                    {/* {(() => {
                        switch (record.status) {
                            case "ACTIVE":
                                return (
                                    <Col span={8} className="flex justify-center">
                                        <Button color="red" variant="filled">DEACTIVE</Button>;
                                    </Col>);
                            case "DEACTIVE":
                                return (
                                    <Col span={8} className="flex justify-center">
                                        <Button color="yellow" variant="filled">ACTIVE</Button>;
                                    </Col>);
                            default:
                                return null;
                        }
                    })()} */}


                </Row>
            </>
        ),
    },
];

export default function AdminTableStore({
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

    const apiBody = {
        search: searchParams?.query ?? "",
        filter: [
            "string"
        ],
        // paging: {
        //     pageNum: searchParams?.page ? parseInt(searchParams.page) : 1,
        //     pageSize: 5
        // }
    };
    const fetchTableData = async () => {
        setTableLoading(true);
        // if (!user) {
        //     message.error("Bạn cần đăng nhập để đặt trước.");
        //     setTableLoading(false);
        //     return;
        // }
        try {
            // const response = await userApiRequest.getListByAdmin(apiBody, user.token);
            const response = await storeApiRequest.getList(apiBody);
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
                    <CreateButton link={createUrl} title="Add" />
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
    );
}