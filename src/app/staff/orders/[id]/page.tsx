"use client";
import { orderApiRequest, orderItemApiRequest } from "@/src/apiRequests/orders";
import { useAppContext } from "@/src/app/app-provider";
import { notifyError } from "@/src/components/Notification/Notification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Divider, message, Modal, notification, Card, Row, Col, Spin, Tag, Input, Space, Typography, Collapse, AutoComplete } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
// Đã tách OrderGroupDetail ra khỏi types, giả định nó nằm trong file này
import storeApiRequest from "@/src/apiRequests/stores";
import dayjs from "dayjs"; // Sử dụng dayjs để định dạng ngày
import { getGroupStatus, getOrderStatus, Order, OrderGroupDetail, OrderItem } from "./types";
import { SettingOutlined } from "@ant-design/icons";
import { useProductCodeSearch } from "@/src/hooks/useProductCodeSearch";

// --- Giao diện Types (Đặt ở đầu file hoặc import từ file types riêng) ---


// Hàm format tiền tệ
const formatCurrency = (value: number) => {
  return value.toLocaleString('vi-VN') + ' VNĐ';
};

interface OrderItemRowProps {
  item: OrderItem;
  orderGroupStatus: string;
  isMyStoreOrder: boolean;
  isActionAvailable: boolean;
  token: string | undefined;
  handleUpdateItem: (orderItemId: string, productCode: string) => void;
  isUpdating: boolean;
}

const OrderItemRow: React.FC<OrderItemRowProps> = ({
  item,
  orderGroupStatus,
  isMyStoreOrder,
  isActionAvailable,
  token,
  handleUpdateItem,
  isUpdating
}) => {

  // State cục bộ để quản lý Input/Autocomplete cho item này
  const [selectedCode, setSelectedCode] = useState<string>("");

  const {
    options,
    isSearching,
    setSearchTerm
  } = useProductCodeSearch(token, 1);


  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Hàm xử lý việc gõ tay vào input
  const onChangeInput = (value: string) => {
    setSelectedCode(value);
    onSearch(value);
  }

  const onSelect = (value: string) => {
    setSelectedCode(value);
    setSearchTerm(value);
  };

  const handleUpdate = () => {
    if (selectedCode === undefined || selectedCode.trim() === "") {
      message.error("Vui lòng chọn hoặc nhập mã code.");
      return;
    }

    handleUpdateItem(item.order_item_id, selectedCode);
  };


  return (
    <tr key={item.order_item_id}>
      <td className="border border-gray-600 p-2 text-left">
        <strong className="block">{item.product_name}</strong>
        <Typography.Text className="text-gray-400 text-sm " copyable={{ text: item.code }} >
          Mã SP: {item.code}
        </Typography.Text>
      </td>
      <td className="border border-gray-600 p-2">
        {formatCurrency(item.current_price)}
      </td>
      <td className="border border-gray-600 p-2">
        {formatCurrency(item.current_price)}
      </td>
      <td className="border border-gray-600 p-2">
        <Tag color="geekblue">{item.order_item_status}</Tag>
      </td>
      {isActionAvailable && (
        <td className="border border-gray-600 p-2">
          <AutoComplete
            style={{ width: "100%" }}
            value={selectedCode}
            options={options}
            onSearch={onSearch} // Gọi setSearchTerm ngay lập tức
            onSelect={onSelect}
            onChange={onChangeInput} // Sử dụng onSearch để đồng bộ input value và trigger search
          // ... (Các props khác)
          >
            {/* ... */}
          </AutoComplete>
        </td>
      )}
      {isActionAvailable && (
        <td className="border border-gray-600 p-2">
          <Button
            type="primary"
            size="small"
            loading={isUpdating && !isSearching}
            onClick={() => handleUpdate()}
          >
            Cập nhật
          </Button>
        </td>
      )}
      {/* {!isActionAvailable && (item.product_code_received && <td className="border border-gray-600 p-2">{item.product_code_received}</td>)} */}

    </tr>

  );
};

// --- Component Chi tiết Đơn hàng (Order Item Detail) ---

interface OrderDetailItemProps {
  order: Order;
  orderGroupStatus: string;
  token: string | undefined;
  codesByItem: Record<string, string>;
  handleUpdateItem: (orderItemId: string, productCode: string) => void; // Thay đổi signature
  isUpdating: boolean;
  isMyStoreOrder: boolean;

}

const OrderDetailItems: React.FC<OrderDetailItemProps> = ({
  order,
  orderGroupStatus,
  token,
  codesByItem,
  handleUpdateItem,
  isUpdating,
  isMyStoreOrder
}) => {
  const isActionAvailable = isMyStoreOrder && (orderGroupStatus === "CREATED" || orderGroupStatus === "PAID") && (order.order_status === "CREATED");

  return (
    <div className="space-y-4">
      <h5 className="text-lg font-bold text-blue-400">
        {/* Đơn hàng: {order.order_code} |  */}
        Cửa hàng: {order.store_name || "Tên cửa hàng"}
        <Divider type="vertical" />
        {!isMyStoreOrder && <Tag color="default">Cửa hàng khác</Tag>}
        {(order.is_hub == 1) ? <Tag color="cyan">Điểm tập kết</Tag> :
          ((order.is_transfered == 1)) ?
            <Tag color="green">Đã tập kết</Tag> :
            <Tag color="warning">Chưa tập kết</Tag>
        }


      </h5>
      <p className="text-sm">
        Trạng thái:
        <Tag color={getOrderStatus(order.order_status).color} className="ml-2">
          {getOrderStatus(order.order_status).label}
        </Tag>
        {(isMyStoreOrder && order.is_hub == 0) && (
          <span>
            hãy chuyển đơn tới điểm tập kết.
          </span>
        )}
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full text-center border-collapse border border-gray-600">
          <thead className="">
            <tr>
              <th className="border border-gray-600 p-2">Sản phẩm</th>
              <th className="border border-gray-600 p-2">Giá</th>
              <th className="border border-gray-600 p-2">Thành tiền</th>
              <th className="border border-gray-600 p-2">Trạng thái Item</th>
              {(isActionAvailable) ? (
                <>
                  <th className="border border-gray-600 p-2 w-[200px]">Mã Code</th>
                  <th className="border border-gray-600 p-2 w-[100px]">Hành động</th>
                </>
              ) : (
                <>
                  {/* <th className="border border-gray-600 p-2">Mã Code Đã Nhận</th> */}
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <OrderItemRow
                key={item.order_item_id}
                item={item}
                orderGroupStatus={orderGroupStatus}
                isMyStoreOrder={isMyStoreOrder}
                isActionAvailable={isActionAvailable}
                token={token}
                handleUpdateItem={handleUpdateItem}
                isUpdating={isUpdating}
              />
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-right text-base font-semibold">
        Tổng tiền đơn hàng này: {formatCurrency(order.items.reduce((sum, item) => sum + item.current_price, 0))}
      </p>
      <Divider className="border-gray-700 m-0" />
    </div>
  );
};


// --- Component Chính (Order Detail Page) ---

export default function OrderDetail() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAppContext();

  const [codesByItem, setCodesByItem] = React.useState<Record<string, string>>({});

  const { data: storeIdData, isLoading: storeLoading } = useQuery({
    queryKey: ["selectedStoreId"],
    queryFn: async () => {
      if (!user?.token) {
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.")
        return null;
      }
      const res = await storeApiRequest.getStoreId(user.token);
      // Giả định API trả về storeId string
      return res.data;
    },
    enabled: !!user?.token,
  });
  const myStoreId = storeIdData as string | undefined;

  // Tải thông tin Order Group
  const { data, isLoading, refetch } = useQuery<OrderGroupDetail>({
    queryKey: ["ordergroup", id],
    queryFn: async () => {
      const res = await orderApiRequest.getOrderById({
        orderID: id as string,
      });
      return res.data;
    },
  });
  const hubstore = data?.orders.find((value) =>  value.is_hub == 1 )

  // Tải thông tin cửa hàng (Nếu cần để hiển thị tên)
  // Cần một API map order.store_id với store name. Hiện tại tôi bỏ qua logic này.

  const updateItemMutation = useMutation({
    mutationFn: async ({ orderItemId, productCode }: { orderItemId: string; productCode: string; }) => {
      const order = data?.orders.find(o => o.items.some(i => i.order_item_id === orderItemId));
      if (!order) throw new Error("Không tìm thấy đơn hàng chứa item này.");

      return await orderItemApiRequest.updateOrderItem(
        {
          orderID: order.order_id,
          orderItemId,
          productCode: productCode,
        },
        user?.token
      );
    },
    onSuccess: () => {
      message.success("Cập nhật thành công");
      refetch(); // Tải lại dữ liệu sau khi cập nhật item
    },
    onError: () => {
      message.error("Có lỗi khi cập nhật. Vui lòng thử lại.");
    },
  });
  const transferedMutation = useMutation({
    mutationFn: async ({ orderId }: { orderId: string }) => {
      const order = data?.orders.find(o => o.items.some(i => i.order_id === orderId));
      if (!order) throw new Error("Không tìm thấy đơn hàng chứa item này.");

      return await orderApiRequest.updateOrderByIdTransfered(orderId, {}, user?.token);
    },
    onSuccess: () => {
      message.success("Cập nhật thành công");
      refetch();
    },
    onError: () => {
      message.error("Có lỗi khi cập nhật. Vui lòng thử lại.");
    },
  });
  // const handleCodeChange = (orderItemId: string, value: string) => {
  //   setCodesByItem((prev) => ({
  //     ...prev,
  //     [orderItemId]: value,
  //   }));
  // };

  const handleUpdateToPrepared = () => {
    Modal.confirm({
      title: "Xác nhận đã nhận hàng",
      content: `Bạn có chắn muốn nhận đơn hàng này không? 
            Một khi nhận đơn đồng nghĩa với việc bạn đã nhận được đơn hàng này.`,
      onOk: async () => {
        try {
          const res = await orderApiRequest.updateOrderToPrepared({
            orderID: id as string,
          }, user?.token);

          notification.success({
            message: res.message || "Đã nhận đơn sản phẩm",
            description: "Cảm ơn bạn đã mua sản phẩm.",
          });
          refetch(); // Tải lại dữ liệu để cập nhật trạng thái
          router.refresh();

        } catch (error) {
          notifyError("Lỗi nhận đơn", "Có lỗi xảy ra khi xử lý yêu cầu nhận đơn.");
        }
      }
    });
  };

  const handleUpdateItem = (orderItemId: string) => {
    const productCode = codesByItem[orderItemId] || "";
    if (!productCode) {
      message.error("Bạn phải nhập mã code trước khi cập nhật." + "ok bro");
      return;
    }
    updateItemMutation.mutate({ orderItemId, productCode });
  };

  const handleUpdateToTransfered = (orderId: string) => {
    transferedMutation.mutate({ orderId });
  };
  // Tính tổng tiền cho tất cả các đơn hàng con
  const totalOrderPrice = useMemo(() => {
    if (!data || !data.orders) return 0;
    return data.orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.current_price, 0);
    }, 0);
  }, [data]);


  if (isLoading || storeLoading || !data || !myStoreId) { // Kiểm tra cả storeId
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Spin size="large" tip="Đang tải chi tiết đơn hàng..." />
      </div>
    );
  }

  const receiptDate = data.expected_receipt_date
    ? dayjs(data.expected_receipt_date).format('DD/MM/YYYY')
    : "Chưa cập nhật";

  const hubStoreName = hubstore?.is_hub ? hubstore.store_name : "Chưa cập nhật"
  const myStoreOrders = data.orders.filter(order => order.store_id === myStoreId);
  const otherStoreOrders = data.orders.filter(order => order.store_id !== myStoreId);
  const isMyStorePrepared = data.orders.length > 0 && !(data.orders.some(order => (order.is_transfered == 0 && order.is_hub == 0)));

  const allowUpdateDeliveryInfo = (
    data.order_status === "PAID"
    && myStoreOrders[0].order_status === "PREPARED"
    && myStoreOrders[0].is_hub == 1
    && data.is_delivery
    && isMyStorePrepared
  )
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <Card
        title={
          <div className="flex justify-between items-center flex-wrap">
            <h3 className="text-2xl font-bold">CHI TIẾT ĐƠN HÀNG: {data.order_group_code}</h3>
            <Tag color={getGroupStatus(data.order_status).color} className="text-lg font-semibold px-3 py-1">
              Trạng thái: {getGroupStatus(data.order_status).label}
            </Tag>
          </div>
        }
        className="w-full mx-auto max-w-7xl rounded-lg shadow-xl"
      >

        {/* --- Thông tin Order Group & Người nhận --- */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <h4 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-3 text-yellow-400">
              Thông tin tổng đơn
            </h4>
            <p><strong>Mã Group:</strong> {data.order_group_code}</p>
            <p><strong>Ngày tạo:</strong> {dayjs(data.order_created_at).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>Tổng SL sản phẩm:</strong> {data.total_item}</p>
            <p><strong>Tổng tiền:</strong> {formatCurrency(data.total_price)}</p>
            <p>
              <strong>Giao hàng:</strong>
              <Tag color={data.is_delivery ? "blue" : "red"} className="ml-2">
                {data.is_delivery ? "Có" : "Không"}
              </Tag>
            </p>
            {data.is_delivery && <p><strong>Ngày dự kiến nhận:</strong> {receiptDate}</p>}
            {data.is_delivery && <p><strong>Địa điểm tập kết:</strong> {hubStoreName}</p>}
          </Col>

          <Col xs={24} md={12}>
            <h4 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-3 text-yellow-400">
              Thông tin người nhận
            </h4>
            <p><strong>Họ tên:</strong> {data.full_name}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>SĐT:</strong> {data.phone_number}</p>
            <p><strong>Địa chỉ:</strong> {data.address}</p>
            <p><strong>Thanh toán:</strong> Thanh toán chuyển khoản</p>
          </Col>
        </Row>

        <Divider className="border-gray-600 my-6" />
        {/* --- Chi tiết đơn hàng con (Orders và Order Items) --- */}

        <Collapse
          ghost
          expandIconPosition="end"
          defaultActiveKey={['1']}
          items={[
            {
              key: '1',
              label: <h3 className="text-2xl font-bold text-blue-400">
                Chi tiết Đơn hàng  ({myStoreOrders.length})
              </h3>,
              children: <>
                <Space direction="vertical" size="large" className="w-full">
                  {myStoreOrders.map((order) => (
                    <Card
                      key={order.order_id}
                      title={
                        <div className="flex justify-between items-center">
                          <span className="font-bold">Mã Đơn: {order.order_code}</span>
                          {/* <Tag color="cyan">Trạng thái: {order.order_status}</Tag> */}
                          <Tag color={getOrderStatus(order.order_status).color}>
                            Trạng thái: {getOrderStatus(order.order_status).label}
                          </Tag>
                        </div>
                      }
                      className=" border border-gray-600"
                    >
                      <OrderDetailItems
                        order={order}
                        orderGroupStatus={data.order_status}
                        codesByItem={codesByItem}
                        token={user?.token}
                        handleUpdateItem={handleUpdateItem}
                        isUpdating={updateItemMutation.isPending}
                        isMyStoreOrder={true}
                      />
                    </Card>
                  ))}
                </Space>
              </>,
              extra: <SettingOutlined />
            },
          ]}
        />
        {/* Nút hành động */}
        <div className="flex justify-end pt-4 space-x-4">
          {/* Chỉ hiện nút Xác thực khi trạng thái group là PAID và order là CREATED */}

          <Button
            type="primary"
            size="large"
            onClick={handleUpdateToPrepared}
            loading={updateItemMutation.isPending}
            className="bg-green-600 hover:bg-green-700 border-green-600"
            disabled={!(data.order_status === "PAID" && myStoreOrders[0].order_status === "CREATED")}
          >
            Xác thực đơn hàng
          </Button>



        </div>

        <Divider className="border-gray-600 my-6" />
        <Collapse
          ghost
          expandIconPosition="end"
          defaultActiveKey={['1']}
          items={[
            {
              key: '1',
              label: <h3 className="text-2xl font-bold mb-4 text-red-400">
                Đơn hàng Cửa hàng Khác ({otherStoreOrders.length})
              </h3>,
              children: <>
                <Space direction="vertical" size="middle" className="w-full">
                  {otherStoreOrders.map((order) => (
                    <Card
                      key={order.order_id}
                      title={<div className="flex justify-between items-center">
                        <span className="font-bold">Mã Đơn: {order.order_code}</span>
                        {/* <Tag color="cyan">Trạng thái: {order.order_status}</Tag> */}
                        <span className="flex justify-between items-center">
                          <Button color='cyan' size="small" type="dashed"
                            onClick={() => handleUpdateToTransfered(order.order_id)}
                            loading={transferedMutation.isPending}
                            disabled={!(order.is_transfered == 0 && order.order_status == "PREPARED")}
                            hidden={myStoreOrders[0].is_hub != 1}
                          >
                            Đã nhận hàng
                          </Button>
                          <Divider type="vertical" />
                          <Tag color={getOrderStatus(order.order_status).color}>
                            Trạng thái: {getOrderStatus(order.order_status).label}
                          </Tag>
                        </span>
                      </div>}
                      className="bg-gray-100 border border-gray-600"
                    >
                      <OrderDetailItems
                        order={order}
                        orderGroupStatus={data.order_status}
                        codesByItem={codesByItem}
                        token={undefined}
                        handleUpdateItem={handleUpdateItem}
                        isUpdating={updateItemMutation.isPending}
                        isMyStoreOrder={false} // Tắt tương tác
                      />

                    </Card>
                  ))}
                </Space>
              </>,
              extra: <SettingOutlined />
            },
          ]}
        />




        <Divider className="border-gray-600 my-6" />
        {/* --- Tổng kết và Hành động --- */}
        <div className="flex flex-col space-y-4">
          <p className="text-2xl font-bold text-right text-green-400">
            Tổng tiền tất cả đơn hàng: {formatCurrency(totalOrderPrice)}
          </p>

          {/* Ghi chú */}
          <div>
            <h4 className="text-xl font-semibold border-b border-gray-700 pb-1 mb-2">Ghi chú</h4>
            <p className="whitespace-pre-line text-gray-300 italic">{data.order_group_code || "Không có ghi chú."}</p>
          </div>
          {/* Chỉ hiện nút Xác thực khi trạng thái group là PAID và order là PREPARED */}

          <Button
            type="primary"
            size="large"
            onClick={() => router.push(`/staff/orders/${data.order_group_id}/update-delivery-info`)}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            disabled={!allowUpdateDeliveryInfo}
          >
            Cập nhật thông tin giao hàng
          </Button>

        </div>
      </Card>
    </div>
  );
}