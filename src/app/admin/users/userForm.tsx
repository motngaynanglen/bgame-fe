'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormProps, Input } from "antd"
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { RegisterBody, RegisterBodyType } from "@/src/schemaValidations/auth.schema";

const RegisterBodyDefaults = {
    username: "jsun969",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    confirmPassword: ""
};
export default function UserForm({ user }: { user?: RegisterBodyType }) {
    const { control, handleSubmit } = useForm({
        defaultValues: user || RegisterBodyDefaults,
        resolver: zodResolver(RegisterBody)
    });

    async function OnSubmit(value: any) {
        console.log(value)
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
                <FormItem control={control} name="username" label="Username">
                    <Input />
                </FormItem>
                <FormItem control={control} name="email" label="Email">
                    <Input />
                </FormItem>
                <FormItem control={control} name="fullName" label="Full Name">
                    <Input />
                </FormItem>
                <FormItem control={control} name="phoneNumber" label="phone">
                    <Input />
                </FormItem>
                <FormItem control={control} name="password" label="Password">
                    <Input.Password />
                </FormItem>
                <FormItem control={control} name="confirmPassword" label="Confirm Password">
                    <Input.Password />
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