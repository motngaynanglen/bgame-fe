"use client"
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
  notification
} from "antd";
import { HomeOutlined, UserOutlined, PlayCircleOutlined, StopOutlined, PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "@/src/lib/dayjs";
import { useAppContext } from "../../app-provider";
import bookListApiRequest from "@/src/apiRequests/bookList";
import SearchBar from "@/src/components/admin/table/search";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import { formatDateTime } from "@/src/lib/utils";
import { notifyError } from "@/src/components/Notification/Notification";
import { HttpError } from "@/src/lib/httpAxios";
import PaymentModal from "@/src/components/CheckOut/PaymentModal";
import { title } from "process";
import Link from "next/link";
const { confirm } = Modal;

const { RangePicker } = DatePicker;

interface DataType {
  key: string;
  id: string;
  code: string;
  customer_id: string;
  full_name: string;
  from: string;
  to: string;
  type: number;
  total_table: number;
  status: string;
}

interface PagingType {
  pageNum: number;
  pageSize: number;
  pageCount: number;
}

const statusMap: Record<string, { text: string; color: string }> = {
  CREATED: { text: "Chờ thanh toán", color: "yellow" },
  PAID: { text: "Chờ bắt đầu", color: "blue" },
  STARTED: { text: "Đang thuê", color: "orange" },
  ENDED: { text: "Hoàn tất", color: "green" },
  OVERDUE: { text: "Trễ hạn", color: "grey" },
  CANCELLED: { text: "Đã hủy", color: "red" }
};

export default function StaffManageBookList({ searchParams }: { searchParams?: { query?: string; page?: string } }) {
  const [data, setData] = useState<DataType[]>([]);
  const [paging, setPaging] = useState<PagingType>();
  const [mode, setMode] = useState(0);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    booking: DataType | null;
  }>({
    open: false,
    booking: null,
  });

  const { user } = useAppContext();
  const router = useRouter();

  const defaultToDay = {
    from: dayjs().hour(1).minute(0).second(0).toISOString(),
    to: dayjs().hour(23).minute(0).second(0).toISOString()
  };

  const apiBody = {
    from: dateRange ? dateRange[0] : defaultToDay.from,
    to: dateRange ? dateRange[1] : defaultToDay.to,
    paging: { pageNum: searchParams?.page ?? 1, pageSize: 10 }
  };

  const handleOpenPayment = (record: DataType) => {
    setPaymentModal({
      open: true,
      booking: record,
    });
  };
  const handleClosePayment = () => {
    setPaymentModal({
      open: false,
      booking: null,
    });
  };
  const fetchData = async () => {
    setLoading(true);
    if (!user) {
      message.error("Bạn cần đăng nhập để xem dữ liệu.");
      setLoading(false);
      return;
    }
    try {
      const res = await bookListApiRequest.getBookListByDate(apiBody, user.token);
      const mapped = res.data.map((item: any) => ({ ...item, key: item.id }));
      setData(mapped);
      setPaging(res.paging);
    } catch (err) {
      message.error("Không thể tải dữ liệu");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, searchParams]);

  const confirmAction = (title: string, onOk: () => void) => {
    Modal.confirm({
      title,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk
    });
  };

  // const handleStart = (id: string) => {
  //   confirmAction("Bắt đầu đơn hàng?", async () => {
  //     try {
  //       await bookListApiRequest.startBookList({ bookListId: id }, user!.token);
  //       notification.success({ message: "Đã bắt đầu" });
  //       fetchData();
  //     } catch (error) {
  //       if (error instanceof HttpError) notifyError(error.message);
  //     }
  //   });
  // };

  // const handleEnd = (id: string) => {
  //   confirmAction("Kết thúc đơn hàng?", async () => {
  //     try {
  //       await bookListApiRequest.endBookList({ bookListId: id }, user!.token);
  //       notification.success({ message: "Đã kết thúc" });
  //       fetchData();
  //     } catch (error) {
  //       if (error instanceof HttpError) notifyError(error.message);
  //     }
  //   });
  // };
  const handleConfirmStart = (bookingId: string) => {
    confirm({
      title: "Xác nhận bắt đầu",
      content: "Bạn có chắc muốn bắt đầu đơn này không?",
      okText: "Bắt đầu",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await bookListApiRequest.startBookList({ bookListId: bookingId }, user!.token);
          notification.success({ message: "Đã bắt đầu" });
          fetchData();
        } catch (error) {
          if (error instanceof HttpError) notifyError(error.message);
        }
      },
    });
  };

  const handleConfirmEnd = (bookingId: string) => {
    confirm({
      title: "Xác nhận kết thúc",
      content: "Bạn có chắc muốn kết thúc đơn này không?",
      okText: "Kết thúc",
      cancelText: "Hủy",
      onOk: async () => {
        // Gọi API kết thúc
        try {
          await bookListApiRequest.endBookList({ bookListId: bookingId }, user!.token);
          notification.success({ message: "Đã kết thúc" });
          fetchData();
        } catch (error) {
          if (error instanceof HttpError) notifyError(error.message);
        }
      },
    });
  };
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "full_name",
      render: (name: string) => name || "Khách vô danh"
    },
    {
      title: "Mã đơn",
      dataIndex: "code",
      render: (_: any, record: DataType) => <Link href={`/staff/booklist/${record.id}`}>{record.code ?? "Không có mã"}</Link>
    },
    {
      title: "Loại",
      dataIndex: "type",
      render: (type: number) => (type === 0 ? <Tag color="blue">Theo giờ</Tag> : <Tag color="green">Cả ngày</Tag>)
    },
    {
      title: "Ngày thuê",
      dataIndex: "from",
      render: (val: string) => formatDateTime(val, "DATE")
    },
    {
      title: "Bắt đầu",
      dataIndex: "from",
      render: (val: string) => formatDateTime(val, "TIME")
    },
    {
      title: "Kết thúc",
      dataIndex: "to",
      render: (val: string) => formatDateTime(val, "TIME")
    },
    {
      title: "Số bàn",
      dataIndex: "total_table",
      render: (val: number) => `${val} bàn`
    },
    // {
    //   title: "Khách hàng ID",
    //   dataIndex: "customer_id",
    //   render: (id: string) => id || "Không có ID"
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        const st = statusMap[status] || { text: status, color: "default" };
        return <Tag color={st.color}>{st.text}</Tag>;
      }
    },
    {
      title: "Hành động",
      render: (_: any, record: DataType) => {
        switch (record.status) {
          case "CREATED":
            return (
              <Button
                color="green"
                variant="filled"
                onClick={() => handleOpenPayment(record)}
              >
                Thanh toán
              </Button>
            );
          case "PAID":
            return (
              <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => handleConfirmStart(record.id)}>
                Start
              </Button>
            );
          case "STARTED":
            return (
              <Space>
                <Button danger icon={<StopOutlined />} onClick={() => handleConfirmEnd(record.id)}>
                  End
                </Button>
                {/* <Button icon={<PlusOutlined />}>Gia hạn</Button> */}
              </Space>
            );
          case "ENDED":
            return <Tag color="green">Đã xong</Tag>;
          default:
            return null;
        }
      }
    }
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { href: "/manager", title: <HomeOutlined /> },
          { title: <><UserOutlined /> <span>Quản lý đơn hàng</span></> }
        ]}
        className="pb-4"
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 12 }}>
        <Col span={14}>
          <Suspense>
            <SearchBar placeholder="Tìm theo tên khách hàng..." />
          </Suspense>
        </Col>
        <Col span={10}>
          <Space>
            <Select
              defaultValue={0}
              options={[
                { value: 0, label: "Theo ngày" },
                { value: 1, label: "Theo khoảng" }
              ]}
              onChange={setMode}
            />
            {mode === 0 ? (
              <DatePicker defaultValue={dayjs()} onChange={(d) => {
                if (d) setDateRange([d.startOf("day").toISOString(), d.endOf("day").toISOString()]);
              }} />
            ) : (
              <RangePicker onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0].startOf("day").toISOString(), dates[1].endOf("day").toISOString()]);
                }
              }} />
            )}
          </Space>
        </Col>
      </Row>

      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
        // onRow={(record) => ({
        //   onClick: () => router.push(`/staff/booklist/${record.id}`),
        //   style: { cursor: "pointer" }
        // })}
      />

      <AntdCustomPagination totalPages={paging?.pageCount ?? 1} />
      <PaymentModal
        open={paymentModal.open}
        onClose={handleClosePayment}
        referenceID={paymentModal.booking?.id || ""}
        type={0} // booking
        token={user?.token}
      />
    </>
  );
}
