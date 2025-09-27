"use client";

import { Suspense, useEffect } from "react";
import { useLogout } from "@/src/hooks/useLogout"; 
import Loading from "../../loading";

function LogoutLogic() {
  const { logout } = useLogout();

  useEffect(() => {
    logout(true, true);
  }, [logout]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <Loading />
    </div>
  );
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LogoutLogic />
    </Suspense>
  );
}
