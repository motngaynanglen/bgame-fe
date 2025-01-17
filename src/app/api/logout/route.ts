import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const res = await request.json();
  const force = res.force as boolean | undefined;
  console.log("logout: " + res)
  if (force) {
    return Response.json(
      {
        message: 'Buộc đăng xuất thành công'
      },
      {
        status: 200,
        headers: {
          // Xóa cookie sessionToken
          'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Max-Age=0,sessionRole=; Path=/; HttpOnly; Max-Age=0`
        }
      }
    );
  }
  console.log("logout");
  const cookieStore = await cookies();
  const sessionToken = (cookieStore).get('sessionToken');
  if (!sessionToken) {
    return Response.json(
      { message: 'Không nhận được session token' },
      {
        status: 401
      }
    );
  }
}