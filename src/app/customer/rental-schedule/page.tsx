"use client";

import bookListApiRequest from "@/src/apiRequests/bookList";
import { useRentalStore } from "@/src/store/rentalStore";
import { useQuery } from "@tanstack/react-query";
import { Button, Empty } from "antd";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../app-provider";

interface items {
  product_name: string;
  rent_price: number;
  image: string;
  rent_price_per_hour: number;
  condition: string;
  status: string;
}
interface Booklist {
  id: string;
  customer_id: string;
  from: string;
  to: string;
  type: number;
  total_price: number;
  status: string;
  items: items[];
}
interface responseModel {
  data: Booklist[];
  message: string;
  statusCode: number;
  paging: null;
}

const RentalHistory = () => {
  const { cartItems } = useRentalStore();
  const { user } = useAppContext();
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      dateStyle: "medium",
      // timeStyle: "short",
    });
  const router = useRouter();

  const formatCurrency = (price: number) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // const getStatusColor = (status: OrderStatus) => {
  //   switch (status) {
  //     case "DELIVERING":
  //       return "text-yellow-500";
  //     case "SENT":
  //       return "text-green-500";
  //     case "CANCELLED":
  //       return "text-red-500";
  //     default:
  //       return "text-gray-400";
  //   }
  // };

  const { data, isLoading, isError, error } = useQuery<responseModel>({
    queryKey: ["rentalHistory"],
    queryFn: async () => {
      // Hàm gọi API
      const res = await bookListApiRequest.getBookListHistory(
        {
          paging: {
            pageNum: 1,
            pageSize: 10,
          },
        },
        user?.token
      );
      return res;
    },
  });

  console.log("RentalHistory", data);
  console.log("data", data?.data);
  return (
    <div className=" p-4 w-full bg-white mt-2 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Lịch sử thuê</h2>

      {Array.isArray(data?.data) && data.data.length === 0 ? (
        <Empty description={<span>Bạn chưa có đơn đặt thuê</span>}>
          <Button onClick={() => router.push("/rental")} type="primary">
            Tìm thuê board game
          </Button>
        </Empty>
      ) : (
        Array.isArray(data?.data) &&
        data.data.map((rental, index) => (
          <section className="relative">
            <div className="w-full  mx-auto ">
              <div className="mt-7 border border-gray-300 pt-9">
                <div className="flex max-md:flex-col items-center justify-between px-3 md:px-11">
                  <div className="data">
                    <p className="font-medium text-lg leading-8 text-black whitespace-nowrap">
                      Mã đơn hàng : #10234987
                    </p>
                    <p className="font-medium text-lg leading-8 text-black mt-3 whitespace-nowrap">
                      Thời gian thuê : {formatDate(rental.from)} -{" "}
                      {formatDate(rental.to)}
                    </p>
                  </div>
                  <div className="data">
                    <p className="font-medium text-lg leading-8 text-black whitespace-nowrap">
                      Phương thức thuê :{" "}
                      {rental.type === 1 ? "Thuê theo ngày" : "Thuê theo giờ"}
                    </p>
                    <p className="font-medium text-lg leading-8 text-black mt-3 whitespace-nowrap">
                      Trạng thái :{" "}
                      {rental.status === "CREATED"
                        ? "Mới tạo"
                        : rental.status === "PAID"
                        ? "Đã thanh toán"
                        : rental.status === "CANCELLED"
                        ? "Đã hủy"
                        : rental.status === "STARTED"
                        ? "Đang thuê"
                        : rental.status === "ENDED"
                        ? "Đã kết thúc"
                        : rental.status === "OVERDUE"
                        ? "Quá hạn"
                        : "Chờ xác nhận"}
                    </p>
                  </div>
                </div>

                {rental.items.map((item, itemIndex) => (
                  <div>
                    <svg
                      className="my-9 w-full"
                      xmlns="http://www.w3.org/2000/svg"
                      width="1216"
                      height="2"
                      viewBox="0 0 1216 2"
                      fill="none"
                    >
                      <path d="M0 1H1216" stroke="#D1D5DB" />
                    </svg>
                    <div className="flex max-lg:flex-col items-center gap-8 lg:gap-24 px-3 md:px-11">
                      <div className="grid grid-cols-4 w-full">
                        <div className="col-span-4 sm:col-span-1">
                          <img
                            src={
                              item.image ||
                              "https://pagedone.io/asset/uploads/1705474774.png"
                            }
                            alt=""
                            className="max-sm:mx-auto object-cover"
                          />
                        </div>
                        <div className="col-span-4 sm:col-span-3 max-sm:mt-4 sm:pl-8 flex flex-col justify-center max-sm:items-center">
                          <h6 className="font-manrope font-semibold text-2xl leading-9 text-black mb-3 whitespace-nowrap">
                            {item.product_name || "Board Game Name"}
                          </h6>
                          <div className="flex items-center max-sm:flex-col gap-x-10 gap-y-3">
                            {/* <span className="font-normal text-lg leading-8 text-gray-500 whitespace-nowrap">
                              Qty: 1
                            </span> */}
                            <p className="font-semibold text-xl leading-8 text-black whitespace-nowrap">
                              {rental.type === 1 ? (
                                <>
                                  Giá thuê :{" "}
                                  {formatCurrency(item.rent_price_per_hour)}
                                </>
                              ) : (
                                <>Giá thuê: {formatCurrency(item.rent_price)}</>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-around w-full  sm:pl-28 lg:pl-0">
                        <div className="flex flex-col justify-center items-start max-sm:items-center">
                          <p className="font-normal text-lg text-gray-500 leading-8 mb-2 text-left whitespace-nowrap">
                            Trạng thái
                          </p>
                          <p className="font-semibold text-lg leading-8 text-green-500 text-left whitespace-nowrap">
                            {item.status === "ACTIVE"
                              ? "Kích hoạt"
                              : rental.status === "DISABLED"
                              ? "Chưa được thuê"
                              : "Chờ xác nhận"}
                          </p>
                        </div>
                        <div className="flex flex-col justify-center items-start max-sm:items-center">
                          <p className="font-normal text-lg text-gray-500 leading-8 mb-2 text-left whitespace-nowrap">
                            Tình trạng sản phẩm
                          </p>
                          <p className="font-semibold text-lg leading-8 text-black text-left whitespace-nowrap">
                            {item.condition || "Mới"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <svg
                  className="mt-9 w-full"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1216"
                  height="2"
                  viewBox="0 0 1216 2"
                  fill="none"
                >
                  <path d="M0 1H1216" stroke="#D1D5DB" />
                </svg>

                <div className="px-3 md:px-11 flex items-center justify-between max-sm:flex-col-reverse">
                  <div className="flex max-sm:flex-col-reverse items-center">
                    {/* <button className="flex items-center gap-3 py-10 pr-8 sm:border-r border-gray-300 font-normal text-xl leading-8 text-gray-500 group transition-all duration-500 hover:text-indigo-600">
                      <svg
                        width="40"
                        height="41"
                        viewBox="0 0 40 41"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          className="stroke-gray-600 transition-all duration-500 group-hover:stroke-indigo-600"
                          d="M14.0261 14.7259L25.5755 26.2753M14.0261 26.2753L25.5755 14.7259"
                          stroke=""
                          stroke-width="1.8"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      cancel order
                    </button> */}
                    {/* <p className="font-normal text-xl leading-8 text-gray-500 sm:pl-8">
                      Payment Is Succesfull
                    </p> */}
                  </div>
                  <p className="font-medium text-xl leading-8 text-black max-sm:py-4">
                    {" "}
                    <span className="text-gray-500">Tổng tiền: </span>{" "}
                    &nbsp;{formatCurrency(rental.total_price)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          // <section className="bg-white antialiased hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg shadow-md  m-2" key={rental.id || index}>
          //   <div className="mt-6 flow-root sm:mt-8 ">
          //     <div className="divide-y divide-gray-700 dark:divide-gray-700">
          //       {/* <Link href={`/customer/order/${order.id}`}> */}
          //       <div className="flex flex-wrap items-center gap-y-4 p-6 ">
          //         <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
          //           <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
          //             Mã đơn:
          //           </dt>
          //           <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
          //             <a href="#" className="hover:underline">
          //               #FWB127364372
          //             </a>
          //           </dd>
          //         </dl>

          //         <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
          //           <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
          //             Ngày/Giờ Thuê:
          //           </dt>
          //           <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
          //             {formatDate(rental.from)} -{formatDate(rental.to)}
          //           </dd>
          //         </dl>

          //         <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
          //           <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
          //             Tổng tiền:
          //           </dt>
          //           <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
          //             {formatCurrency(rental.total_price)}
          //           </dd>
          //         </dl>

          //         <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
          //           <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
          //             Trạng thái:
          //           </dt>
          //           {/* <dd className={getStatusColor(order.status)}>
          //             <span>
          //               {order.status === "DELIVERING"
          //                 ? "Đang giao hàng"
          //                 : order.status === "SENT"
          //                 ? "Đã giao hàng"
          //                 : order.status === "CANCELLED"
          //                 ? "Đã hủy"
          //                 : "Chờ xác nhận"}
          //             </span>
          //           </dd> */}
          //         </dl>

          //         {/* <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
          //           {order.status === "SENT" ? (
          //             <button
          //               type="button"
          //               className="w-full rounded-lg border border-green-700 px-3 py-2 text-center text-sm font-medium text-green-700 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-900 lg:w-auto"
          //             >
          //               Mua lại
          //             </button>
          //           ) : (
          //             <button
          //               type="button"
          //               className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto"
          //             >
          //               Hủy đơn
          //             </button>
          //           )}
          //           <button
          //             onClick={() => router.push(`order/${order.id}`)}
          //             className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
          //           >
          //             Chi tiết
          //           </button>
          //         </div> */}
          //       </div>
          //       {/* </Link> */}
          //     </div>
          //   </div>
          // </section>
        ))
      )}
    </div>
  );
};

export default RentalHistory;
