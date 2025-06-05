"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { CreateButton } from "@/src/components/admin/Button";
import {
  InvoicesTableSkeleton,
  TableSkeleton,
} from "@/src/components/admin/layout/skeletons";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import SearchBar from "@/src/components/admin/table/search";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Dropdown,
  message,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag,
  TimePicker,
} from "antd";
import type { CollapseProps, TableProps } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Suspense, useEffect, useState } from "react";
import { useAppContext } from "../../app-provider";
import { formatDateTime, formatTimeStringRemoveSeconds } from "@/src/lib/utils";
import dayjs from "@/src/lib/dayjs ";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { useRouter } from "next/navigation";
const { RangePicker } = DatePicker;

interface DataType {
  key: string;
  id: string;
  customer_id: string;
  customer_name: string;
  date: string;
  from: string;
  to: string;
  type: number;
  rent: number;
  rent_per_hour: number;
  status: string;
}
interface PagingType {
  pageNum: number;
  pageSize: number;
  pageCount: number;
}
const statusName = ["THEO GIỜ", "THEO LƯỢT"];

const role: string = "manager";
const baseUrl: string = "/" + role + "/" + "boardgames";
const createUrl: string = baseUrl + "/" + "create";



const breadcrumb: BreadcrumbItemType[] = [
  {
    href: "/manager",
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

const AddButtons: CollapseProps["items"] = [
  {
    key: "1",
    label: (
      <p key="add-button" className="p-0 m-0">
        Bổ xung sản phẩm mới
      </p>
    ),
    children: <></>,
  },
];
const options: CheckboxGroupProps<string>["options"] = [
  { label: <span key="all">Tất cả</span>, value: "all" },
  { label: <span key="days">Thuê theo ngày</span>, value: "days" },
  { label: <span key="hours">Thuê theo giờ</span>, value: "hours" },
];
const defaultToDay = {
  from: dayjs().hour(1).minute(0).second(0).local().toISOString(),
  to: dayjs().hour(23).minute(0).second(0).local().toISOString(),
};
export default function StaffManageTimeTable({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"days" | "hours">(
    "days"
  );
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const [useData, setData] = useState<DataType[] | undefined>(undefined);
  const [paging, setPaging] = useState<PagingType | undefined>(undefined);
  const [mode, setMode] = useState<number>(0);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const { user } = useAppContext();
  const router = useRouter();
  const apiBody = {
    from: dateRange ? dateRange[0] : defaultToDay.from,
    to: dateRange ? dateRange[1] : defaultToDay.to,
    paging: {
      pageNum: searchParams?.page ?? 1,
      pageSize: 10,
    },
  };
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpenModal(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };
  const ExtendBookModal = () => {
    return (
      <Modal
        title={`Đặt trước ko ok`}
        centered
        open={openModal}
        onOk={() => handleOk}
        footer={[
          <Button
            key={"modal-button-1"}
            // onClick={handleSubmit}
            disabled={!selectedDate}
          >
            Đặt trước
          </Button>,
        ]}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Radio.Group
          options={options}
          defaultValue="days"
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => setSelectedOption(e.target.value)}
        />
        <p className="mt-4">Chọn thời gian thuê: </p>
        {selectedOption === "days" && (
          <div>
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              // disabledDate={disabledDate}
              // disabledTime={disabledDateTime}
              showTime={{ format: "HH:mm" }}
              minuteStep={10}
              onChange={(date) => setSelectedDate(date ? date : null)}
            />
            <p className="text-lg text-green-800 mt-4">
              {/* Phí thuê: {rent_price} */}
            </p>
          </div>
        )}
      </Modal>
    );
  };
  const onChange = (value: number) => {
    setMode(value);
  };
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const from = date
        .set("hour", 1)
        .set("minute", 0)
        .set("second", 0)
        .local()
        .toISOString();
      const to = date
        .set("hour", 23)
        .set("minute", 0)
        .set("second", 0)
        .toISOString();
      setDateRange([from, to]);
    } else {
      setDateRange(null);
    }
  };
  const handleRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    if (dates && dates[0] && dates[1]) {
      const from = dates[0]
        .set("hour", 1)
        .set("minute", 0)
        .set("second", 0)
        .local()
        .toISOString();
      const to = dates[1]
        .set("hour", 23)
        .set("minute", 0)
        .set("second", 0)
        .local()
        .toISOString();
      setDateRange([from, to]);
    } else {
      setDateRange(null);
    }
  };
  const fetchTableData = async () => {
    setTableLoading(true);
    if (!user) {
      message.error("Bạn cần đăng nhập để đặt trước.");
      setTableLoading(false);
      return;
    }
    const response = await bookListApiRequest.getBookListByDate(
      apiBody,
      user.token
    );
    const data: DataType[] | undefined = response.data?.map(
      (item: DataType) => ({
        ...item,
        key: item.id, // Gán id vào key
      })
    );
    console.log(data);
    setPaging(response.paging);
    setTableLoading(false);
    return data;
  };
  useEffect(() => {
    fetchTableData().then((result) => {
      setData(result);
    });
  }, [dateRange, searchParams]);
  const onClickEnd = async (id: string) => {
    const body = {
      bookListId: id,
    };
    if (!user) {
      message.error("Bạn cần đăng nhập để đặt trước.");
      return;
    }
    try {
      const response = await bookListApiRequest.endBookList(body, user.token);
      fetchTableData().then((result) => {
        setData(result);
      });
      message.success("Đã kết toán hành động thành công");
    } catch (error) {
      message.error("Kết toán hành động thất bại");
    }
  };
  const onClickExtend = async (id: string) => {
    const body = {
      bookListId: id,
      to: "2025-03-31T08:04:59.826Z",
      bookType: 0,
    };
    if (!user) {
      message.error("Bạn cần đăng nhập để đặt trước.");
      return;
    }
    try {
      const response = await bookListApiRequest.endBookList(body, user.token);
      fetchTableData().then((result) => {
        setData(result);
      });
      message.success("Đã kết toán hành động thành công");
    } catch (error) {
      message.error("Kết toán hành động thất bại");
    }
  };
  const onClickStart = async (id: string) => {
    const body = {
      bookListId: id,
    };
    if (!user) {
      message.error("Bạn cần đăng nhập để đặt trước.");
      return;
    }
    try {
      const response = await bookListApiRequest.startBookList(body, user.token);
      fetchTableData().then((result) => {
        setData(result);
      });
      message.success("Đã kết toán hành động thành công");
    } catch (error) {
      message.error("Kết toán hành động thất bại");
    }
  };
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Tên khách hàng",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (text) => <a>{text || "Khách vô danh"}</a>,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (_, record) => <>{formatDateTime(record.from, "DATE")}</>,
    },
    {
      title: "Giờ bắt đầu",
      dataIndex: "from",
      key: "from",
      render: (_, record) => <>{formatDateTime(record.from, "TIME")}</>,
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "to",
      key: "to",
      render: (_, record) => <>{formatDateTime(record.to, "TIME")}</>,
    },
    {
      title: "Loại thuê",
      key: "type",
      dataIndex: "type",
      render: (_, { type }) => (
        <>
          <Tag>{statusName[type]}</Tag>
        </>
      ),
    },
    {
      title: "Công Cụ",
      key: "action",
      render: (_, record) => (
        <>
          <Row gutter={[12, 12]}>
            <Col span={12} className="flex justify-center">
              {(() => {
                switch (record.status) {
                  case "ACTIVE":
                    return (
                      <Button
                        color="primary"
                        variant="dashed"
                        onClick={() => onClickStart(record.id)}
                      >
                        Check
                      </Button>
                    );
                  case "STARTED":
                    return (
                      <Space className="flex justify-between">
                        <Button
                          color="cyan"
                          variant="filled"
                          onClick={() => onClickEnd(record.id)}
                        >
                          End
                        </Button>
                        <Button
                          color="yellow"
                          variant="filled"
                          onClick={() => setOpenModal(true)}
                        >
                          Extend
                        </Button>
                      </Space>
                    );
                  case "ENDED":
                    return (
                      <Button variant="filled" disabled>
                        DONE
                      </Button>
                    );
                  default:
                    return null;
                }
              })()}
            </Col>
            <Col span={12}>
              <Button color="red" variant="filled">
                Cancel
              </Button>
            </Col>
          </Row>
        </>
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
            <Col>
              <Select
                defaultValue={0}
                options={[
                  { value: 0, label: <span>Theo ngày </span> },
                  { value: 1, label: <span>Theo khoảng</span> },
                ]}
                className="w-30 h-10 me-4"
                onChange={(value) => onChange(value)}
              />
              {mode == 0 ? (
                <DatePicker
                  picker="date"
                  className="h-10"
                  placeholder={"Chọn ngày"}
                  defaultValue={dayjs()}
                  onChange={handleDateChange}
                />
              ) : (
                <RangePicker
                  picker="date"
                  className="h-10"
                  placeholder={["Từ ngày", "Đến ngày"]}
                  onChange={handleRangeChange}
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      <br />
      <Table<DataType>
        loading={tableLoading}
        columns={columns}
        dataSource={useData ?? []}
        pagination={false}
        onRow={(record) => ({
          onClick: () => {
            router.push(`/staff/booklist/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
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
      <ExtendBookModal />
    </>
  );
}
