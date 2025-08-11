// app/api/me/route.ts
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;
  if (!sessionToken) {
    return Response.json({ message: "Chưa đăng nhập" }, { status: 401 });
  }

  // Gọi API backend để lấy user info
  // const res = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
  //   headers: {
  //     Authorization: `Bearer ${sessionToken}`,
  //   },
  //   cache: "no-store",
  // });

  // if (!res.ok) {
  //   return Response.json({ message: "Không lấy được user" }, { status: res.status });
  // }
  
  // const data = await res.json();
  const data = true
  return Response.json(data);
}
