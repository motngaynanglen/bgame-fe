"use client";
import { orderApiRequest } from "@/src/apiRequests/orders";
import { notifyError } from "@/src/components/Notification/Notification";
import { HttpError } from "@/src/lib/httpAxios";
import { formatVND } from "@/src/lib/utils";
import { useCartStore } from "@/src/store/cartStore";
import { Button, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../app-provider";
import PaymentModal from "@/src/components/CheckOut/PaymentModal";
import Image from "next/image";
import { Modal } from "antd";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import userApiRequest from "@/src/apiRequests/user";
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

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentRefID, setPaymentRefID] = useState("");
  const [paymentType] = useState(1); // tạm fix type = 1 (bank)

  const [addresses, setAddresses] = useState<IFormOutputAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>(
    undefined
  );

  const { data, isLoading, refetch: refetchProfile } = useQuery<userProfile>({
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
        title: "Bạn chưa đăng nhập",
        content: "Vui lòng đăng nhập để tiếp tục đặt hàng.",
        okText: (
          <Link href="/login" style={{ color: "white" }}>
            Đăng nhập ngay
          </Link>
        ),
        cancelText: "Đóng",
        okButtonProps: {
          style: { backgroundColor: "#1677ff" }, // giữ style mặc định
        },
      });
      return;
    }

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
    }
  };
  const totalProductCount = productsToCheckout.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalStores = new Set(productsToCheckout.map((item) => item.storeId)).size;

  useEffect(() => {
    setClientOnlyTotal(formatVND(calculateTotal()));
  }, [cart]);
  const isFormReadOnly = !!user?.token;

  return (
    <div className="container mx-auto p-4 bg-sky-50 min-h-screen ">
      <div className="flex flex-col lg:flex-row bg-white shadow-md rounded-lg p-6 ">
        {/* form thông tin giao hàng */}
        <div className="w-full lg:w-2/3 pr-0 lg:pr-4 border-r-2 border-gray-200">
          <div className="flex justify-center items-center mb-6">
            <Image
              src="/assets/icon/logo.png"
              alt="BGImpact logo"
              className="mr-4"
              width={50}
              height={50}
            />
            <h1 className="text-4xl font-bold">BOARD GAME IMPACT</h1>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleCreateOrder)}>
            {/* Trường Email (Chỉ đọc khi đăng nhập) */}
            <input
              type="email"
              disabled={isSubmitting || isLoading}
              readOnly={isFormReadOnly} // Bỏ quyền chỉnh sửa khi đăng nhập
              placeholder="Email"
              className={`w-full p-2 border border-gray-300 rounded ${isFormReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              {...register("email", { required: "Email là bắt buộc" })}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

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
              className={`w-full p-2 border border-gray-300 rounded ${isFormReadOnly && addresses.length > 0
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
              className={`w-full p-2 border border-gray-300 rounded ${isFormReadOnly && addresses.length > 0
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
              className={`w-full p-2 border border-gray-300 rounded ${isFormReadOnly && addresses.length > 0
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

          {productsToCheckout.map((item, index) => {
            const imageUrls = item.image?.split("||") || [];
            return (
              <div
                key={item.id || index}
                className={
                  "flex items-center mb-4 pb-2" +
                  (index === productsToCheckout.length - 1 ? "" : " border-b-2")
                }
              >
                <Image
                  src={imageUrls[0]}
                  alt={item.name || "Product image"}
                  className="object-cover rounded mr-4"
                  width={80}
                  height={80}
                />

                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-md text-gray-600">
                    Giá: {formatVND(item.price)}
                  </p>
                  <p>Số lượng: {item.quantity}</p>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between font-semibold text-xl mt-4">
            <span>Tổng cộng</span>
            <span>{clientOnlyTotal}</span>
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
