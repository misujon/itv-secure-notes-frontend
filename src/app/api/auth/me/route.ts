import { NextResponse } from "next/server";
import {
  fetchLaravel,
  jsonError,
  tryRefreshLaravelToken,
} from "@/lib/api/laravel";
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from "@/lib/auth/cookies";
import type { ApiSuccessResponse, User } from "@/types/api";

export async function GET() {
  const token = await getAuthToken();
  if (!token) {
    return jsonError("Unauthenticated.", 401);
  }

  let result = await fetchLaravel<ApiSuccessResponse<User>>("/auth/me", {
    method: "GET",
    token,
  });

  if (result.status === 401) {
    const refreshed = await tryRefreshLaravelToken(token);
    if (refreshed) {
      await setAuthToken(refreshed.token, refreshed.expires_in);
      result = await fetchLaravel<ApiSuccessResponse<User>>("/auth/me", {
        method: "GET",
        token: refreshed.token,
      });
    } else {
      await clearAuthToken();
    }
  }

  return NextResponse.json(result.data, { status: result.status });
}
