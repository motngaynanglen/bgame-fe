import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function serverLogout(request: NextRequest, redirectTo = "/login") {
  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  // Xoá cookie
  response.cookies.set("sessionToken", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });
  response.cookies.set("sessionRole", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}
