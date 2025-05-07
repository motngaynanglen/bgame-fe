import productApiRequest from "@/src/apiRequests/product";
import uploadApiRequest from "@/src/apiRequests/upload";
import { useAppContext } from "@/src/app/app-provider";
import TipTapEditor from "@/src/components/TipTapEditor/TipTapEditor";
import { useObjectUrls } from "@/src/hooks/useObjectURL";
import { HttpError } from "@/src/lib/httpAxios";
import { productFullFormSchema, ProductFullFormType, productModel } from "@/src/schemaValidations/product.schema";
import { InboxOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Input, message, Row, Space, Upload, UploadFile, UploadProps } from "antd";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";

const { Dragger } = Upload;

const defaultValues = {
    id: undefined,
    productGroupRefId: undefined,
    groupName: "",
    prefix: "",
    groupRefName: "",
    productName: "",
    image: "",
    price: 0,
    description: "",
    rentPrice: 0,
    rentPricePerHour: 0
};
interface ProductFormValues extends ProductFullFormType {
    imageFiles?: UploadFile[]; // Thêm trường này để quản lý file tạm thời
}

const normFile = (values: UploadChangeParam | UploadFile[]): UploadFile[] => {
    if (Array.isArray(values)) return values;
    if (values?.fileList) return values.fileList;
    return [];
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
    const [uploading, setUploading] = useState(false);
    const { user } = useAppContext();
    const boardGame = useForm<ProductFormValues>({
        defaultValues: {
            ...(product ?? defaultValues),
            imageFiles: [] // Khởi tạo giá trị mặc định cho imageFiles
        },
        resolver: zodResolver(productFullFormSchema) // chưa có schema valiation
    });

    const handleFileChange = (info: UploadChangeParam) => {
        const newFileList = normFile(info);
        boardGame.setValue("imageFiles", newFileList);
    };
    const uploadProps: UploadProps = {
        accept: "image/*",
        beforeUpload: beforeUpload,
        maxCount: 10,
        multiple: true,
        listType: "picture",
        showUploadList: {
            showPreviewIcon: true,
            showRemoveIcon: !isReadonly,
            showDownloadIcon: false,
        },
        disabled: isReadonly || boardGame.formState.isSubmitting,
        fileList: boardGame.watch("imageFiles"),
        onChange: handleFileChange,
    }

    const uploadFiles = async (files: UploadFile[]): Promise<string> => {
        if (!files.length) return "";

        setUploading(true);
        const formData = new FormData();

        try {
            const uploadedFiles = files
                ?.map((file) => file.originFileObj)
                .filter((file): file is RcFile => !!file);

            if (!uploadedFiles.length) {
                message.warning("Không có file hợp lệ để upload");
                return "";
            }

            uploadedFiles.forEach((file) => {
                formData.append("files", file);
            });
            const response = await uploadApiRequest.uploadImage(formData);
            const urls = response.urls;
            const imagesString = urls.join("||");
            message.success("Upload hình ảnh thành công");
            return imagesString;
        } catch (error) {
            console.error("Upload error:", error);
            message.error("Lỗi khi upload hình ảnh");
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
    const onSubmit = async (values: ProductFormValues) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }
        try {

            const imagesString = await uploadFiles(values.imageFiles || []);
            if (!imagesString) {
                message.error("Không có hình ảnh nào được upload");
                return;
            }
            await waitForUploading();

            const data = {
                ...values,
                image: imagesString,
            };

            const response = await productApiRequest.addNonExistProduct(data, user.token);

            const productGroupRefId: string = response.data;

            const updatedData = {
                ...data,
                productGroupRefId: productGroupRefId,
            };

            message.success("Thêm sản phẩm thành công!");

            // Gửi dữ liệu đã cập nhật qua callback onNext
            if (onNext) {
                onNext(updatedData);
            }
        } catch (error) {
            console.error("Submit error:", error);
            if (error instanceof HttpError) {
                message.error(error.message || "Có lỗi xảy ra");
            } else {
                message.error("Có lỗi xảy ra khi thêm sản phẩm");
            }
        }

    }
    function ProductTemplateForm() {
        return (
            <Form onFinish={boardGame.handleSubmit(onSubmit)} disabled={(isReadonly ?? false) || boardGame.formState.isSubmitting} >
                <Row gutter={[12, 12]}>
                    <Col span={12}>
                        <Row gutter={[12, 12]}>
                            <Col span={12}>
                                <FormItem control={boardGame.control} name="groupName" label="Tên Board Game" layout="vertical">
                                    <Input />
                                </FormItem>
                                <FormItem control={boardGame.control} name="groupRefName" label="Tên Phân loại Board Game" layout="vertical" >
                                    <Input />
                                </FormItem>

                            </Col>
                            <Col span={12}>
                                <FormItem control={boardGame.control} name="prefix" label="Mã định danh" layout="vertical" >
                                    <Input />
                                </FormItem>
                                <FormItem control={boardGame.control} name="productName" label="Tên Board Game Chi tiết" layout="vertical" >
                                    <Input />
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem control={boardGame.control} name="price" label="Giá cơ bản" layout="vertical" >
                            <Input />
                        </FormItem>


                        <FormItem control={boardGame.control} name="rentPrice" label="Giá Thuê" layout="vertical" >
                            <Input />
                        </FormItem>
                        <FormItem control={boardGame.control} name="rentPricePerHour" label="Giá Thuê theo giờ" layout="vertical" >
                            <Input />
                        </FormItem>



                        <Controller
                            name="imageFiles"
                            control={boardGame.control}
                            render={({ field }) => (
                                <Form.Item
                                    layout="vertical"
                                    label="Hình ảnh"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                >
                                    <Dragger
                                        {...uploadProps}
                                        fileList={field.value}
                                        onChange={(info) => {
                                            handleFileChange(info);
                                            field.onChange(normFile(info));
                                        }}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click hoặc kéo ảnh vào đây để tải lên</p>
                                        <p className="ant-upload-hint">Tối đa 10 ảnh, mỗi ảnh ≤ 20MB</p>
                                    </Dragger>
                                </Form.Item>
                            )}
                        />
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