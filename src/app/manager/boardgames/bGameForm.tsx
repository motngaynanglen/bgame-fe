'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormProps, Input, Select, SelectProps } from "antd"
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { RegisterBody, RegisterBodyType } from "@/src/schemaValidations/auth.schema";

const RegisterBodyDefaults = {
    BGName: "jsun969",
    publisher: "",
    tags: [],
    fullname: "",
    phoneNumber: "",
    confirmtags: ""
};
export default function BGameForm({ user }: { user?: RegisterBodyType }) {
    const { control, handleSubmit } = useForm({
        defaultValues: user || RegisterBodyDefaults,
        resolver: zodResolver(RegisterBody)
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
    return (
        <>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={handleSubmit(OnSubmit)}
                autoComplete="off"
            >
                <FormItem control={control} name="BGName" label="Tên Board Game">
                    <Input />
                </FormItem>
                <FormItem control={control} name="publisher" label="Nhà Phát Hành">
                    <Input />
                </FormItem>
                <FormItem control={control} name="tags" label="tags" initialValue={['a10', 'c12']}>
                    <Select mode="multiple" allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        options={options}
                        onChange={handleChange}
                    />
                </FormItem>
                <FormItem control={control} name="fullname" label="Full Name">
                    <Input />
                </FormItem>
                <FormItem control={control} name="phoneNumber" label="phone">
                    <Input />
                </FormItem>

                <FormItem control={control} name="confirmtags" label="Confirm tags">
                    <Input />
                </FormItem>


                <Form.Item label={null}>
                    <button className="bg-primary rounded-full px-5 py-2" type="submit">
                        Submit
                    </button>
                </Form.Item>

            </Form >
        </>
    )
}