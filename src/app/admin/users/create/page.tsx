import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import UserForm from "../userForm";

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
                    <span>Users List</span>
                </>
            ),
        },
        {
            title: "Create user"
        },

    ];
export default function AdminCreateUser() {
    return (
        <>
            <Breadcrumb items={breadcrumb} className="pb-4" />
            <UserForm/>
        </>
    )
}