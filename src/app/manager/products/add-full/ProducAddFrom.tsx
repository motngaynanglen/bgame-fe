"use client";
import productApiRequest from "@/src/apiRequests/product";
import { useAppContext } from "@/src/app/app-provider";
import { addProductsSchema, AddProductsType } from "@/src/schemaValidations/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { set } from "zod";


type ProductAddNumberFormProps = {
    productTemplateId: string;
    onAddProductsCreated?: (productTemplateId: string) => void;
};
export default function ProductAddFrom({ productTemplateId }: ProductAddNumberFormProps) {
    const numberDefault = {
        productTemplateId: productTemplateId,
        number: 1
    }
    const { user } = useAppContext();
    const [enableAdd, setEnableAdd] = useState<boolean>(true);

    const numberAdd = useForm({
        defaultValues: numberDefault,
        resolver: zodResolver(addProductsSchema)
    });
    const { control, setValue, handleSubmit, reset, formState } = numberAdd;
    const { errors, isSubmitting, isValid } = formState;

    useEffect(() => {
        if (!productTemplateId) {
            setEnableAdd(false);
            // message.error("Không tìm thấy mã sản phẩm!");
        } else {
            setValue("productTemplateId", productTemplateId);
            setEnableAdd(true);
        }
    }, [productTemplateId]);

    const onSubmit = async (data: AddProductsType) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }
        if (isSubmitting) {
            message.warning("Đang xử lý, vui lòng đợi...");
            return;
        }
        if (productTemplateId) {
            const addData: AddProductsType = {
                productTemplateId: productTemplateId,
                number: data.number,
            };
            try {
                const response = await productApiRequest.addProduct(addData, user.token);
                const messageContent = response.message || "Thêm mới sản phẩm thành công!";
                message.success(messageContent);
                reset({ productTemplateId, number: 1 });
                // if (onAddProductsCreated) {
                //     onAddProductsCreated(response.data.productTemplateId);
                // }
            } catch (error: any) {
                message.error("Thêm mới sản phẩm thất bại!");
                console.error(error);
            }
        } else {
            message.error("Không tìm thấy mã sản phẩm!");
        }

    }
    const title = () => {
        return (
            <Space className="w-full justify-between">
                <span>Tạo sản phẩm</span>
            </Space >
        );
    };
    return (
        <>
            <Card title={title()} style={{ marginBottom: 16 }} styles={{ header: { backgroundColor: '#5c6cfa', color: '#ffffff' } }}>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)} disabled={!enableAdd}>
                    <Row gutter={[16, 16]}>
                        <Col span={12} hidden>
                            <FormItem control={control} name="productTemplateId" label="Mã sản phẩm" disabled >
                                <Input />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem control={control} name="number" label="Số lượng sản phẩm muốn tạo">
                                <InputNumber min={1} max={1000} style={{ width: "100%" }} />
                            </FormItem>
                        </Col>
                        <Col span={24} style={{ textAlign: "right" }}>
                            <Space>
                                <Button onClick={() => reset()} disabled={formState.isSubmitting}>Làm mới</Button>
                                <Button type="primary" htmlType="submit" loading={formState.isSubmitting}>
                                    {formState.isSubmitting ? "Đang tạo..." : "Xác nhận nhập số lượng"
                                    }
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </>
    );
}