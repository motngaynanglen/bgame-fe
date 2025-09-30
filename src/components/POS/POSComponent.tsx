"use client";
import { orderApiRequest } from "@/src/apiRequests/orders";
import productApiRequest from "@/src/apiRequests/product";
import { useAppContext } from "@/src/app/app-provider";
import { usePOSStore } from "@/src/store/posStore";
import { useMutation } from "@tanstack/react-query";
import type { TableProps } from "antd";
import {
  AutoComplete,
  Button,
  Empty,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  QRCode,
  Space,
  Spin,
  Table,
} from "antd";
import React, { use, useEffect, useState } from "react";
import { notifyError } from "../Notification/Notification";
import transactionApiRequest from "@/src/apiRequests/transaction";
import { AxiosError } from "axios";
import { EntityError } from "@/src/lib/httpAxios";
import PaymentModal from "../CheckOut/PaymentModal";

interface Product {
  id: string;
  key: string;
  product_name: string;
  code: string;
  quantity: number;
  price: number;
  total: string;
  image: string;
}

interface POSComponentProps {
  billIndex: number;
}
interface PaymentData {
  id?: string;
  checkoutUrl?: string;
  qrCode?: string;
}
export default function POSComponent() {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const { user } = useAppContext();

  const {
    bills,
    activeBillIndex,
    addItemToActiveBill,
    updateItemQuantityInActiveBill,
    removeItemFromActiveBill,
    createBill,
    calculateActiveBillTotal,
  } = usePOSStore();
  //  const bill = bills[billIndex];
  const [options, setOptions] = useState<
    { value: string; label: React.ReactNode; product: Product }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<Product[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentData | undefined>(undefined);
  const [errorsItems, setErrorsItems] = useState<string[]>([]);
  const handlePaymentAction = async (id: string) => {
    if (!id) {
      notifyError("Lỗi thanh toán", "Không có dữ liệu thanh toán.");
      return;
    }
    try {
      const res = await transactionApiRequest.performTransaction(
        { referenceID: id, type: 1 },
        user?.token
      );

      setPaymentData({
        id: id,
        checkoutUrl: res.data.checkoutUrl,
        qrCode: res.data.qrCode
      });

      setOpenPaymentModal(true); // mở modal khi vừa tạo xong
      notification.success({
        message: "Thanh toán thành công",
        description: "Đã tạo đơn hàng và lấy thông tin thanh toán."
      });
    } catch (error) {
      notifyError("Lỗi thanh toán", "Có lỗi xảy ra khi xử lý thanh toán.");
      return;
    }
  };
  useEffect(() => {
    setPaymentData(undefined);
  }, [options]);
  useEffect(() => {
    if (activeBillIndex === null) {
      createBill();
    }
  }, [activeBillIndex, createBill]);
  const currentItems =
    activeBillIndex !== null ? bills[activeBillIndex]?.items || [] : [];

  const searchProducts = useMutation({
    mutationFn: async (code: string) => {
      const res = await productApiRequest.getByCode({ code, productType: 1 }, user?.token); // 0: rent, 1 purchase
      return res.data;
    },
    onSuccess: (products) => {
      if (Array.isArray(products) && products.length > 0) {
        const opts = products.map((product: Product) => ({
          value: product.code,
          label: `${product.code} - ${product.product_name} - ${product.price?.toLocaleString?.() || ""
            }đ`,
          product,
        }));
        setOptions(opts);
      } else {
        setOptions([]);
      }
    },
    onError: () => {
      setOptions([]);
    },
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      searchProducts.mutate(value);
    } else {
      setOptions([]);
    }
  };

  const handleSelect = (value: string) => {
    const selected = options.find((o) => o.value === value);
    if (selected) {
      addItemToActiveBill(selected.product);
      setSearchTerm("");
      setOptions([]);
    }
  };

  const totalQuantity = currentItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalAmount = calculateActiveBillTotal().toLocaleString();

  //
  const columns: TableProps<Product>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      width: 50,
      render: (_value, _record, index) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (url) => <Image src={url.split("||")[0]} alt="product" className="w-12 h-12 object-cover" />,
      width: 80,
    },
    {
      title: "Tên hàng",
      dataIndex: "product_name",
      render: (text, record) => (
        <div className="flex items-between">
          <span className="font-medium">{text}</span>
          {/* Hiển thị mã lỗi nếu có */}
          {/* {text} */}
          {errorsItems.includes(record.id) && (
            <span className="text-red-500 ml-2" title="Sản phẩm không hợp lệ">Mã lỗi</span>
          )}
        </div>
      ),
    },
    // {
    //   title: "SL",
    //   dataIndex: "quantity",
    //   width: 100,
    //   render: (value, record) => (
    //     <InputNumber
    //       min={1}
    //       value={value}
    //       onChange={(newQuantity) =>
    //         handleQuantityChange(record.key, newQuantity)
    //       }
    //     />
    //   ),
    // },
    { title: "Đơn giá", dataIndex: "price", width: 150 },
    { title: "Mã", dataIndex: "code", width: 200 },
    {
      title: "",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => removeItemFromActiveBill(record.id)}>Xóa</a>
        </Space>
      ),
    },
  ];
  if (!user) {
    return <div>Vui lòng đăng nhập để sử dụng tính năng này.</div>;
  }

  const handleQuantityChange = (itemId: string, newQuantity: number | null) => {
    if (newQuantity !== null) {
      updateItemQuantityInActiveBill(itemId, newQuantity);
    }
  };

  const handlePayment = async () => {
    if (activeBillIndex === null || !bills[activeBillIndex]) {
      console.error("Không có hóa đơn nào được chọn");
      return;
    }
    Modal.confirm({
      title: "Xác nhận thanh toán",
      content: `Bạn có chắc chắn muốn thanh toán hóa đơn này với tổng tiền ${totalAmount} ₫ không?`,
      onOk: async () => {
        try {
          const currentBill = bills[activeBillIndex!];
          const orders = currentBill.items.map((item) => ({ productId: item.id }));
          if (orders.length === 0) {
            notification.error({ message: "Không có sản phẩm nào trong hóa đơn" });
            return;
          }
          const response = await orderApiRequest.createOrderByStaff({ orders }, user.token);
          handlePaymentAction(response.data);
          notification.success({ message: "Tạo đơn hàng thành công" });
        } catch (error) {
          if (error instanceof EntityError) {
            // Xử lý lỗi 400
            notification.error({ message: error.message || "Lỗi khi tạo đơn hàng" });
            const list = error.data?.errors as string[] || [];
            setErrorsItems(list);
          }
          // notification.error({ message: error.response?.data?.message || "Lỗi khi tạo đơn hàng" });

        }
      }
    });

  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {/* Left Panel - Sản phẩm */}
        <div className="col-span-2 relative">
          <AutoComplete
            className="w-full md:w-96"
            value={searchTerm}
            options={options}
            onSearch={handleSearch}
            onSelect={handleSelect}
            notFoundContent={
              searchProducts.isPending ? (
                <Spin size="small" />
              ) : (
                "Không tìm thấy sản phẩm"
              )
            }
          >
            <Input.Search placeholder="Nhập mã sản phẩm..." enterButton />
          </AutoComplete>

          <Table
            dataSource={currentItems}
            columns={columns}
            pagination={false}
            size="small"
            locale={{ emptyText: <Empty description="No Data" /> }}
          />
        </div>

        {/* Right Panel - Thanh toán */}
        <div className="bg-white border rounded p-4 shadow-sm">
          <div className="mb-2">
            <span className="font-medium text-xl">Tên khách hàng:</span>
            <Input placeholder="Khách lẻ" size="middle" className="mt-1" />
          </div>
          <div className="mb-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-xl">Tổng SL hàng:</span>{" "}
              <span className="text-xl">{totalQuantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xl">Thực thu:</span>{" "}
              <span className="text-xl">{totalAmount}</span>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <h2 className="text-xl font-semibold mb-2">Thanh toán</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="radio" name="payment" className="mr-2" />
                <label className="text-lg">Tiền mặt</label>
                <i className="fas fa-money-bill-wave ml-2"></i>
              </div>
              <div className="flex items-center">
                <input type="radio" name="payment" className="mr-2" />
                <label className="text-lg">Chuyển khoản</label>
                <i className="fas fa-money-bill-wave ml-2"></i>
              </div>
            </div>
          </div>
          {paymentData?.qrCode && (
            <div className="mb-4 ">
              <h2 className="text-xl font-semibold mb-2">QR Code thanh toán</h2>
              <div className="flex justify-center my-4">
                <QRCode value={paymentData.qrCode} size={128} />
              </div>
              <Button className="" type="link" onClick={() => window.open(paymentData.checkoutUrl, '_blank')}>
                Đường dẫn thanh toán
              </Button>
            </div>
          )}
          <Button onClick={handlePayment} type="primary" block size="large">
            THANH TOÁN
          </Button>
          {paymentData?.id && (
            <Button
              onClick={() => setOpenPaymentModal(true)}
              block
              size="middle"
              style={{ marginTop: 8 }}
            >
              Xem / Kiểm tra thanh toán
            </Button>
          )}
        </div>
      </div>
      <PaymentModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        referenceID={paymentData?.id || ""}
        type={1}
        token={user?.token}
      />
    </div>
  );
}
