"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Space,
  Typography,
  Input,
  Select,
  DatePicker,
  Button,
  Divider,
  Empty,
  message,
  Avatar,
  Tooltip,
  Skeleton,
  Modal,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { orderApiRequest } from "@/src/apiRequests/orders";
import { useAppContext } from "../../app-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import transactionApiRequest from "@/src/apiRequests/transaction";
import { formatDateTime, formatVND } from "@/src/lib/utils";
import PaymentModal from "@/src/components/CheckOut/PaymentModal";

/**
 * Replace with your real API endpoint.
 */
const API_URL = "/api/order-history"; // e.g. `${process.env.NEXT_PUBLIC_API_URL}/orders/history`

/** Types inferred from your payloads */
export type OrderItem = {
  id: string;
  order_id: string;
  product_template_id: string;
  current_price: number;
  product_name: string;
  image?: string | null;
};

export type StoreOrder = {
  id: string;
  order_group_id: string;
  store_id: string;
  store_name: string;
  address?: string | null;
  code: string;
  total_item: number;
  total_price: number;
  status: string;
  items: OrderItem[];
};

export type OrderGroup = {
  id: string;
  code: string;
  customer_id: string;
  customer_name: string;
  receiver_name: string;
  receiver_email: string;
  receiver_address: string;
  receiver_phone: string;
  total_price: number;
  total_item: number;
  is_delivery: boolean;
  delivery_brand: string | null;
  delivery_code: string | null;
  expected_receipt_date: string | null;
  status: string;
  created_at: string; // ISO
  created_by: string;
  TotalCount?: number; // server quirk
  orders: StoreOrder[];
};

export type HistoryResponse = {
  statusCode: string;
  message: string;
  data: OrderGroup[];
  paging?: {
    pageNum: number;
    pageSize: number;
    pageCount: number;
  };
};

/** Request body type */
export type HistoryRequest = {
  keyword: string | null;
  status: string[] | null;
  createdFrom: string | null; // ISO
  createdTo: string | null; // ISO
  sortColumn: string | null;
  sortDirection: "ASC" | "DESC" | null;
  paging: {
    pageNum: number;
    pageSize: number;
  };
};

const fmtVND = (v: number) => formatVND(v);

/** Map status to color + label */
const statusMeta: Record<string, { color: string; label: string }> = {
  CREATED: { color: "warning", label: "Chưa Thanh Toán" },
  PAID: { color: "green", label: "Đang xử lý" },
  PREPARED: { color: "blue", label: "Đã chuẩn bị" },
  DELIVERING: { color: "processing", label: "Đang giao" },
  RECEIVED: { color: "success", label: "Hoàn tất" },
  CANCELLED: { color: "error", label: "Đã hủy" },
};

/** Smart debouncer */
function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Main component */
export default function OrderHistoryPage() {
  const { Text } = Typography;
  const { user } = useAppContext();
  const qc = useQueryClient();

  // Filters
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [sort, setSort] = useState<{ col: string | null; dir: "ASC" | "DESC" | null }>(
    { col: "created_at", dir: "DESC" }
  );

  // Table state
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Data
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OrderGroup[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{ id: string; type: number } | null>(null);
  
  const handleOpenPayment = (orderGroupId: string, type: number) => {
    setSelectedOrder({ id: orderGroupId, type: type });
    setPaymentModalOpen(true);
  };
  const debouncedKeyword = useDebounce(keyword, 500);

  const body: HistoryRequest = useMemo(() => {
    const createdFrom = range?.[0]?.toISOString() ?? null;
    const createdTo = range?.[1]?.endOf("day").toISOString() ?? null;

    return {
      keyword: debouncedKeyword ? debouncedKeyword : "",
      status: status.length ? status : null,
      createdFrom,
      createdTo,
      sortColumn: sort.col,
      sortDirection: sort.dir,
      paging: { pageNum, pageSize },
    };
  }, [debouncedKeyword, status, range, sort, pageNum, pageSize]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res: HistoryResponse = await orderApiRequest.getOrderHistoryPaged(body, user?.token);
      if (!(res.statusCode === "200")) throw new Error(`HTTP ${res.statusCode}: ${res.message}`);
      setData(res.data || []);
      // Server returns TotalCount inside first row or use paging fallback
      const totalFromRow = res.data?.[0]?.TotalCount;
      const totalFromPaging = res.paging ? res.paging.pageCount * res.paging.pageSize : undefined;
      setTotal(totalFromRow ?? totalFromPaging ?? 0);
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || "Không thể tải lịch sử đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [body]);
  const handlePay = (order: OrderGroup) => {
    Modal.confirm({
      title: "Xác nhận thanh toán",
      content: (
        <>
          <p>Đơn hàng: <b>#{order.code}</b></p>
          <p>Ngày đặt: <b>{formatDateTime(order.created_at, "DATE")}</b></p>
          <p>Tổng tiền: <b>{formatVND(order.total_price)}</b></p>
        </>
      ),
      okText: "Thanh toán",
      cancelText: "Hủy",
      onOk: () => handleOpenPayment(order.id, 1),
    });
  };
  const columns: ColumnsType<OrderGroup> = [
    {
      title: "Mã đơn nhóm",
      dataIndex: "code",
      key: "code",
      render: (v: string, r) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Typography.Text copyable={{ text: v }} strong>
              {v}
            </Typography.Text>
          </div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Tạo lúc {formatDateTime(r.created_at, 'DATETIME')}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Người nhận",
      key: "receiver",
      render: (_, r) => (
        <Space direction="vertical" size={2} style={{ maxWidth: 220 }}>
          {/* Dòng 1: Avatar + Tên */}
          <Space align="center">
            <Avatar size={24} style={{ backgroundColor: "#87d068" }}>
              {(r.receiver_name || "?").charAt(0).toUpperCase()}
            </Avatar>
            <Text strong>{r.receiver_name || "Chưa có tên"}</Text>
          </Space>

          {/* Dòng 2: Số điện thoại */}
          {r.receiver_phone && (
            <Space size={4}>
              <i className="ri-phone-line" style={{ fontSize: 14, color: "#888" }} />
              <Text type="secondary">{r.receiver_phone}</Text>
            </Space>
          )}

          {/* Dòng 3: Địa chỉ */}
          {r.receiver_address && (
            <Tooltip title={r.receiver_address}>
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                  display: "inline-block",
                  maxWidth: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.receiver_address}
              </Text>
            </Tooltip>
          )}
        </Space>
      ),
      responsive: ["md"],
    },
    {
      title: "SL / Thành tiền",
      key: "qtyPrice",
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text>{r.total_item} sản phẩm</Text>
          <Text strong>{fmtVND(r.total_price)}</Text>
        </Space>
      ),
      width: 160,
    },
    {
      title: "Giao nhận",
      dataIndex: "is_delivery",
      key: "delivery",
      render: (v: boolean, r) => (
        <Space direction="vertical" size={0}>
          <Tag color={v ? "processing" : "default"}>{v ? "Giao tận nơi" : "Nhận tại quầy"}</Tag>
          {v && r.delivery_brand && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {r.delivery_brand} • {r.delivery_code || "—"}
            </Text>
          )}
        </Space>
      ),
      responsive: ["lg"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (s: string) => (
        <Tag color={statusMeta[s]?.color || "default"}>{statusMeta[s]?.label || s}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, r) => (
        <>
          {/* <Space>
          <Button type="link" onClick={() => handleOpenPayment(r.id, 0)}>
            Xem chi tiết
          </Button> */}
          {r.status === "CREATED" && (
            <Button type="primary" onClick={() => handlePay(r)}>
              Thanh toán
            </Button>
          )}
          {/* </Space> */}
        </>
      ),
    },
  ];

  const expandedRowRender = (group: OrderGroup) => (
    <Space direction="vertical" style={{ width: "100%" }}>
      {group.orders?.map((o) => (
        <Card key={o.id} size="small" title={
          <Space>
            <Text strong>{o.store_name}</Text>
            <Tag>{o.code}</Tag>
            <Tag color={statusMeta[o.status]?.color || "default"}>{statusMeta[o.status]?.label || o.status}</Tag>
          </Space>
        } extra={<Text type="secondary">{o.address}</Text>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {o.items?.map((it) => (
              <Card key={it.id} size="small" hoverable>
                <Space>
                  <Avatar shape="square" size={64} src={it.image || undefined} alt={it.product_name} />
                  <Space direction="vertical" size={0}>
                    <Text strong>{it.product_name}</Text>
                    <Text type="secondary">{fmtVND(it.current_price)}</Text>
                  </Space>
                </Space>
              </Card>
            ))}
          </div>
          <Divider style={{ margin: "12px 0" }} />
          <Space wrap>
            <Text>Tổng {o.total_item} SP</Text>
            <Text strong>• {fmtVND(o.total_price)}</Text>
          </Space>
        </Card>
      ))}
    </Space>
  );

  /** Filter Bar */
  const FilterBar = (
    <Card size="small" style={{ position: "sticky", top: 0, zIndex: 1 }}>
      <Space wrap>
        <Input
          allowClear
          placeholder="Tìm theo mã đơn, người nhận, sản phẩm…"
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => {
            setPageNum(1);
            setKeyword(e.target.value);
          }}
          style={{ width: 320 }}
        />
        <Select
          mode="multiple"
          allowClear
          placeholder="Trạng thái"
          value={status}
          onChange={(v) => {
            setPageNum(1);
            setStatus(v);
          }}
          style={{ minWidth: 220 }}
          options={Object.keys(statusMeta).map((k) => ({ label: statusMeta[k].label, value: k }))}
        />
        <DatePicker.RangePicker
          value={range as any}
          onChange={(v) => {
            setPageNum(1);
            setRange(v as any);
          }}
          showTime={false}
          format="DD/MM/YYYY"
        />
        <Select
          value={sort.col || undefined}
          onChange={(col) => setSort((s) => ({ ...s, col }))}
          style={{ width: 180 }}
          options={[
            { label: "Sắp xếp: Ngày tạo", value: "created_at" },
            { label: "Sắp xếp: Thành tiền", value: "total_price" },
            { label: "Sắp xếp: Số lượng", value: "total_item" },
          ]}
        />
        <Select
          value={sort.dir || undefined}
          onChange={(dir) => setSort((s) => ({ ...s, dir }))}
          style={{ width: 140 }}
          options={[
            { label: "Giảm dần", value: "DESC" },
            { label: "Tăng dần", value: "ASC" },
          ]}
        />
        <Button icon={<ReloadOutlined />} onClick={fetchData}>
          Làm mới
        </Button>
      </Space>
    </Card>
  );

  const onChange = (p: TablePaginationConfig) => {
    setPageNum(p.current || 1);
    setPageSize(p.pageSize || 10);
  };

  const pagination: TablePaginationConfig = {
    current: pageNum,
    pageSize,
    total,
    showTotal: (t: number, range: [number, number]) => `${range[0]}-${range[1]} / ${t} đơn`
  } as any;

  return (
    <>

      <div style={{ display: "grid", gap: 12 }}>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          Lịch sử đơn hàng
        </Typography.Title>
        <Text type="secondary">
          Xem các đơn hàng theo nhóm (GroupOrder). Nhấp để xem chi tiết từng cửa hàng và sản phẩm.
        </Text>

        {FilterBar}

        <Card>
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : data.length === 0 ? (
            <Empty description="Không có đơn nào" />
          ) : (
            <Table<OrderGroup>
              rowKey={(r) => r.id}
              columns={columns}
              dataSource={data}
              expandable={{ expandedRowRender }}
              pagination={pagination}
            />
          )}
        </Card>
      </div>
      {selectedOrder && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          referenceID={selectedOrder.id}
          type={0}
          token={user?.token}
        />
      )}
    </>
  );
}
