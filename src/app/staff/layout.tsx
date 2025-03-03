
import Layout from "@/src/components/admin/Layout";
import StaffRouter from "@/src/routers/StaffRoutes";
import { ConfigProvider } from "antd";

export default function StaffRouteLayout({ children }: { children: React.ReactNode; }) {
    return (
        <>
            <ConfigProvider
                theme={{
                    components: {
                        Menu: {
                            colorBgContainer: '#FF9200',
                            colorText: '#000000',
                            itemSelectedColor:'',
                            itemSelectedBg: '#F1B86E',
                        },
                    },
                }}
            >
                <Layout menu={StaffRouter} theme="light">
                    {children}
                </Layout>
            </ConfigProvider>
        </>
    );
}