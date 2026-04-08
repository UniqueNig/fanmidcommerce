import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const middleware = (req: NextRequest) => {
  // const token = req.cookies.get("token")?.value;
 const token = req.nextUrl.pathname.startsWith("/admin")
  ? req.cookies.get("admin_token")?.value
  : req.cookies.get("user_token")?.value;
  const { pathname } = req.nextUrl;

  // ✅ Allow login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 🔒 Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        role: string;
      };

      // 🚫 Not admin
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
    } catch (err: any) {
      // ⛔ Expired or invalid token
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
};

// ✅ Only run on admin routes
export const config = {
  matcher: ["/admin/:path*"],
};