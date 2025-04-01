import { Button, Collapse, CollapseProps, Form, Input, Space } from "antd";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import AddProductTemplate from "./ProductTemplateForm";

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
interface numberAdd {
    productGroupRefId: string,
    number: number
}
const numberDefault = {
    productGroupRefId: "",
    number: 0
}
export default function ProductAddNumberForm({ productModel }: { productModel: productModel }) {
    const numberAdd = useForm({
        defaultValues: numberDefault,
        // resolver: zodResolver(BoardGameBody)
    });
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Xem lại sản phẩm đã tạo',
            children: <AddProductTemplate product={productModel} isReadonly={true}/>,
        }]
    function ProductNumberAddForm() {
        return (
            // <Form onFinish={numberAdd.handleSubmit(onSubmit)}>
            <>
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