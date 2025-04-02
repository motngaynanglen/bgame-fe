import { Button, Collapse, CollapseProps, Form, Input, message, Space } from "antd";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import AddProductTemplate from "./ProductTemplateForm";
import productApiRequest from "@/src/apiRequests/product";
import { HttpError } from "@/src/lib/httpAxios";
import { useAppContext } from "@/src/app/app-provider";

interface productModel {
    id: string | undefined,
    productGroupRefId: string | undefined,
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
interface numberAddModel {
    productGroupRefId: string,
    number: number
}
const numberDefault = {
    productGroupRefId: "",
    number: 0
}
export default function ProductAddNumberForm({ productModel }: { productModel: productModel }) {
    const { user } = useAppContext();
    const numberAdd = useForm({
        defaultValues: numberDefault,
        // resolver: zodResolver(BoardGameBody)
    });
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Xem lại sản phẩm đã tạo',
            children: <AddProductTemplate product={productModel} isReadonly={true} />,
        }]
    const onSubmit = async (values: numberAddModel) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để đặt trước.");
            return;
        }
        console.log("productModel: ", productModel);
        if (productModel.productGroupRefId === undefined) {
            message.error("Không tìm thấy mã sản phẩm!");
            return;
        }
        const data: numberAddModel = {
            productGroupRefId: productModel.productGroupRefId,
            number: values.number,
        };
        try {

            
            console.log("data: ", data);
            const response = await productApiRequest.addProduct(data, user.token);

            // Hiển thị thông báo thành công
            message.success("Thêm mới sản phẩm thành công!");


        } catch (error: any) {
            message.success("Thêm mới sản phẩm thất bại!");
            if (error instanceof HttpError) {
                console.log(error);
            }
        }
        // }
    }
    function ProductNumberAddForm() {
        return (
            <>
                <Form onFinish={numberAdd.handleSubmit(onSubmit)}>
                    <FormItem control={numberAdd.control} name="productGroupRefId" label="" layout="vertical" className="pb-3">
                        <Input hidden />
                    </FormItem>
                    <FormItem control={numberAdd.control} name="number" label="Số lượng sản phẩm" layout="vertical" className="pb-3">
                        <Input />
                    </FormItem>
                    <Form.Item style={{ textAlign: 'right' }}>

                        <Space>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Space>

                    </Form.Item>
                </Form>
            </>
        );
    }
    return (
        <>
            <ProductNumberAddForm />
            <Collapse items={items} defaultActiveKey={['1']} />;

        </>
    )
}