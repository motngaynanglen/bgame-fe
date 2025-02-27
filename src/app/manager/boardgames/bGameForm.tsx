'use client'

import { BoardGameBody, BoardGameBodyType } from "@/src/schemaValidations/boardgame.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Col, Form, FormProps, Input, Row, Select, SelectProps, Splitter } from "antd"
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";

const defaultValues = {
    productName: "",
    publisher: "",
    image: "",
    price: "",
    tags: ['a10', 'c12'],
    description: "",
    packageName: "",
    quantity: 20,
    totalPrice: "",
    supplyCode: "",
};
export default function BGameForm() {

    const boardGame = useForm({
        defaultValues: defaultValues,
        resolver: zodResolver(BoardGameBody)
    });
    async function OnSubmit(value: any) {
        console.log(value)
    }
    const handleChange = (value: string[]) => {
        console.log(`selected ${value}`);
    };
    const options: SelectProps['options'] = [];

    for (let i = 10; i < 36; i++) {
        options.push({
            label: i.toString(36) + i,
            value: i.toString(36) + i,
        });
    }
    const BoardGameForm = () => {
        return (
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={boardGame.handleSubmit(OnSubmit)}
                autoComplete="off"
            >
                <Row gutter={12}>
                    <Col span={16}>
                        <Card title={<p>Thông tin sản phẩm</p>}>
                            <FormItem control={boardGame.control} name="productName" label="Tên Board Game">
                                <Input />
                            </FormItem>

                            <FormItem control={boardGame.control} name="price" label="Giá cả">
                                <Input />
                            </FormItem>

                            <FormItem control={boardGame.control} name="publisher" label="Nhà Phát Hành">
                                <Input />
                            </FormItem>

                            <FormItem control={boardGame.control} name="tags" label="tags" >
                                <Select mode="multiple" allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Please select"
                                    options={options}
                                    onChange={handleChange}
                                />
                            </FormItem>
                            <FormItem control={boardGame.control} name="image" label="Nhà Phát Hành">
                                <Input />
                            </FormItem>
                            <FormItem control={boardGame.control} name="description" label="Mô tả thông tin">
                                <Input />
                            </FormItem>
                            <Form.Item label={null}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title={<p>Thông tin gói cung cấp</p>} style={{ height: "100%" }}>
                            <FormItem control={boardGame.control} name="packageName" label="Tên gói">
                                <Input />
                            </FormItem>

                            <FormItem control={boardGame.control} name="supplyCode" label="Mã gói hàng">
                                <Input />
                            </FormItem>
                            <FormItem control={boardGame.control} name="totalPrice" label="Tổng giá trị gói">
                                <Input />
                            </FormItem>
                            <FormItem control={boardGame.control} name="quantity" label="Số lượng sản phẩm">
                                <Input />
                            </FormItem>
                        </Card>
                    </Col>
                </Row>



            </Form >
        )

    }
    return (
        <>

            <BoardGameForm />
        </>
    )
}