"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import authApiRequest from "@/src/apiRequests/auth";
import { useAppContext } from "@/src/app/app-provider";

export function useLogout() {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser } = useAppContext();

  const logout = useCallback(
    async (force = true, redirect = true) => {
      try {
        const controller = new AbortController();
        const signal = controller.signal;

        await authApiRequest.logoutFromNextClientToNextServer(force, signal);

        if (redirect) {
          router.push(`/login?redirectFrom=${pathname}`);
        }

        return { success: true };
      } catch (err) {
        console.error("Logout failed:", err);
        setUser(null);
        if (redirect) {
          router.push(`/login`);
        }
        return { success: false, error: err };
      }
    },
    [router, pathname, setUser]
  );

  return { logout };
}
