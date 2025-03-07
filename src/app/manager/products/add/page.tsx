"use client"
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Dropdown, MenuProps, Select } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useState } from "react";
import { CiSettings } from "react-icons/ci";


const url = {
    home: "/admin",
    list: "/admin/users",
    create: "/admin/users/create",
}
const breadcrumb: BreadcrumbItemType[] =
    [
        {
            href: url.home,
            title: <HomeOutlined />,
        },
        {
            href: url.list,
            title: (
                <>
                    <UserOutlined />
                    <span>Danh sách sản phẩm</span>
                </>
            ),
        },
        {
            title: "Nhập BoardGame"
        },

    ];
const items = [
    {
        value: 0,
        label: (<span >  Thêm mới hoàn toàn một sản phẩm </span>),
    },
    {
        value: 1,
        label: (<span > Thêm một sản phẩm mẫu </span>),
    },
    {
        value: 2,
        label: (<span >  Thêm số lượng vào sản phẩm đã có </span>),
    },
]
export default function ManagerCreateBGame() {
    const [mode, setMode] = useState<number>(0);
    const onChange = (value: number) => {
        setMode(value);
    }
    const pageTitle = () => {
        return (
            <div className="flex justify-between">
                <p>{items[mode].label}</p>

                <Select className="w-75" options={items} onChange={(value) => onChange(value)}
                    menuItemSelectedIcon={<CiSettings />}
                    defaultValue={0} />

            </div>
        )
    }
    return (
        <>
            <Breadcrumb items={breadcrumb} />
            <Card title={pageTitle()}></Card>

        </>
    )
}