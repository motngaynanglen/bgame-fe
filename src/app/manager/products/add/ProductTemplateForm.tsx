import productApiRequest from "@/src/apiRequests/product";
import uploadApiRequest from "@/src/apiRequests/upload";
import TipTapEditor from "@/src/components/TipTapEditor/TipTapEditor";
import { useObjectUrls } from "@/src/hooks/useObjectURL";
import { HttpError } from "@/src/lib/httpAxios";
import { InboxOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Input, message, Row, Space, Upload, UploadProps } from "antd";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";

const defaultValues = {
    id: undefined,
    product_group_ref_id: undefined,
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
const numberDefault = {
    productGroupRefId: "",
    number: 0
}
interface productModel {
    id: string | undefined,
    product_group_ref_id: string | undefined,
    groupName: string,
    prefix: string,
    groupRefName: string,
    productName: string,
    image: string,
    price: number,
    description: string,
    rentPrice: number,
    rentPricePerHour: number
}

const { Dragger } = Upload;

interface FormValues {
    images: UploadProps["fileList"];
}

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
    const [fileList, setFileList] = useState<File[]>([]); // Lưu danh sách file
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const boardGame = useForm({
        defaultValues: product ?? defaultValues,
        // resolver: zodResolver(BoardGameBody)
    });
    const numberAdd = useForm({
        defaultValues: numberDefault,
        // resolver: zodResolver(BoardGameBody)
    });
    const uploadFiles = async () => {
        setUploading(true);
        const formData = new FormData();

        // Thêm tất cả các file vào FormData
        fileList.forEach((file) => {
            formData.append("files", file);
        });

        for (const file of fileList) {
            try {
                const response = await uploadApiRequest.uploadImage(formData);

                // Lấy danh sách URL từ phản hồi API
                const urls = response.urls; // Assuming response.data is an array of URLs
                setUploadedUrls(urls);
                message.success("Tất cả Hình ảnh đã được upload thành công");
            } catch (error) {
                setUploading(false);
                console.error("Lỗi khi gửi hình ảnh", file.name, error);
                message.error(`Lỗi gửi hình ảnh ${file.name}`);
                
            }
        }
        setUploading(false);
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
        
        console.log(values)
        try {
            if (fileList.length > 0) {
                await uploadFiles();
            }
            await waitForUploading();
            const imageString = uploadedUrls.join("||");

            const data = {
                ...values,
                image: imageString, // Attach the uploaded image URLs to the form data
            };
            const response = await productApiRequest.addNonExistProduct(data);

            // Lấy productGroupRefId từ phản hồi API
            const { productGroupRefId } = response.data;

            // Gắn productGroupRefId vào data
            const updatedData = {
                ...data,
                product_group_ref_id: productGroupRefId,
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
            <Form onFinish={boardGame.handleSubmit(onSubmit)} disabled={isReadonly ?? false}>
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
                            <Input/>
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
                            getValueFromEvent={(e) => e?.fileList}
                        >
                            <Dragger
                                accept="image/*"
                                beforeUpload={beforeUpload}
                                maxCount={10}
                                multiple
                                listType="picture"
                                onChange={(info) => {
                                    const files = info.fileList.map((file) => file.originFileObj as File);
                                    setFileList(files); // Lưu danh sách file vào state
                                }}
                            >
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
                        <Button htmlType="reset">Reset</Button>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        )
    }
    function ProductNumberAddForm() {
        return (
            // <Form onFinish={numberAdd.handleSubmit(onSubmit)}>
            <Form>
                <FormItem control={numberAdd.control} name="productGroupRefId" label="" layout="vertical" className="pb-3">
                    <Input hidden />
                </FormItem>
                <FormItem control={numberAdd.control} name="number" label="Số lượng sản phẩm" layout="vertical" className="pb-3">
                    <Input />
                </FormItem>
                <Form.Item style={{ textAlign: 'right' }}>

                    <Space>
                        <Button htmlType="reset">Reset</Button>
                        <Button type="primary" htmlType="submit" loading={uploading}>
                            Submit
                        </Button>
                    </Space>

                </Form.Item>
            </Form>
        );
    }
    return (
        <>
            <ProductTemplateForm />
        </>
    )
}