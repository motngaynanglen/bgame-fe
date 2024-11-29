
import Layout from "@/src/components/admin/Layout";
import AdminRouter from '@/src/routers/AdminRoutes';

export default function ManageRouteLayout({ children }: { children: React.ReactNode; }) {
    return (
        <Layout menu={AdminRouter}>
            {children}
        </Layout>
    );
}