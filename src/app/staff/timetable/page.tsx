"use client"
import bookListApiRequest from "@/src/apiRequests/bookList";
import { CreateButton } from "@/src/components/admin/Button";
import { InvoicesTableSkeleton, TableSkeleton } from "@/src/components/admin/layout/skeletons";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import SearchBar from "@/src/components/admin/table/search";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, Collapse, DatePicker, Dropdown, message, Pagination, Row, Select, Space, Table, Tag, TimePicker } from "antd";
import type { CollapseProps, TableProps } from "antd"
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Suspense, useEffect, useState } from "react";
import { useAppContext } from "../../app-provider";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface DataType {
    id: string;
    customer_id: string;
    customer_name: string;
    from: number;
    to: string;
    type: number,
    rent: number;
    rent_per_hour: number;
    status: string;
}
interface PagingType {
    pageNum: number,
    pageSize: number,
    pageCount: number,
}
const statusName = ["THEO GIỜ", "THEO LƯỢT"];





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
const defaultToDay = {
    from: dayjs().hour(5).minute(0).second(0).toISOString(),
    to: dayjs().hour(23).minute(0).second(0).toISOString(),
};
export default function StaffManageTimeTable({ searchParams }: { searchParams?: { query?: string; page?: string; }; }) {
    const [useData, setData] = useState<DataType[] | undefined>(undefined);
    const [paging, setPaging] = useState<PagingType | undefined>(undefined);
    const [mode, setMode] = useState<number>(0);
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const { user } = useAppContext();
    const apiBody = {
        from: dateRange ? dateRange[0] : defaultToDay.from,
        to: dateRange ? dateRange[1] : defaultToDay.to,
        paging: {
            pageNum: searchParams?.page ?? 1,
            pageSize: 10
        }
    };
    const onChange = (value: number) => {
        setMode(value);
    }
    const handleDateChange = (date: dayjs.Dayjs | null) => {
        if (date) {
            const from = date.set("hour", 5).set("minute", 0).set("second", 0).toISOString();
            const to = date.set("hour", 23).set("minute", 0).set("second", 0).toISOString();
            setDateRange([from, to]);
        } else {
            setDateRange(null);
        }
    };
    const handleRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            const from = dates[0].set("hour", 5).set("minute", 0).set("second", 0).toISOString();
            const to = dates[1].set("hour", 23).set("minute", 0).set("second", 0).toISOString();
            setDateRange([from, to]);
        } else {
            setDateRange(null);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                message.error("Bạn cần đăng nhập để đặt trước.");
                return;
            }
            const response = await bookListApiRequest.getBookListByDate(apiBody, user.token);
            const data: DataType[] = response.data;
            setPaging(response.paging)
            return data;

        };

        fetchData().then((result) => {
            setData(result);
        });
    }, [dateRange, searchParams]);
    const onClickEnd = async (id: string) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để đặt trước.");
            return;
        }
        try {
            const response = await bookListApiRequest.endBookList(id = id, user.token);
            message.success("Đã kết toán hành động thành công");
        } catch (error) {

        }
    }
    const onClickStart = async (id: string) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để đặt trước.");
            return;
        }
        try {
            // const response = await bookListApiRequest.endBookList(id = id, user.token);
            message.success("Đã kết toán hành động thành công");
        } catch (error) {

        }
    }
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'customer_name',
            key: 'customer_name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Từ ngày',
            dataIndex: 'from',
            key: 'from',
        },
        {
            title: 'Tới ngày',
            dataIndex: 'to',
            key: 'to',
        },
        {
            title: 'Loại thuê',
            key: 'type',
            dataIndex: 'type',
            render: (_, { type }) => (
                <>
                    <Tag>{(statusName[type])}</Tag>
                </>
            ),
        },
        {
            title: 'Công Cụ',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status == "ACTIVE" ?
                        <Button color="primary" variant="dashed" onClick={() => onClickStart(record.id)}>Check</Button> : <Button color="cyan" variant="filled" onClick={() => onClickEnd(record.id)}>End</Button>
                    }
                    <Button color="red" variant="filled">Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Breadcrumb items={breadcrumb} className="pb-4" />

            <Row gutter={[16, 16]}>
                <Col span={14}>
                    <Suspense>
                        <SearchBar placeholder={"Tìm kiếm theo tên khách hàng..."} />
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
                                (<DatePicker picker="date" className="h-10" placeholder={"Chọn ngày"}
                                    onChange={handleDateChange} />) :
                                (<RangePicker picker="date" className="h-10" placeholder={["Từ ngày", "Đến ngày"]}
                                    onChange={handleRangeChange} />
                                ))}


                        </Col>
                    </Row>

                </Col>
            </Row>

            <br />
            <Table<DataType> loading={false} columns={columns} dataSource={useData} pagination={false} />
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