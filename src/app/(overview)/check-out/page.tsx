"use client";
import { orderApiRequest } from "@/src/apiRequests/orders";
import { notifyError } from "@/src/components/Notification/Notification";
import { HttpError } from "@/src/lib/httpAxios";
import { formatVND } from "@/src/lib/utils";
import { useCartStore } from "@/src/store/cartStore";
import { Button, Card, Divider, Tag, Alert, Spin, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../app-provider";
import PaymentModal from "@/src/components/CheckOut/PaymentModal";
import Image from "next/image";
import { Modal } from "antd";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import userApiRequest from "@/src/apiRequests/user";
import {
  CheckCircleOutlined,
  MoreOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
interface FormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
}
interface userProfile {
  full_name: string;
  address: IFormOutputAddress[];
  phone_number: string;
  email: string;
  gender: number;
  date_of_birth: Date;
  image: string;
}
interface IFormOutputAddress {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
}
export default function CheckOut() {
  const { cart, calculateTotal, clearCart, buyNowItem } = useCartStore();
  const { user } = useAppContext();
  const productsToCheckout = buyNowItem ? [buyNowItem] : cart;
  const [clientOnlyTotal, setClientOnlyTotal] = useState("0");
  const [loading, setLoading] = useState(false);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentRefID, setPaymentRefID] = useState("");
  const [paymentType] = useState(1); // tạm fix type = 1 (bank)

  const [addresses, setAddresses] = useState<IFormOutputAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<
    number | undefined
  >(undefined);

  const {
    data,
    isLoading,
    refetch: refetchProfile,
  } = useQuery<userProfile>({
    queryKey: ["userProfile", user?.token],
    queryFn: async () => {
      if (!user?.token) {
        return;
      }
      const res = await userApiRequest.getProfile(user?.token);
      return res.data;
    },
  });

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setValue,
  } = useForm<FormData>();

  const populateForm = useCallback(
    (profileData: userProfile | undefined) => {
      if (profileData) {
        // Tự động điền thông tin cá nhân (Email, Họ tên, SĐT)
        reset({
          email: profileData.email || "",
          fullName: profileData.full_name || "",
          phoneNumber: profileData.phone_number || "",
          address: "", // Sẽ được điền từ địa chỉ đã chọn
        });

        // Xử lý và thiết lập địa chỉ
        if (profileData.address && profileData.address.length > 0) {
          const addressesWithId = profileData.address.map((addr, index) => ({
            ...addr,
            id: index + 1, // Dùng index + 1 làm ID tạm nếu API không trả về
          }));
          setAddresses(addressesWithId);

          // Tự động chọn địa chỉ đầu tiên và điền vào form
          const firstAddress = addressesWithId[0];
          setSelectedAddressId(firstAddress.id);
          setValue("address", firstAddress.address, { shouldValidate: true });
          setValue("fullName", firstAddress.name, { shouldValidate: true });
          setValue("phoneNumber", firstAddress.phoneNumber, {
            shouldValidate: true,
          });
        }
      } else {
        // Nếu không có dữ liệu người dùng (chưa đăng nhập), reset form
        reset();
        setAddresses([]);
        setSelectedAddressId(undefined);
      }
    },
    [reset, setValue]
  );

  useEffect(() => {
    if (data) {
      populateForm(data);
    } else if (!user?.token) {
      populateForm(undefined);
    }
  }, [data, user?.token, populateForm]);

  const handleAddressChange = (addressId: number) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find((addr) => addr.id === addressId);
    if (selectedAddress) {
      // Cập nhật các trường form tương ứng với địa chỉ được chọn
      setValue("address", selectedAddress.address, { shouldValidate: true });
      setValue("fullName", selectedAddress.name, { shouldValidate: true });
      setValue("phoneNumber", selectedAddress.phoneNumber, {
        shouldValidate: true,
      });
      // Email nên được giữ lại từ profile
    }
  };
  const handleCreateOrder = async (formData: FormData) => {
    if (!user?.token) {
      Modal.confirm({
        title: "Đăng nhập để tiếp tục",
        content: "Bạn cần đăng nhập để hoàn tất đặt hàng.",
        okText: "Đăng nhập ngay",
        cancelText: "Đóng",
        onOk: () => (window.location.href = "/login"),
        okButtonProps: {
          style: { backgroundColor: "#1677ff", borderColor: "#1677ff" },
        },
      });
      return;
    }

    setLoading(true);
    const body = {
      orders: cart.map((item) => ({
        storeId: item.storeId,
        productTemplateID: item.id,
        quantity: item.quantity,
      })),
      email: formData.email,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
    };

    try {
      const res = await orderApiRequest.createOrderByCustomer(
        body,
        user?.token
      );
      if (res.statusCode === "200") {
        clearCart();
        setPaymentRefID(res.data);
        setPaymentModalOpen(true);
      } else {
        notifyError("Đặt hàng thất bại", res.message || "Vui lòng thử lại.");
      }
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        notifyError(
          "Đặt hàng thất bại",
          "Bạn cần thanh toán sản phẩm đã mua trước đó."
        );
      } else {
        console.error("Lỗi khác:", error);
        notifyError(
          "Đặt hàng thất bại",
          "Có lỗi xảy ra. Vui lòng thử lại sau."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const totalProductCount = productsToCheckout.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalStores = new Set(productsToCheckout.map((item) => item.storeId))
    .size;

  useEffect(() => {
    setClientOnlyTotal(formatVND(calculateTotal()));
  }, [cart]);
  const isFormReadOnly = !!user?.token;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {/* <Link href="/cart">
            <Button icon={<ArrowLeftOutlined />} className="flex items-center gap-2">
              Quay lại giỏ hàng
            </Button>
          </Link> */}
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Thanh Toán</h1>
            <p className="text-gray-600 mt-2">Hoàn tất đơn hàng của bạn</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(handleCreateOrder)}>
          {/* Trường Email (Chỉ đọc khi đăng nhập) */}
          <input
            type="email"
            disabled={isSubmitting || isLoading}
            readOnly={isFormReadOnly} // Bỏ quyền chỉnh sửa khi đăng nhập
            placeholder="Email"
            className={`w-full p-2 border border-gray-300 rounded ${
              isFormReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            {...register("email", { required: "Email là bắt buộc" })}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          {/* Dropdown chọn địa chỉ (Chỉ hiển thị khi đăng nhập và có địa chỉ) */}
          {isFormReadOnly && addresses.length > 0 && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Chọn địa chỉ đã lưu:
              </label>
              <Select
                value={selectedAddressId}
                style={{ width: "100%" }}
                placeholder="Chọn một địa chỉ"
                onChange={handleAddressChange}
                disabled={isSubmitting || isLoading}
                options={addresses.map((addr) => ({
                  value: addr.id,
                  label: `${addr.name} - ${addr.phoneNumber} - ${addr.address}`,
                }))}
              />
            </div>
          )}

          {/* Trường Họ và tên (Chỉ đọc khi đăng nhập và có địa chỉ) */}
          <input
            type="text"
            disabled={isSubmitting || isLoading}
            readOnly={isFormReadOnly && addresses.length > 0} // Chỉ đọc khi chọn địa chỉ
            placeholder="Họ và tên"
            className={`w-full p-2 border border-gray-300 rounded ${
              isFormReadOnly && addresses.length > 0
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
            {...register("fullName", { required: "Họ và tên là bắt buộc" })}
          />
          {errors.fullName && (
            <p className="text-red-500">{errors.fullName.message}</p>
          )}

          {/* Trường Số điện thoại (Chỉ đọc khi đăng nhập và có địa chỉ) */}
          <input
            type="tel"
            disabled={isSubmitting || isLoading}
            readOnly={isFormReadOnly && addresses.length > 0} // Chỉ đọc khi chọn địa chỉ
            placeholder="Số điện thoại"
            className={`w-full p-2 border border-gray-300 rounded ${
              isFormReadOnly && addresses.length > 0
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
            {...register("phoneNumber", {
              required: "Số điện thoại là bắt buộc",
            })}
          />
          {errors.phoneNumber && (
            <p className="text-red-500">{errors.phoneNumber.message}</p>
          )}

          {/* Trường Địa chỉ (Chỉ đọc khi đăng nhập và có địa chỉ) */}
          <input
            type="text"
            disabled={isSubmitting || isLoading}
            readOnly={isFormReadOnly && addresses.length > 0} // Chỉ đọc khi chọn địa chỉ
            placeholder="Địa chỉ"
            className={`w-full p-2 border border-gray-300 rounded ${
              isFormReadOnly && addresses.length > 0
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
            {...register("address", { required: "Địa chỉ là bắt buộc" })}
          />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}

          <div className="flex justify-between items-center mt-4">
            <a href="/cart" className="text-blue-500">
              Quay về giỏ hàng
            </a>
            <Button
              htmlType="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="bg-green-500 text-white p-2 rounded"
            >
              ĐẶT HÀNG
            </Button>
          </div>
        </form>
      </div>

      {/* danh sách sản phẩm */}
      <div className="w-full ps-4 lg:w-1/3 mt-6 lg:mt-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold mb-2">Đơn hàng:</h2>
          <span>
            Gồm {totalProductCount} sản phẩm, từ {totalStores} cửa hàng
          </span>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card
            className="shadow-lg border-0 rounded-2xl sticky top-4"
            title={
              <div className="flex items-center gap-3">
                <ShoppingOutlined className="text-blue-500 text-xl" />
                <span className="text-xl font-semibold">Đơn hàng của bạn</span>
              </div>
            }
          >
            {/* Order Stats */}
            <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-center">
                <div className="font-bold text-lg text-blue-600">
                  {totalProductCount}
                </div>
                <div className="text-sm text-gray-600">Sản phẩm</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-600">
                  {totalStores}
                </div>
                <div className="text-sm text-gray-600">Cửa hàng</div>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Products List */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {productsToCheckout.map((item, index) => {
                const imageUrls = item.image?.split("||") || [];
                return (
                  <div
                    key={item.id || index}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <Image
                      src={imageUrls[0]}
                      alt={item.name || "Product image"}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                        {item.name}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>Số lượng: {item.quantity}</span>
                        <span className="font-semibold text-green-600">
                          {formatVND(item.price * item.quantity)}
                        </span>
                      </div>
                      {item.storeId && (
                        <div className="flex items-center gap-1 mt-1">
                          <MoreOutlined className="text-gray-400 text-xs" />
                          <span className="text-xs text-gray-500">
                            {
                              item.storeList?.find(
                                (store) => store.id === item.storeId
                              )?.name
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Divider className="my-4" />

            {/* Total */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Tổng cộng:</span>
                <span className="font-bold text-2xl text-green-600">
                  {clientOnlyTotal}
                </span>
              </div>

              <div className="text-center text-sm text-gray-500 mt-4">
                <CheckCircleOutlined className="text-green-500 mr-2" />
                Miễn phí vận chuyển toàn quốc
              </div>
            </div>
          </Card>

          {/* Support Info */}
          {/* <Card className="mt-4 shadow-sm border-0 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-100">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">📞 Cần hỗ trợ?</div>
                <p className="text-sm text-gray-600 mb-2">
                  Liên hệ hotline: <strong>0123 456 789</strong>
                </p>
                <p className="text-xs text-gray-500">
                  Chúng tôi sẵn sàng hỗ trợ 24/7
                </p>
              </div>
            </Card> */}
        </div>
      </div>
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        referenceID={paymentRefID}
        type={paymentType}
        token={user?.token}
      />
    </div>

    //   {/* Payment Modal */}
    // <PaymentModal
    //   open={paymentModalOpen}
    //   onClose={() => setPaymentModalOpen(false)}
    //   referenceID={paymentRefID}
    //   type={paymentType}
    //   token={user?.token}
    // />
    // </div>
  );
}
