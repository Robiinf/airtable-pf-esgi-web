import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { airtableApi } from "@/lib/airtable";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const response = await airtableApi.get("/Admins", {
      params: {
        filterByFormula: `Email = "${email}"`,
      },
    });
    const records = response.data.records;

    if (records.length === 0) {
      return NextResponse.json(
        { message: "Identifiants invalides" },
        { status: 401 }
      );
    }

    const admin = records[0].fields;

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.Password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // ✅ Créer le JWT avec jose
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback-secret-key-change-in-production"
    );

    const token = await new SignJWT({
      adminId: records[0].id,
      email: admin.Email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    const cookieStore = cookies();

    cookieStore.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 jour
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
