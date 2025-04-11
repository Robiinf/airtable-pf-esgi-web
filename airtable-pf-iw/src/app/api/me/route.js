import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback-secret-key-change-in-production"
    );
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json(
      {
        isAdmin: true,
        email: payload.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("JWT verify failed:", error);
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
}
