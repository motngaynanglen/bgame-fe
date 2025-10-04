"use client";
import React, { useEffect, useState } from "react";
import { StoreItem, useCartStore } from "@/src/store/cartStore";
import {
  Card,
  Select,
  Button,
  InputNumber,
  Divider,
  Empty,
  Checkbox,
  Image,
  Tag,
  Alert,
  Badge,
  Space,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  ReloadOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { formatVND } from "@/src/lib/utils";
import storeApiRequest from "@/src/apiRequests/stores";
import { notifyError } from "@/src/components/Notification/Notification";
import type { CheckboxProps } from "antd";
import { useRouter } from "next/navigation";
import PaymentModal from "@/src/components/CheckOut/PaymentModal";
import { useAppContext } from "../../app-provider";

const { Option } = Select;

export default function TemplateForm() {
  const { cart, removeFromCart, updateQuantity, calculateTotal } =
    useCartStore();
  const [clientOnlyTotal, setClientOnlyTotal] = useState("0");
  const [storeLoading, setStoreLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentRefID, setPaymentRefID] = useState("");
  const [paymentType] = useState(1);
  const { user } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    const formatMoney = () => {
      return formatVND(calculateTotal());
    };
    setClientOnlyTotal(formatMoney());
  }, [cart, calculateTotal]);

  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {}
  );

  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Phân chia cart theo storeId
  const cartByStore: Record<string, typeof cart> = {};
  const unassignedItems: typeof cart = [];

  cart.forEach((item) => {
    if (!item.storeId) {
      unassignedItems.push(item);
    } else {
      if (!cartByStore[item.storeId]) {
        cartByStore[item.storeId] = [];
      }
      cartByStore[item.storeId].push(item);
    }
  });

  const handleStoreChange = (itemId: string, newStoreId: string) => {
    const updated = cart.map((item) =>
      item.id === itemId ? { ...item, storeId: newStoreId } : item
    );
    useCartStore.setState({ cart: updated });
  };

  const canCheckout = unassignedItems.length === 0;

  const fetchStoreList = async (templateId: string): Promise<StoreItem[]> => {
    setStoreLoading(true);
    console.log("Fetching store list for templateId:", templateId);
    try {
      const res = await storeApiRequest.getListAndProductCountById(templateId);
      const data: StoreItem[] = res.data;

      return data.map((store: any) => ({
        id: store.store_id,
        name: store.store_name,
        quantity: store.sale_count,
      }));
    } catch (error) {
      notifyError(
        "Có lỗi xảy ra khi tải danh sách cửa hàng.",
        "Vui lòng thử lại sau."
      );
      return [];
    } finally {
      setStoreLoading(false);
    }
  };

  const reloadStoreList = async (templateId: string) => {
    const newStoreList = await fetchStoreList(templateId);
    const updatedCart = cart.map((item) =>
      item.id === templateId ? { ...item, storeList: newStoreList } : item
    );
    useCartStore.setState({ cart: updatedCart });
  };

  const getAvailableQuantity = (item: any) => {
    return (
      item.storeList?.find((store: any) => store.id === item.storeId)
        ?.quantity || 0
    );
  };

  // Hàm xử lý chuyển đến trang checkout
  const handleCheckout = () => {
    if (!user) {
      // Hiển thị modal yêu cầu đăng nhập
      Modal.confirm({
        title: "Đăng nhập để tiếp tục",
        content: "Bạn cần đăng nhập để tiến hành thanh toán.",
        okText: "Đăng nhập ngay",
        cancelText: "Tiếp tục mua sắm",
        // icon: <LoginOutlined />,
        onOk: () => router.push("/login"),
        okButtonProps: {
          type: "primary",
          style: { backgroundColor: "#1677ff" },
        },
        cancelButtonProps: {
          type: "default",
        },
      });
      return;
    }

    // Kiểm tra xem tất cả sản phẩm đã có storeId chưa
    const unassignedItems = cart.filter((item) => !item.storeId);
    if (unassignedItems.length > 0) {
      notifyError(
        "Vui lòng chọn cửa hàng",
        "Có sản phẩm chưa được chọn cửa hàng. Vui lòng kiểm tra lại."
      );
      return;
    }

    // Chuyển đến trang checkout
    router.push("/check-out");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              Quay lại
            </Button> */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Giỏ Hàng</h1>
              {/* <p className="text-gray-600 mt-1">
                {cart.length} sản phẩm trong giỏ hàng
              </p> */}
            </div>
          </div>
        </div>

        {/* Warning for unassigned items */}
        {unassignedItems.length > 0 && (
          <Alert
            message="Cần chọn cửa hàng"
            description={`Có ${unassignedItems.length} sản phẩm chưa được chọn cửa hàng. Vui lòng chọn cửa hàng để tiếp tục thanh toán.`}
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            className="mb-6 rounded-xl"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Unassigned Items */}
            {unassignedItems.length > 0 && (
              <Card
                className="border-orange-200 shadow-sm"
                title={
                  <div className="flex items-center gap-2 text-orange-600">
                    <WarningOutlined />
                    <span>Sản phẩm chưa chọn cửa hàng</span>
                    <Tag color="orange">{unassignedItems.length}</Tag>
                  </div>
                }
              >
                <div className="space-y-4">
                  {unassignedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <div className="flex gap-4 flex-1">
                        <Image
                          width={80}
                          height={80}
                          src={item.image}
                          alt={item.name || "Product image"}
                          className="rounded-lg object-cover flex-shrink-0"
                          preview={false}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {item.name}
                          </h3>
                          <p className="text-lg font-bold text-green-600 mb-2">
                            {formatVND(item.price)}
                          </p>
                          <div className="flex items-center gap-4">
                            <InputNumber
                              min={1}
                              max={item.storeList
                                ?.map((store) => store.quantity)
                                .reduce((a, b) => Math.max(a, b), 0)}
                              value={item.quantity}
                              onChange={(val) =>
                                updateQuantity(item.id, val || 1)
                              }
                              size="small"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 min-w-[200px]">
                        <div className="flex gap-2">
                          <Select
                            disabled={storeLoading}
                            loading={storeLoading}
                            showSearch
                            placeholder="Chọn cửa hàng"
                            style={{ width: 200 }}
                            optionFilterProp="children"
                            onChange={(val) => handleStoreChange(item.id, val)}
                            className="flex-1"
                          >
                            {item.storeList?.map((store) => (
                              <Option
                                key={store.id}
                                value={store.id}
                                disabled={store.quantity < item.quantity}
                              >
                                {store.name} ({store.quantity} sẵn có)
                              </Option>
                            ))}
                          </Select>
                          <Button
                            icon={<ReloadOutlined />}
                            onClick={() => reloadStoreList(item.id)}
                            loading={storeLoading}
                          />
                        </div>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeFromCart(item.id)}
                          size="small"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Items by Store */}
            {Object.entries(cartByStore).map(([storeId, items]) => {
              const storeName = items[0].storeList?.find(
                (store) => store.id === storeId
              )?.name;

              return (
                <Card
                  key={storeId}
                  className="shadow-sm border-0"
                  title={
                    <div className="flex items-center gap-3">
                      <CheckCircleOutlined className="text-green-500" />
                      <span className="font-semibold text-gray-900">
                        {storeName}
                      </span>
                      <Tag color="green" className="ml-2">
                        {items.length} sản phẩm
                      </Tag>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex gap-4 flex-1">
                          {/* <Checkbox
                            checked={selectedItems[item.id] || false}
                            onChange={() => handleCheckboxChange(item.id)}
                            className="mt-2"
                          /> */}
                          <Image
                            width={80}
                            height={80}
                            src={item.image}
                            alt={item.name || "Product image"}
                            className="rounded-lg object-cover flex-shrink-0"
                            preview={false}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                              {item.name}
                            </h3>
                            <p className="text-lg font-bold text-green-600 mb-2">
                              {formatVND(item.price)}
                            </p>
                            <div className="flex items-center gap-4">
                              <InputNumber
                                min={1}
                                max={getAvailableQuantity(item)}
                                value={item.quantity}
                                onChange={(val) =>
                                  updateQuantity(item.id, val || 1)
                                }
                                size="small"
                              />
                              <span className="text-sm text-gray-500">
                                Còn {getAvailableQuantity(item)} sản phẩm
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px]">
                          <div className="flex gap-2">
                            <Select
                              value={item.storeId}
                              onChange={(val) =>
                                handleStoreChange(item.id, val)
                              }
                              optionFilterProp="children"
                              className="flex-1"
                              size="small"
                            >
                              {item.storeList?.map((store) => (
                                <Option
                                  key={store.id}
                                  value={store.id}
                                  disabled={store.quantity < item.quantity}
                                >
                                  {store.name} ({store.quantity} sẵn có)
                                </Option>
                              ))}
                            </Select>
                            <Button
                              icon={<ReloadOutlined />}
                              onClick={() => reloadStoreList(item.id)}
                              size="small"
                            />
                          </div>
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeFromCart(item.id)}
                            size="small"
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}

            {/* Empty Cart */}
            {cart.length === 0 && (
              <Card className="text-center py-12">
                <Empty
                  description="Giỏ hàng của bạn đang trống"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <Link href="/products">
                  <Button type="primary" size="large" className="mt-4">
                    <ShoppingOutlined />
                    Tìm mua sản phẩm
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          {/* {cart.length > 0 && ( */}
          <div className="lg:col-span-1">
            <Card
              className="sticky top-4 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-100"
              title={
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">📦 Đơn Hàng</span>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Tổng tiền:</span>
                  <span className="font-bold text-2xl text-green-600">
                    {clientOnlyTotal}
                  </span>
                </div>

                <Divider className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Số sản phẩm:</span>
                    <span>{cart.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số cửa hàng:</span>
                    <span>{Object.keys(cartByStore).length}</span>
                  </div>
                  {/* <div className="flex justify-between text-green-500">
                    <span>Miễn phí vận chuyển</span>
                    <span>0₫</span>
                  </div> */}
                </div>

                <Divider className="my-4" />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      size="large"
                      block
                      className="h-12 font-semibold"
                      disabled={!canCheckout}
                      onClick={handleCheckout}
                      icon={<CheckCircleOutlined />}
                    >
                      {user
                        ? "Tiến Hành Thanh Toán"
                        : "Đăng Nhập Để Thanh Toán"}
                    </Button>

                    <Link href="/products">
                      <Button
                        size="large"
                        block
                        className="h-12"
                        icon={<ArrowLeftOutlined />}
                      >
                        Tiếp Tục Mua Hàng
                      </Button>
                    </Link>
                  </Space>
                </div>

                {!canCheckout && (
                  <Alert
                    message="Vui lòng chọn cửa hàng cho tất cả sản phẩm"
                    type="info"
                    showIcon
                    className="mt-4 rounded-lg"
                  />
                )}

                {/* {!user && (
                  <Alert
                    message="Cần đăng nhập"
                    description="Bạn cần đăng nhập để tiến hành thanh toán"
                    type="warning"
                    showIcon
                    className="mt-4 rounded-lg"
                  />
                )} */}
              </div>
            </Card>
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
// "use client";
// import { useCartStore } from "@/src/store/cartStore";
// import { Button, Divider, Empty, Image, Input, InputNumber, Space } from "antd";
// import { useRouter } from "next/navigation";
// import { IoIosClose } from "react-icons/io";
// import TemplateForm from "./templateForm";

// export default function ShoppingCartPage() {
//   return (
//     <>
//       <TemplateForm />
//     </>
//   );
// }

// export default function ShoppingCart() {
//   const { cart, removeFromCart, clearCart, calculateTotal, updateQuantity } =
//     useCartStore();
//   const router = useRouter();
//   return (
//     <div className="min-h-screen text-white pt-2 sm:p-4">
//       <div className="max-w-5xl mx-auto space-y-8  border-4 border-gray-800 p-4 rounded-lg bg-gray-900">
//         {/* Shopping Cart Header */}
//         <h2 className="text-2xl font-bold ">Giỏ Hàng </h2>
//         <TemplateForm />
//         {/* tiêu đề */}
//         <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr_1fr_0.5fr] bg-gray-800 p-4 rounded-lg ">
//           <div className="flex items-center justify-start ">
//             <h1 className="">Sản phẩm</h1>
//           </div>
//           <div className="flex items-center justify-center space-x-4">
//             Số lượng
//           </div>
//           <div className="flex items-center justify-center space-x-4">Giá</div>

//           <div className="flex items-center justify-center space-x-4">
//             Tạm tính
//           </div>
//           <div className="flex items-center justify-center">
//             {/* Để trống, cột delete */}
//           </div>
//         </div>
//         {/* Cart Items */}
//         <div className="space-y-4">
//           {cart.length === 0 ? (
//             <div className="text-white">
//               <Empty
//                 description={
//                   <span className="text-white">
//                     Không có sản phẩm trong giỏ hàng
//                   </span>
//                 }
//                 image={Empty.PRESENTED_IMAGE_SIMPLE}
//               >
//                 <Button onClick={() => router.push("/products")} type="primary">
//                   Tìm mua sản phẩm
//                 </Button>
//               </Empty>
//             </div>
//           ) : (
//             <div>
//               {cart.map((item, index) => {
//                 const imageUrls = item.image?.split("||") || [];
//                 return (
//                   <div
//                     key={index}
//                     className="bg-gray-800 p-4 rounded-lg mb-4 flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr_1fr_0.5fr] items-center"
//                   >
//                     {/* image and name */}
//                     <div className="flex flex-row sm:items-start sm:justify-around md:items-center md:justify-start">
//                       <Image
//                         style={{ borderRadius: "0.5rem" }}
//                         width={96}
//                         height={96}
//                         src={imageUrls[0]}
//                         // alt={item.name}
//                         className="w-24 h-24 object-cover rounded-lg mr-2 sm:pr-0"
//                         loading="lazy"
//                       />
//                       <Divider type="vertical" className="" />
//                       <div className="ml-4 sm:ml-0 mr-4">
//                         <h1 className="text-lg font-semibold">{item.name}</h1>
//                         <div className="text-blue-400 font-bold sm:hidden">
//                           {item.price.toLocaleString("vi-VN")}₫
//                         </div>
//                         <div className="flex items-center justify-center space-x-4 sm:hidden">
//                           <InputNumber min={1} defaultValue={item.quantity} />
//                         </div>
//                       </div>

//                       <button
//                         className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 sm:hidden"
//                         onClick={() => removeFromCart(item.id)}
//                       >
//                         {/* Delete icon */}
//                       </button>
//                     </div>

//                     {/* quantity */}
//                     <div className="hidden sm:flex items-center justify-center space-x-4">
//                       <InputNumber
//                         min={1}
//                         defaultValue={item.quantity}
//                         onChange={(value) =>
//                           updateQuantity(item.id, value || 1)
//                         }
//                       />
//                     </div>
//                     <div className="hidden sm:flex items-center justify-center space-x-4">
//                       {item.price.toLocaleString("vi-VN")}
//                     </div>
//                     {/* tạm tính */}
//                     <div className="hidden sm:flex items-center justify-center space-x-4 ">
//                       {(item.price * item.quantity).toLocaleString("vi-VN")}
//                     </div>
//                     {/* Delete Icon */}
//                     <div className="hidden sm:flex items-center justify-center">
//                       <button
//                         className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600"
//                         onClick={() => removeFromCart(item.id)}
//                       >
//                         <IoIosClose />
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Order Summary */}
//         <div className="bg-gray-800 p-6 rounded-lg space-y-4">
//           <h3 className="text-lg font-semibold text-center sm:text-left">
//             Hóa đơn
//           </h3>
//           <div className="space-y-2">
//             {/* <div className="flex justify-between">
//               <span>Original price</span>
//               <span>$6,592.00</span>
//             </div>
//             <div className="flex justify-between text-green-500">
//               <span>Savings</span>
//               <span>-$299.00</span>
//             </div> */}
//             <div className="flex justify-between">
//               <span className="basis-2/3">Mã giảm giá</span>
//               <input
//                 type="text"
//                 id="standard_success"
//                 aria-describedby="standard_success_help"
//                 className="basis-1/2 block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-green-600 appearance-none dark:text-white dark:border-green-500 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
//                 placeholder="Nhập mã giảm giá"
//               />
//             </div>
//             <div className="flex justify-between">
//               <span>Phí giao hàng</span>
//               <span>0₫</span>
//             </div>
//             {/* <div className="flex justify-between">
//               <span>Tax</span>
//               <span>$799</span>
//             </div> */}
//           </div>
//           <div className="border-t border-gray-700 pt-4 flex justify-between font-bold text-lg">
//             <span>Tổng tiền: </span>
//             <span> {calculateTotal().toLocaleString("vi-VN")}₫</span>
//           </div>
//         </div>

//         {/* Action Buttons */}
// <div className="flex justify-between">
//   <button
//     type="button"
//     className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
//   >
//     Tiếp tục mua hàng
//   </button>
//   <button
//     className={`bg-blue-600 text-white px-6 py-3 rounded-lg ${
//       cart.length === 0
//         ? "opacity-50 cursor-not-allowed"
//         : "hover:bg-blue-500"
//     }`}
//     disabled={cart.length === 0}
//     onClick={() => router.push("/check-out")}
//   >
//     Tiến hành thanh toán
//   </button>
// </div>
//       </div>
//     </div>
//   );
// }
