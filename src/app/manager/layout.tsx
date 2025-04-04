
import Layout from "@/src/components/admin/Layout";
import ManagerRouter from "@/src/routers/ManagerRoutes";

export default function ManagerRouteLayout({ children }: { children: React.ReactNode; }) {
    return (
        <Layout menu={ManagerRouter}>
            {children}
        </Layout>
    );
}