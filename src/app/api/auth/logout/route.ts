import { NextResponse } from "next/server";
import { fetchLaravel } from "@/lib/api/laravel";
import { clearAuthToken, getAuthToken } from "@/lib/auth/cookies";

export async function POST() {
  const token = await getAuthToken();

  if (token) {
    await fetchLaravel("/auth/logout", {
      method: "POST",
      token,
    });
  }

  await clearAuthToken();

  return NextResponse.json(
    {
      success: true,
      message: "Logged out successfully.",
      data: null,
    },
    { status: 200 },
  );
}
