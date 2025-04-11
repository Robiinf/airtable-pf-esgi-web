import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const url = request.nextUrl;

  if (url.pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      const { payload } = await jwtVerify(token, secret);

      return NextResponse.next();
    } catch (error) {
      console.error("❌ Invalid token:", error.message);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
