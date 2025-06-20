"use client";
import { orderApiRequest, orderItemApiRequest } from "@/src/apiRequests/orders";
import { useAppContext } from "@/src/app/app-provider";
import { notifyError } from "@/src/components/Notification/Notification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Divider, message, Modal, notification } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";

interface OrderItem {
  order_item_id: string;
  product_id: string;
  template_product_name: string;
  product_template_id: string;
  template_image: string;
  current_price: number;
  image: string;
}

interface OrderDetail {
  order_status: string;
  full_name: string;
  address: string;
  phone_number: string;
  total_price: number;
  total_item: number;
  order_code: string;
  order_id: string;
  email: string;
  order_created_at: string;
  order_items: OrderItem[];
}

export default function OrderDetail() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAppContext();

  const [codesByItem, setCodesByItem] = React.useState<Record<string, string>>(
    {}
  );
  const { data, isLoading } = useQuery<OrderDetail>({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await orderApiRequest.getOrderById({
        orderID: id,
      });
      return res.data;
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({
      orderItemId,
      productCode,
    }: {
      orderItemId: string;
      productCode: string;
    }) => {
      return await orderItemApiRequest.updateOrderItem(
        {
          orderID: data!.order_id,
          orderItemId,
          productCode: productCode,
        },
        user?.token
      );
    },
    onSuccess: () => {
      message.success("Cập nhật thành công");
    },
    onError: () => {
      message.error("Có lỗi khi cập nhật. Vui lòng thử lại.");
    },
  });

  const handleCodeChange = (orderItemId: string, value: string) => {
    setCodesByItem((prev) => ({
      ...prev,
      [orderItemId]: value,
    }));
  };
  const handleUpdateToPrepared = () => {
    Modal.confirm({
      title: "Xác nhận đã nhận hàng",
      content: `Bạn có chắn muốn nhận đơn hàng này không? 
      Một khi nhận đơn đồng nghĩa với việc bạn đã nhận được đơn hàng này.`,
      onOk: async () => {
        try {
          // Gọi API để nhận đơn hàng
          const res = await orderApiRequest.updateOrderToPrepared({
            orderID: id,
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
    });
  };
  const handleUpdateItem = (orderItemId: string) => {
    const productCode = codesByItem[orderItemId] || "";
    if (!productCode) {
      message.error("Bạn phải nhập mã code trước khi cập nhật.");
      return;
    }
    updateItemMutation.mutate({ orderItemId, productCode });
  };
  console.log("data", data);
  console.log("data order", data?.order_items);
  // console.log()

  if (isLoading || !data) {
    return <div className="text-white">Loading...</div>;
  }
  console.log("orderItemData", data);




  return (
    <div className="min-h-screen text-white p-4 sm:p-6">
      <div className="w-full mx-auto bg-gray-800 rounded-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-2xl font-bold">MÃ ĐƠN HÀNG: {data.order_code}</h3>
          <span className="text-lg font-semibold">
            Trạng thái:{" "}
            <span className="text-green-400">{data.order_status}</span>
          </span>
        </div>

        <Divider className="border-gray-700" />

        {/* Thông tin người nhận & Thông tin đơn hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin người nhận */}
          <div className="space-y-2">
            <h4 className="text-xl font-semibold border-b border-gray-700 pb-1">
              Thông tin người nhận
            </h4>
            <p>
              <strong>Người nhận:</strong> {data.full_name}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {data.address}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {data.phone_number}
            </p>
          </div>

          {/* Thông tin đơn hàng */}
          <div className="space-y-2">
            <h4 className="text-xl font-semibold border-b border-gray-700 pb-1">
              Thông tin đơn hàng
            </h4>
            {/* <p>
              <strong>Phương thức giao hàng:</strong> {data.}
            </p> */}
            <p>
              <strong>Phương thức thanh toán: Thanh toán chuyển khoảng</strong>
            </p>
            <p>
              <strong>Ngày tạo đơn hàng:</strong> {data.order_created_at}
            </p>
          </div>
        </div>

        <Divider className="border-gray-100" />

        {/* Chi tiết đơn hàng */}
        <div className="space-y-4">
          {/* <h4 className="text-xl font-semibold">Chi tiết đơn hàng</h4> */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold">Chi tiết đơn hàng</h3>
            <table className="min-w-full text-center border-collapse border-2 border-white">
              <colgroup>
                <col className="w-[300px]" />
                <col />
                <col className="w-[80px]" />
                <col className="w-[150px]" />
                <col className="w-[150px]" />
                <col className="w-[200px]" />
              </colgroup>
              <thead>
                <tr>
                  <th className="border border-gray-100 p-2">Mã sản phẩm</th>
                  <th className="border border-gray-100 p-2">Tên sản phẩm</th>
                  <th className="border border-gray-100 p-2">SL</th>
                  <th className="border border-gray-100 p-2">Giá</th>
                  <th className="border border-gray-100 p-2">Thành tiền</th>
                  <th className="border border-gray-100 p-2" hidden={data.order_status !== "CREATED" && data.order_status !== "PAID"}>Code </th>
                  <th className="border border-gray-100 p-2" hidden={data.order_status !== "CREATED" && data.order_status !== "PAID"}></th>
                </tr>
              </thead>
              <tbody>
                {data.order_items.map((item) => (
                  <tr key={item.order_item_id}>
                    <td className="border border-gray-100 p-2">
                      {item.product_id}
                    </td>
                    <td className="border border-gray-100 p-2">
                      {item.template_product_name}
                    </td>
                    <td className="border border-gray-100 p-2">1</td>
                    <td className="border border-gray-100 p-2">
                      {item.current_price.toLocaleString()} VNĐ
                    </td>
                    <td className="border border-gray-100 p-2">
                      {(item.current_price * 1).toLocaleString()} VNĐ
                    </td>
                    <td className="border border-gray-100 p-2" hidden={data.order_status !== "CREATED" && data.order_status !== "PAID"}>
                      <input
                        type="text"
                        className="p-2 w-full bg-gray-800"
                        placeholder="Nhập mã code"
                        value={codesByItem[item.order_item_id] || ""}
                        onChange={(e) =>
                          handleCodeChange(item.order_item_id, e.target.value)
                        }
                      // onBlur={() => handleUpdateItem(item.order_item_id)}
                      />
                    </td>
                    <td className="border border-gray-100 p-2" hidden={data.order_status !== "CREATED" && data.order_status !== "PAID"}>
                      <button
                        className="w-full hover:text-green-500"
                        onClick={() => handleUpdateItem(item.order_item_id)}
                      // disabled={updateItemMutation.isLoading}
                      >
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                ))}
                {/* <tr>
                  <td className="border border-gray-100 p-2">SP001</td>
                  <td className="border border-gray-100 p-2">Sản phẩm 1</td>
                  <td className="border border-gray-100 p-2">1</td>
                  <td className="border border-gray-100 p-2">100.000 VNĐ</td>
                  <td className="border border-gray-100 p-2">100.000 VNĐ</td>
                  <td className="border border-gray-100 ">
                    <input type="text" className="p-2 w-full bg-gray-800" />
                  </td>
                </tr> */}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <h3 className="text-xl font-bold">Tổng tiền: 100.000 VNĐ</h3>
            </div>
            <div>
              <h3 className="text-xl font-bold">Ghi chú: </h3>
              <p>Đơn hàng này là một đơn hàng mẫu.</p>
              <p>Xin vui lòng không xác nhận đơn hàng này.</p>
            </div>
          </div>
          {/* <Table
            rowKey="code"
            pagination={false}
            dataSource={data.order_items.map((item) => ({
              key: item.order_item_id,
              code: item.product_id,
              name: item.template_product_name,
              quantity: 1, // Assuming quantity is always 1 for each item
              price: item.current_price,
              total: item.current_price, // Assuming total is price * quantity
              status: data.order_status,
            }))}
            className="bg-gray-800"
            columns={[
              { title: "Mã SP", dataIndex: "code", key: "code" },
              { title: "Tên SP", dataIndex: "name", key: "name" },
              { title: "SL", dataIndex: "quantity", key: "quantity" },
              {
                title: "Giá",
                dataIndex: "price",
                key: "price",
                render: (v) => `${v.toLocaleString()}₫`,
              },
              {
                title: "Thành tiền",
                dataIndex: "total",
                key: "total",
                render: (v) => `${v.toLocaleString()}₫`,
              },
              { title: "Trạng thái", dataIndex: "status", key: "status" },
            ]}
            bordered
          />

 
          <div className="flex justify-end">
            <span className="text-xl font-bold">
              Tổng tiền: {data.total_price.toLocaleString()}₫
            </span>
          </div> */}

          {/* Ghi chú */}
          {data.order_code && (
            <div>
              <h4 className="text-xl font-semibold">Ghi chú</h4>
              <p className="whitespace-pre-line">{data.order_code}</p>
            </div>
          )}

          {/* Nút xuất hóa đơn */}
          <div className="flex justify-end">
            {(data.order_status === "PAID") && <Button type="primary" onClick={() => handleUpdateToPrepared()}>Xác thực đơn hàng</Button>}
            {(data.order_status === "PREPARED") && <Button type="primary" href={`/staff/orders/${data.order_id}/update-delivery-info`}>Cập nhật thông tin giao hàng</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
