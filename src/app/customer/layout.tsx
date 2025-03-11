
import Layout from "@/src/components/Customer/Layout";
import { ReactNode } from "react";

const ProfileRouteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Layout>{children}</Layout>
    </>
  );
};

export default ProfileRouteLayout;
