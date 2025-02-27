import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Card } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import BGameForm from "../bGameForm";

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
                    <span>Danh sách trò chơi</span>
                </>
            ),
        },
        {
            title: "Nhập BoardGame"
        },

    ];
export default function ManagerCreateBGame() {
    return (
        <>
            <Breadcrumb items={breadcrumb} />

            <BGameForm/>

        </>
    )
}