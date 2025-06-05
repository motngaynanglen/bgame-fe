"use client";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { orderApiRequest } from "@/src/apiRequests/orders";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import SearchBar from "@/src/components/admin/table/search";
import { formatDateTime, formatVND } from "@/src/lib/utils";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import type { CollapseProps, TableProps } from "antd";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  message,
  notification,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAppContext } from "../../app-provider";
import { HttpError } from "@/src/lib/httpAxios";
import { notifyError } from "@/src/components/Notification/Notification";
const { RangePicker } = DatePicker;

interface DataType {
  key: string;
  id: string;
  transaction_id: string;
  customer_id: string;
  staff_id: string;
  code: string;
  email: string;
  full_name: string;
  phone_number: string;
  address: string;
  total_item: number;
  total_price: string;
  status: string;
  is_delivery: boolean;
  created_at: string;
}

interface PagingType {
  pageNum: number;
  pageSize: number;
  pageCount: number;
}
const statusName = ["THEO GIỜ", "THEO LƯỢT"];
const orderStatusOptions = [
  { value: "0", label: "Tất cả" }, // Option to show all statuses
  { value: "1", label: "Chưa thanh toán" },
  { value: "2", label: "Đã thanh toán" },
  { value: "3", label: "Đang chuẩn bị hàng" },
  { value: "4", label: "Đang giao" },
  { value: "5", label: "Đã gửi" },
  { value: "6", label: "Đã hủy" },
];
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

export default function StaffManageOrder({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const [useData, setData] = useState<DataType[] | undefined>(undefined);
  const [paging, setPaging] = useState<PagingType | undefined>(undefined);
  const [mode, setMode] = useState<number>(0);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("0");
  const { user } = useAppContext();
  const apiBody = {
    filter: {
      status: statusFilter === "0" ? null : statusFilter,
    },
    paging: {
      pageNum: searchParams?.page ?? 1,
      pageSize: 10,
    },
  };

  const router = useRouter();

  // Check if the component has mounted to avoid hydration issues
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !user) {
      router.push("/login");
    }
  }, [hasMounted, user, router]);

  const fetchTableData = async () => {
    setTableLoading(true);

    if (!user) {
      message.error("Bạn cần đăng nhập để đặt trước.");
      setTableLoading(false);
      return;
    }

    try {
      const response = await orderApiRequest.getOrderHistory(
        apiBody,
        user.token
      );

      const data: DataType[] | undefined = response.data?.map(
        (item: DataType) => ({
          ...item,
          key: item.id,
        })
      );

      setPaging(response.paging);
      return data;
    } catch (error) {
      // Kiểm tra nếu lỗi là 401 (token hết hạn)
      if (error instanceof HttpError) {
        if (error.status === 404) {
          message.error("Không tìm thấy dữ liệu đơn hàng.");
          setData([]);
          setTableLoading(false);
          return [];
        }
        if (error.status === 401) {
          message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          router.push("/login"); // Chuyển hướng về login
        }
      }
      return;
    } finally {
      setTableLoading(false);
    }
  };
  useEffect(() => {
    fetchTableData().then((result) => {
      setData(result);
    });
  }, [dateRange, searchParams, statusFilter, hasMounted]);
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
  const handleReciveOrder = async (orderId: string) => {
    try {
      // Gọi API để nhận đơn hàng
      const res = await orderApiRequest.updateOrderToSent({
        orderID: orderId,
      }, user?.token);

      notification.success({
        message: res.message || "Đã nhận đơn sản phẩm",
        description: "Cảm ơn bạn đã mua sản phẩm.",
      });
      router.refresh();

    } catch (error) {
      notifyError("Lỗi nhận đơn", "Có lỗi xảy ra khi xử lý yêu cầu nhận đơn.");
    }
  }

  const viewOrderDetails = (record: DataType) => {
    router.push(`/staff/orders/${record.id}`);
  };
  const handleUpdateDeliveryInfo = (record: DataType) => {
    router.push(`/staff/orders/${record.id}/update-delivery-info`);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      key: "code",
      render: (text) => <a>{text || "Không có mã"}</a>,
    },
    {
      title: "Tên đơn hàng",
      dataIndex: "full_name",
      key: "full_name",
      render: (_, record) => <>{record.full_name || "Không có tên"}</>,
    },
    {
      title: "Liên lạc",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (_, record) => <>{record.phone_number}</>,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, record) => <>{formatDateTime(record.created_at, "DATE")}</>,
    },
    {
      title: "Tổng giá trị",
      key: "total_price",
      dataIndex: "total_price",
      render: (_, record) => <>{formatVND(record.total_price)}</>,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => (
        <>
          <Tag>{status}</Tag>
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
              <Space className="flex justify-between">
                <Button
                  color="blue"
                  variant="filled"
                  onClick={() => viewOrderDetails(record)}
                >
                  Xem chi tiết
                </Button>
              </Space>
            </Col>
            <Col span={12} className="flex justify-center">
              {(() => {
                switch (record.status) {
                  case "CREATED":
                    return (
                      <Space className="flex justify-between">
                        <Button
                          color="cyan"
                          variant="filled"
                          onClick={() => onClickEnd(record.id)}
                        >
                          Nhận đơn
                        </Button>
                      </Space>
                    );
                  case "PAID":
                    return (
                      <>
                        {(record.is_delivery)
                          ? (<Space className="flex justify-between">
                            <Button
                              color="cyan"
                              variant="filled"
                              onClick={() => viewOrderDetails(record)}
                            >
                              Chuẩn bị sản phẩm
                            </Button>
                          </Space>)
                          : (<Space className="flex justify-between">
                            <Button
                              color="orange"
                              variant="filled"
                              onClick={() => handleReciveOrder(record.id)}
                            >
                              Kết toán
                            </Button>
                          </Space>)
                        }

                      </>
                    );
                  case "PREPARED":
                    return (
                      <Space className="flex justify-between">
                        <Button
                          color="cyan"
                          variant="filled"
                          onClick={() => handleUpdateDeliveryInfo(record)}
                        >
                          Bắt đầu giao hàng
                        </Button>
                      </Space>
                    );
                  default:
                    return (
                      <Space className="flex justify-between">
                        <Button disabled color="cyan" variant="filled">
                          Nhận đơn
                        </Button>
                      </Space>
                    );
                }
              })()}
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
        <Col span={6} className="flex items-center">
          <Select
            defaultValue="0"
            style={{ width: "100%" }}
            onChange={(value) => setStatusFilter(value)}
            options={orderStatusOptions}
            placeholder="Lọc theo trạng thái"
          />
        </Col>
      </Row>

      <br />
      <Table<DataType>
        loading={tableLoading}
        columns={columns}
        dataSource={useData ?? []}
        pagination={false}
       
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
    </>
  );
}
