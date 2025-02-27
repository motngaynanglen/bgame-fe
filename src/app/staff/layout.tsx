
import Layout from "@/src/components/admin/Layout";
import StaffRouter from "@/src/routers/StaffRoutes";

export default function StaffRouteLayout({ children }: { children: React.ReactNode; }) {
    return (
        <Layout menu={StaffRouter}>
            {children}
        </Layout>
    );
}