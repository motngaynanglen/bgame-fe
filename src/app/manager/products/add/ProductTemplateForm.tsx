import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input } from "antd";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";

const defaultValues = {
    groupName: "string",
    groupId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    prefix: "string",
    groupRefName: "string",
    productGroupRefId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    productName: "string",
    image: "string",
    price: 0
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
const NewProduct = {
    groupName: "string",
    groupId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    prefix: "string",
    groupRefName: "string",
    productGroupRefId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    productName: "string",
    image: "string",
    price: 0
  }
export default function AddProductTemplate() {
    const boardGame = useForm({
        defaultValues: defaultValues,
        // resolver: zodResolver(BoardGameBody)
    });
    function ProductTemplateForm() {
        return (
            <Form>
                <FormItem control={boardGame.control} name="groupName" label="Tên Board Game">
                    <Input />
                </FormItem>
                <FormItem control={boardGame.control} name="groupRefName" label="Tên Phân loại Board Game">
                    <Input />
                </FormItem>
                <FormItem control={boardGame.control} name="productName" label="Tên Board Game Chi tiết">
                    <Input />
                </FormItem>
                
                <FormItem control={boardGame.control} name="price" label="Giá cơ bản">
                    <Input />
                </FormItem>
                <FormItem control={boardGame.control} name="image" label="Hình ảnh">
                    <Input />
                </FormItem>
            </Form>
        );
    }
    return (
        <>
            <ProductTemplateForm />
        </>
    )
}