"use client";
import { orderApiRequest } from "@/src/apiRequests/orders";
import { notifyError } from "@/src/components/Notification/Notification";
import { HttpError } from "@/src/lib/httpAxios";
import { formatVND } from "@/src/lib/utils";
import { useCartStore } from "@/src/store/cartStore";
import { Button, Card, Divider, Tag, Alert, Spin } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../app-provider";
import PaymentModal from "@/src/components/CheckOut/PaymentModal";
import Image from "next/image";
import { Modal } from "antd";
import Link from "next/link";
import { 
  ArrowLeftOutlined, 
  ShoppingOutlined, 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  CheckCircleOutlined,
  MoreOutlined,
  
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import userApiRequest from "@/src/apiRequests/user";

interface FormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
}

interface userProfile {
  personID: string;
  full_name: string;
  address: string;
  phone_number: string;
  email: string;
  gender: string;
  date_of_birth: string;
  image: string;
}

export default function CheckOut() {
  const { cart, calculateTotal, clearCart, buyNowItem } = useCartStore();
  const { user } = useAppContext();
  const productsToCheckout = buyNowItem ? [buyNowItem] : cart;
  const [clientOnlyTotal, setClientOnlyTotal] = useState("0");
  const [loading, setLoading] = useState(false);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentRefID, setPaymentRefID] = useState("");
  const [paymentType] = useState(1);
  

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue
  } = useForm<FormData>();



  const { data, isLoading } = useQuery<userProfile>({
    queryKey: ["userProfile", user?.token],
    queryFn: async () => {
      if (!user?.token) {
        throw new Error("User token is not available");
      }
      const res = await userApiRequest.getProfile(user?.token);
      return res.data;
    },
  });

    useEffect(() => {
    if (data) {
      setValue("email", data?.email || "");
      setValue("fullName", data?.full_name || "");
      setValue("phoneNumber", data?.phone_number || "");
      setValue("address", data?.address || "");
    }
  }, [user, setValue]);

  
  // // Pre-fill user data if available



  const handleCreateOrder = async (formData: FormData) => {
    if (!user?.token) {
      Modal.confirm({
        title: "Đăng nhập để tiếp tục",
        content: "Bạn cần đăng nhập để hoàn tất đặt hàng.",
        okText: "Đăng nhập ngay",
        cancelText: "Đóng",
        onOk: () => window.location.href = "/login",
        okButtonProps: { 
          style: { backgroundColor: '#1677ff', borderColor: '#1677ff' } 
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
      const res = await orderApiRequest.createOrderByCustomer(body, user?.token);
      if (res.statusCode === "200") {
        clearCart();
        setPaymentRefID(res.data);
        setPaymentModalOpen(true);
      } else {
        notifyError("Đặt hàng thất bại", res.message || "Vui lòng thử lại.");
      }
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        notifyError("Đặt hàng thất bại", "Bạn cần thanh toán sản phẩm đã mua trước đó.");
      } else {
        console.error("Lỗi khác:", error);
        notifyError("Đặt hàng thất bại", "Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalProductCount = productsToCheckout.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalStores = new Set(productsToCheckout.map((item) => item.storeId)).size;

  useEffect(() => {
    setClientOnlyTotal(formatVND(calculateTotal()));
  }, [cart, calculateTotal]);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card 
              className="shadow-lg border-0 rounded-2xl"
              title={
                <div className="flex items-center gap-3">
                  <UserOutlined className="text-blue-500 text-xl" />
                  <span className="text-xl font-semibold">Thông tin giao hàng</span>
                </div>
              }
            >
              <form className="space-y-6" onSubmit={handleSubmit(handleCreateOrder)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <MailOutlined className="mr-2 text-gray-400" />
                      Email *
                    </label>
                    <input
                      type="email"
                      disabled={isSubmitting}
                      placeholder="your@email.com"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      {...register("email", { 
                        required: "Email là bắt buộc",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Email không hợp lệ"
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <PhoneOutlined className="mr-2 text-gray-400" />
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      disabled={isSubmitting}
                      placeholder="0123 456 789"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      {...register("phoneNumber", { 
                        required: "Số điện thoại là bắt buộc",
                        pattern: {
                          value: /^[0-9+\-\s()]{10,}$/,
                          message: "Số điện thoại không hợp lệ"
                        }
                      })}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <UserOutlined className="mr-2 text-gray-400" />
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="Nguyễn Văn A"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    {...register("fullName", { 
                      required: "Họ và tên là bắt buộc",
                      minLength: {
                        value: 2,
                        message: "Tên phải có ít nhất 2 ký tự"
                      }
                    })}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <EnvironmentOutlined className="mr-2 text-gray-400" />
                    Địa chỉ giao hàng *
                  </label>
                  <textarea
                    disabled={isSubmitting}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, thành phố"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    {...register("address", { 
                      required: "Địa chỉ là bắt buộc",
                      minLength: {
                        value: 10,
                        message: "Địa chỉ phải có ít nhất 10 ký tự"
                      }
                    })}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  htmlType="submit"
                  disabled={isSubmitting || loading}
                  loading={isSubmitting || loading}
                  size="large"
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                  icon={<CheckCircleOutlined />}
                >
                  {isSubmitting || loading ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG & THANH TOÁN"}
                </Button>
              </form>
            </Card>            
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
                  <div className="font-bold text-lg text-blue-600">{totalProductCount}</div>
                  <div className="text-sm text-gray-600">Sản phẩm</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-green-600">{totalStores}</div>
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
                              {item.storeList?.find(store => store.id === item.storeId)?.name}
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
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        referenceID={paymentRefID}
        type={paymentType}
        token={user?.token}
      />
    </div>
  );
}