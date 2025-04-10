import productApiRequest from "@/src/apiRequests/product";
import uploadApiRequest from "@/src/apiRequests/upload";
import { useAppContext } from "@/src/app/app-provider";
import TipTapEditor from "@/src/components/TipTapEditor/TipTapEditor";
import { useObjectUrls } from "@/src/hooks/useObjectURL";
import { HttpError } from "@/src/lib/httpAxios";
import { productModel } from "@/src/schemaValidations/product.schema";
import { InboxOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Input, message, Row, Space, Upload, UploadFile, UploadProps } from "antd";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";

const defaultValues = {
    id: undefined,
    productGroupRefId: undefined,
    groupName: "UITEST 10 group",
    prefix: "UIT10",
    groupRefName: "UITEST 10 Ref",
    productName: "UITEST 10",
    image: "empty",
    price: 10,
    description: "<p>Chua biết mô tả thế nào nhưng:<br><strong>Rất chi tiết - bắt mắt - đẹp đẽ</strong></p>",
    rentPrice: 1220,
    rentPricePerHour: 1220
};


const { Dragger } = Upload;

interface FileUploadList {
    dragger: UploadFile[];
};
const normFile = (e: any): UploadFile[] => {
    return Array.isArray(e) ? e : e?.fileList;
};

const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
        message.error("Chỉ được phép tải lên file hình ảnh!");
        return Upload.LIST_IGNORE;
    }

    const isLt20MB = file.size / 1024 / 1024 <= 20;
    if (!isLt20MB) {
        message.error("Dung lượng ảnh phải nhỏ hơn 20MB!");
        return Upload.LIST_IGNORE;
    }

    return true;
};
export default function AddProductTemplate({ product, isReadonly, onNext }: { product?: productModel; isReadonly?: boolean, onNext?: (product: productModel) => void }) {
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const { user } = useAppContext();
    const boardGame = useForm({
        defaultValues: product ?? defaultValues,
        // resolver: zodResolver(BoardGameBody)
    });
    const images = useForm<FileUploadList>({
        defaultValues: {
            dragger: [],
        },
    });
    const handleFileChange = (info: any) => {
        const newFileList = normFile(info);
        images.setValue("dragger", newFileList);
    };
    const uploadProps: UploadProps = {
        accept: "image/*",
        beforeUpload: beforeUpload,
        maxCount: 10,
        multiple: true,
        listType: "picture",
        onChange: handleFileChange,
    };
    const uploadFiles = async () => {
        setUploading(true);
        const formData = new FormData();

        const uploadedFiles = images.watch("dragger")
            ?.map((file) => file.originFileObj)
            .filter((file) => file instanceof File) as File[];

        // Thêm tất cả các file vào FormData
        uploadedFiles.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await uploadApiRequest.uploadImage(formData);
            const urls = response.urls;
            const images = urls.join("||");
            message.success("Tất cả Hình ảnh đã được upload thành công");
            return images;
        } catch (error) {
            message.error("Lỗi khi gửi hình ảnh");
            return "";
        } finally {
            setUploading(false);
        }
    };
    const waitForUploading = async () => {
        if (!uploading) return; // Nếu không đang upload, không cần đợi

        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (!uploading) {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 100); // Kiểm tra trạng thái `uploading` mỗi 100ms
        });
    };
    const onSubmit = async (values: productModel) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để đặt trước.");
            return;
        }
        const imagesString = await uploadFiles();
        try {

            await waitForUploading();

            const data = {
                ...values,
                image: imagesString,
            };
            console.log("data: ", data);
            const response = await productApiRequest.addNonExistProduct(data, user.token);


            const id: string = response.data;
            console.log("id: ", id);
            const updatedData = {
                ...data,
                id: id,
            };

            // Hiển thị thông báo thành công
            message.success("Thêm mới sản phẩm thành công!");

            // Gửi dữ liệu đã cập nhật qua callback onNext
            if (onNext) {

                onNext(updatedData);
            }
        } catch (error: any) {
            if (error instanceof HttpError) {
                console.log(error);
            }
        }
        // }
    }
    function ProductTemplateForm() {
        return (
            <Form onFinish={boardGame.handleSubmit(onSubmit)} disabled={(isReadonly ?? false) || boardGame.formState.isSubmitting } >
                <Row gutter={[12, 12]}>
                    <Col span={12}>
                        <Row gutter={[12, 12]}>
                            <Col span={12}>
                                <FormItem control={boardGame.control} name="groupName" label="Tên Board Game" layout="vertical" className="pb-3">
                                    <Input />
                                </FormItem>
                                <FormItem control={boardGame.control} name="groupRefName" label="Tên Phân loại Board Game" layout="vertical" className="pb-3">
                                    <Input />
                                </FormItem>

                            </Col>
                            <Col span={12}>
                                <FormItem control={boardGame.control} name="prefix" label="Mã định danh" layout="vertical" className="pb-3">
                                    <Input />
                                </FormItem>
                                <FormItem control={boardGame.control} name="productName" label="Tên Board Game Chi tiết" layout="vertical" className="pb-3">
                                    <Input />
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem control={boardGame.control} name="price" label="Giá cơ bản" layout="vertical" className="pb-3">
                            <Input />
                        </FormItem>
                        <Col span={24} >

                            <FormItem control={boardGame.control} name="rentPrice" label="Giá Thuê" layout="vertical" className="pb-3">
                                <Input />
                            </FormItem>
                            <FormItem control={boardGame.control} name="rentPricePerHour" label="Giá Thuê theo giờ" layout="vertical" className="pb-3">
                                <Input />
                            </FormItem>
                        </Col>


                        <Form.Item
                            name="image"
                            label="Hình ảnh"
                            className="pb-3"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Dragger {...uploadProps}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click hoặc kéo ảnh vào đây để tải lên</p>
                                <p className="ant-upload-hint">Tối đa 10 ảnh, mỗi ảnh không quá 20MB.</p>
                            </Dragger>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <FormItem control={boardGame.control} name="description" label="Mô tả sản phẩm" layout="vertical">
                            <TipTapEditor />
                        </FormItem>
                    </Col>
                </Row>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Space>
                        <Button type="default" onClick={() => boardGame.reset()} disabled={boardGame.formState.isSubmitting}> Làm mới</Button>
                        <Button type="primary" htmlType="submit" disabled={boardGame.formState.isSubmitting} loading={boardGame.formState.isSubmitting}>
                            {boardGame.formState.isSubmitting ? "Đang tạo sản phẩm..." : "Tạo sản phẩm"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        )
    }

    return (
        <>
            <ProductTemplateForm />
        </>
    )
}