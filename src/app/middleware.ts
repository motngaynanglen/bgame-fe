import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const privatePaths = ["/profile", "/user", "/admin", "/manager", "/partner",'/staff']; //, 
const managePaths = ["/admin", "/manager", "/partner", '/staff',];
const authPaths = ["/login", "/register"];
// const adminPaths = ['/admin/:part*'];
// const managerPaths = ['/manager/:part*'];
const productEditRegex = /^\/products\/\d+\/edit$/;

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const sessionRole = request.cookies.get("sessionRole")?.value;
 console.log("run middleware:"+ sessionRole)
  //  bconsole.log(pathname + ' : ' + sessionRole);

  // Bảng điều hướng - Verson 2

  // if (!sessionToken || sessionToken === "") {
  //   // Chưa đăng nhập thì không cho vào private paths
  //   if (privatePaths.some((path) => pathname.startsWith(path))) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }

  // if (sessionToken) {
  //   // Điều hướng và xác thực cho các yêu cầu vào trang admin
  //   // Điều kiện này là không cần thiết vì đã khai báo ở dưới config, middleware sẽ không chạy nếu được truyền vào trang logout
  //   // Để cho đẹp tí :v

  //   if (pathname.startsWith("/logout")) {
  //     return NextResponse.next();
  //   } else {
  //     switch (sessionRole) {
  //       case "ADMIN": {
  //         if (authPaths.some((path) => pathname.startsWith(path))) {
  //           return NextResponse.redirect(new URL("/admin", request.url));
  //         }
  //         if (!pathname.startsWith("/admin") && pathname == "/") {
  //           return NextResponse.redirect(new URL("/admin", request.url));
  //         }
  //         if (!pathname.startsWith("/admin") && pathname != "/") {
  //           return NextResponse.redirect(new URL("/logout", request.url));
  //         }
  //         break;
  //       }
  //       case "MANAGER": {
  //         if (authPaths.some((path) => pathname.startsWith(path))) {
  //           return NextResponse.redirect(new URL("/manager", request.url));
  //         }
  //         if (!pathname.startsWith("/manager") && pathname == "/") {
  //           return NextResponse.redirect(new URL("/manager", request.url));
  //         }
  //         if (!pathname.startsWith("/manager") && pathname != "/") {
  //           return NextResponse.redirect(new URL("/logout", request.url));
  //         }
  //         break;
  //       }
  //       case "PARTNER": {
  //         if (authPaths.some((path) => pathname.startsWith(path))) {
  //           return NextResponse.redirect(new URL("/partner", request.url));
  //         }
  //         if (!pathname.startsWith("/partner") && pathname == "/") {
  //           return NextResponse.redirect(new URL("/partner", request.url));
  //         }
  //         if (!pathname.startsWith("/partner") && pathname != "/") {
  //           return NextResponse.redirect(new URL("/logout", request.url));
  //         }
  //         break;
  //       }
  //       case "STAFF": {
  //         if (authPaths.some((path) => pathname.startsWith(path))) {
  //           return NextResponse.redirect(new URL("/staff", request.url));
  //         }
  //         if (!pathname.startsWith("/staff") && pathname == "/") {
  //           return NextResponse.redirect(new URL("/staff", request.url));
  //         }
  //         if (!pathname.startsWith("/staff") && pathname != "/") {
  //           return NextResponse.redirect(new URL("/logout", request.url));
  //         }
  //         break;
  //       }
  //       case "CUSTOMER": {
  //         if (authPaths.some((path) => pathname.startsWith(path))) {
  //           return NextResponse.redirect(new URL("/user/profile", request.url));
  //         }
  //         if (managePaths.some((path) => pathname.startsWith(path))) {
  //           return NextResponse.redirect(new URL("/logout", request.url));
  //         }
  //         break;
  //       }
  //       default: {
  //         break;
  //       }
  //     }
  //   }
  // }

  // Bảng điều hướng - Verson 1
  // // Điều hướng và xác thực cho các yêu cầu vào trang admin
  // if (pathname.startsWith('/admin') && sessionToken && sessionRole != 'ADMIN') {
  //   return NextResponse.redirect(new URL('/error', request.url));
  // }
  // if ((!pathname.startsWith('/admin')) && sessionToken && sessionRole == 'ADMIN'){
  //   return NextResponse.redirect(new URL('/admin', request.url));
  // }
  // // Điều hướng và xác thực cho các yêu cầu vào trang manager
  // if (pathname.startsWith('/manager') && sessionToken && sessionRole != 'MANAGER') {
  //   return NextResponse.redirect(new URL('/error', request.url));
  // } else if (!(pathname.startsWith('/manager')) && sessionToken && sessionRole == 'MANAGER'){
  //   return NextResponse.redirect(new URL('/manager', request.url));
  // }
  // // Điều hướng và xác thực cho các yêu cầu vào trang manager
  // if (pathname.startsWith('/partner') && sessionToken && sessionRole != 'PARTNER') {
  //   return NextResponse.redirect(new URL('/error', request.url));
  // } else if (!(pathname.startsWith('/partner')) && sessionToken && sessionRole == 'PARTNER'){
  //   return NextResponse.redirect(new URL('/partner', request.url));
  // }

  // // Chưa đăng nhập thì không cho vào private paths
  // if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  // // Đăng nhập rồi thì không cho vào login/register nữa
  // if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
  //   return NextResponse.redirect(new URL('/profile', request.url));
  // }

  return NextResponse.next();
}

// cái matcher này là dùng để khai báo những role nào sẽ được chạy middleware này
// chuỗi kí tự khai báo dưới đây sẽ cho phép middleware này chạy ở tất cả page ngoại trừ cái đã được liệt kê bên trong
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logout|assets).*)"],
  // matcher: ['/profile', '/login', '/register','/admin/:part*','/manager/:part*','/partner/:part*' ] //version 1
};
