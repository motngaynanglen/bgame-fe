"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    orderFormSchema,
    OrderFormValues,
} from "@/src/schemaValidations/order.schema";
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
} from "antd";
import { FormItem } from "react-hook-form-antd";
import { useParams } from "next/navigation";
import { useAppContext } from "@/src/app/app-provider";
import { orderApiRequest } from "@/src/apiRequests/orders";
import { HttpError } from "@/src/lib/httpAxios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

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
}

export default function UpdateDeliveryInfoPage() {
    const { id } = useParams();
    const { user } = useAppContext();

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            isDelivery: true,
        },
    });

    const {
        handleSubmit,
        control,
        watch,
        reset,
        formState: { isSubmitting },
    } = form;

    const isDelivery = watch("isDelivery");

    const { data, isLoading } = useQuery<OrderDetail>({
        queryKey: ["order", id],
        queryFn: async () => {
            const res = await orderApiRequest.getOrderById({
                orderID: id,
            });
            return res.data;
        },
    });

    // ✅ Reset form khi có dữ liệu
    useEffect(() => {
        if (data) {
            reset({
                orderID: data.order_id,
                email: data.email,
                fullName: data.full_name,
                phoneNumber: data.phone_number,
                address: data.address,
                isDelivery: true,
                deliveryCode: "",
                deliveryBrand: "",
            });
        }
    }, [data, reset]);

    const onSubmit = async (values: OrderFormValues) => {
        try {
            const res = await orderApiRequest.updateOrderDeliveryInfo(
                values,
                user?.token
            );
            message.success(res.message);
        } catch (error) {
            if (error instanceof HttpError) {
                message.error(error.message ?? "");
            }
        }
    };

    return (
        <Card title="Cập nhật thông tin giao hàng" style={{ maxWidth: 800, margin: "auto" }}>
            {isLoading ? (
                <Spin />
            ) : (
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Row gutter={[16, 16]}>
                        <Col span={24} hidden>
                            <FormItem control={control} name="orderID" label="Mã đơn hàng">
                                <Input placeholder="UUID đơn hàng" />
                            </FormItem>
                        </Col>
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
                        <Col span={24}>
                            <FormItem control={control} name="isDelivery" label="Giao hàng?">
                                <Switch checked={isDelivery} />
                            </FormItem>
                        </Col>
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
