"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Giả định schema đã được cập nhật để chứa expectedReceiptDate
import {
    orderFormSchema,
    OrderFormValues,
} from "@/src/schemaValidations/order.schema"; // Cần đảm bảo file này có 'expectedReceiptDate'
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Row,
    Space,
    Switch,
    Spin,
    DatePicker,
    Typography,
    Tag, // Import DatePicker
} from "antd";
import { FormItem } from "react-hook-form-antd";
import { useParams } from "next/navigation";
import { useAppContext } from "@/src/app/app-provider";
import { orderApiRequest } from "@/src/apiRequests/orders";
import { HttpError } from "@/src/lib/httpAxios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import dayjs from "@/src/lib/dayjs"; // Import dayjs và Dayjs
import { formToJSON } from "axios";
import { json } from "stream/consumers";
import { formatDateTime, toISOStringWithOffset } from "@/src/lib/utils";
import { OrderGroupDetail } from "../types";

// Cập nhật OrderFormValues (Giả định schema đã được cập nhật)
// Nếu bạn không thể thay đổi file schema gốc, bạn có thể tạm thời định nghĩa lại:
// export interface OrderFormValues {
//     orderID: string;
//     email: string;
//     fullName: string;
//     phoneNumber: string;
//     address: string;
//     isDelivery: boolean;
//     deliveryCode: string;
//     deliveryBrand: string;
//     expectedReceiptDate: Dayjs | null; // Sử dụng Dayjs cho DatePicker
// }

// Cập nhật OrderDetail (Thêm trường mới)

const statusMeta: Record<string, { color: string; label: string }> = {
    CREATED: { color: "warning", label: "Chưa Thanh Toán" },
    PAID: { color: "green", label: "Đang xử lý" },
    PREPARED: { color: "blue", label: "Đã chuẩn bị" },
    DELIVERING: { color: "processing", label: "Đang giao" },
    RECEIVED: { color: "success", label: "Hoàn tất" },
    CANCELLED: { color: "error", label: "Đã hủy" },
};
export default function UpdateDeliveryInfoPage() {
    const { id } = useParams();
    const { user } = useAppContext();
    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            isDelivery: true,
        },
    });

    const { handleSubmit, control, watch, reset, getValues, setValue, formState: { isSubmitting, isValidating, isValid, errors }, } = form;

    const isDelivery = watch("isDelivery");

    const { data, isLoading } = useQuery<OrderGroupDetail>({
        queryKey: ["order", id],
        queryFn: async () => {
            const res = await orderApiRequest.getOrderById({
                orderID: id,
            });
            return res.data;
        },
    });

    useEffect(() => {
        if (data) {
            reset({
                orderID: data.order_group_id,
                email: data.email,
                fullName: data.full_name,
                phoneNumber: data.phone_number,
                address: data.address,
                isDelivery: true,
                deliveryCode: data.delivery_code ?? "",
                deliveryBrand: data.delivery_brand ?? "",
                expectedReceiptDate: data.expected_receipt_date && dayjs(data.expected_receipt_date).isValid()
                    ? dayjs(data.expected_receipt_date)
                    : null,
            });

        }
    }, [data, reset, setValue]);

    const onSubmit = async (values: OrderFormValues) => {
        // Chuyển đổi Dayjs object sang chuỗi ISO 8601 trước khi gửi lên API
        const bodyToSend = {
            ...values,
            expectedReceiptDate: values.expectedReceiptDate ? toISOStringWithOffset(values.expectedReceiptDate, -7) : null
            // Lí do -7 vì -7 sẽ khiến múi giờ defaut +0 vẫn rơi vào đúng ngày, không lệch ngày.
            // Thay thế Dayjs object bằng chuỗi ISO 8601/null
        };

        try {
            const res = await orderApiRequest.updateOrderDeliveryInfo(
                bodyToSend,
                user?.token
            );
            message.success("Cập nhật dữ liệu thành công", 10);
        } catch (error) {
            if (error instanceof HttpError) {
                message.error(error.message ?? "");
            }
        }
    };

    const cardTitle = () => {
        return (
            <div className="flex justify-between items-center">
                <span>
                    Cập nhật thông tin giao hàng
                </span>
                {/* <span>
                    Đơn hàng đang trong trạng thái chuẩn bị, vui lòng xác nhận đủ sản phẩm.
                </span> */}
            </div>
        )
    }
    const disableForm = (data?.order_status != "PAID") || !(data.orders.every((order) => order.order_status == "PREPARED"))
    return (
        <Card title={cardTitle()} style={{ maxWidth: 800, margin: "auto" }}>
            {isLoading ? (
                <Spin tip="Đang tải dữ liệu đơn hàng..." />
            ) : (
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)} disabled={disableForm}>
                    <Row gutter={[16, 16]}>
                        <Col span={24} hidden>
                            <FormItem control={control} name="orderID" label="Mã đơn hàng">
                                <Input />
                            </FormItem>
                        </Col>
                        {/* Thông tin người nhận */}
                        <Col span={12}>
                            <FormItem control={control} name="fullName" label="Họ tên người nhận">
                                <Input />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem control={control} name="email" label="Email">
                                <Input />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem control={control} name="phoneNumber" label="Số điện thoại">
                                <Input />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem control={control} name="address" label="Địa chỉ nhận hàng">
                                <Input />
                            </FormItem>
                        </Col>

                        {/* Trạng thái giao hàng */}
                        <Col span={12}>
                            <FormItem control={control} name="isDelivery" label="Giao hàng?" valuePropName="checked">
                                <Switch />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <Typography.Text>Trạng thái: <Tag>{data?.order_status}</Tag></Typography.Text>
                            <br />
                            <Typography.Text>Danh sách trạng thái con: </Typography.Text>
                            <br />
                            {data?.orders.map((order, index) => (
                                <Tag key={order.order_id + index}>
                                    {order.order_status}
                                </Tag>
                            ))}
                        </Col>
                        {/* Thông tin vận chuyển (chỉ hiển thị khi isDelivery là true) */}
                        {isDelivery && (
                            <>
                                <Col span={12}>
                                    <FormItem control={control} name="deliveryCode" label="Mã vận đơn">
                                        <Input />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem control={control} name="deliveryBrand" label="Hãng vận chuyển">
                                        <Input />
                                    </FormItem>
                                </Col>
                                {/* Trường mới: expectedReceiptDate */}
                                <Col span={12}>
                                    <FormItem control={control} name="expectedReceiptDate" label="Ngày dự kiến nhận hàng" getValueFromEvent={(date: dayjs.Dayjs | null) => date}>
                                        <DatePicker
                                            format="DD/MM/YYYY" // Định dạng hiển thị
                                            style={{ width: '100%' }}
                                        // onChange={(date) => setValue('expectedReceiptDate', date.toDate())}
                                        />
                                    </FormItem>

                                </Col>
                            </>
                        )}

                        <Col span={24} style={{ textAlign: "right" }}>
                            <Space>
                                <Button onClick={() => reset()} disabled={isSubmitting}>
                                    Làm mới
                                </Button>
                                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                    Cập nhật đơn hàng
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            )}

        </Card>
    );
}