import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      // Decode token (simple check)
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );

      // Check role
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
};

// Only run middleware on admin pages
export const config = {
  matcher: ["/admin/:path*"],
};
