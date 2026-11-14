import { NextResponse } from "next/server";
import { jsonError, tryRefreshLaravelToken } from "@/lib/api/laravel";
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from "@/lib/auth/cookies";

export async function POST() {
  const token = await getAuthToken();
  if (!token) {
    return jsonError("Unauthenticated.", 401);
  }

  const refreshed = await tryRefreshLaravelToken(token);
  if (!refreshed) {
    await clearAuthToken();
    return jsonError("Your session has expired. Please sign in again.", 401);
  }

  await setAuthToken(refreshed.token, refreshed.expires_in);

  return NextResponse.json(
    {
      success: true,
      message: "Token refreshed successfully.",
      data: {
        user: refreshed.user,
      },
    },
    { status: 200 },
  );
}
