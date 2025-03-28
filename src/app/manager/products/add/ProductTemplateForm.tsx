import productApiRequest from "@/src/apiRequests/product";
import TipTapEditor from "@/src/components/TipTapEditor/TipTapEditor";
import { HttpError } from "@/src/lib/httpAxios";
import { InboxOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Input, message, Row, Space, Upload, UploadProps } from "antd";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";

const defaultValues = {
    groupName: "UITEST 2",
    prefix: "UIT2",
    groupRefName: "UITEST 2",
    productName: "UITEST 2",
    image: "string",
    price: 10,
    description: "<p>Chua biết mô tả thế nào nhưng:<br><strong>Rất chi tiết - bắt mắt - đẹp đẽ</strong></p>",
    rentPrice: 1220,
    rentPricePerHour: 1220
};
const productTemplate = {
    productGroupRefId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    productName: "string",
    image: "string",
    price: 0,
    rentPrice: 0
}
const product = {
    productGroupRefId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    storeId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    number: 0
}
interface productAdd {
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
export default function AddProductTemplate() {
    const boardGame = useForm({
        defaultValues: defaultValues,
        // resolver: zodResolver(BoardGameBody)
    });
    const onSubmit = async (data:productAdd) => {
        // if (!sessionToken) {
        //   toast.warning("Bạn cần đăng nhập để sử dụng chức năng này.")
        // }
        // else {
        console.log(data)
        try {
            await productApiRequest.addNonExistProduct(data)
        } catch (error: any) {
            if (error instanceof HttpError) {
                console.log(error);
            }
        }
        // }
    }
    function ProductTemplateForm() {
        return (
            <Form onFinish={boardGame.handleSubmit(onSubmit)}>
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
                            getValueFromEvent={(e) => e?.fileList}
                        >
                            <Dragger
                                accept="image/*"
                                beforeUpload={beforeUpload}
                                maxCount={10}
                                multiple
                                listType="picture"
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click hoặc kéo ảnh vào đây để tải lên</p>
                                <p className="ant-upload-hint">Tối đa 10 ảnh, mỗi ảnh không quá 20MB.</p>
                            </Dragger>
                        </Form.Item>;
                    </Col>

                    <Col span={12}>
                        <FormItem control={boardGame.control} name="description" label="Mô tả sản phẩm" layout="vertical">
                            <TipTapEditor />
                        </FormItem>
                    </Col>
                </Row>
                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="reset">reset</Button>
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