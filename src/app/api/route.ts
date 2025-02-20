//LƯU Ý: NẾU GỌI API TỪ SERVER SIDE VÀO SERVER THÌ CẦN PHẢI DÙNG ĐƯỜNG DẪN TUYỆT ĐỐI
export async function POST(request: Request) {
    const body = await request.json()
    const sessionToken = body.sessionToken as string
    const sessionRole = body.sessionRole as string
    const expiresAt = body.expiresAt as string
    if (!sessionToken) {
      return Response.json(
        { message: 'Không nhận được session token' },
        {
          status: 400
        }
      )
    }
    const expiresDate = new Date(expiresAt).toUTCString();
    return Response.json(body,   {
      status: 200,
      headers: {
        'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure, sessionRole=${sessionRole}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`,
      }
    })
  }