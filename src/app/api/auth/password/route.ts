import { NextRequest, NextResponse } from "next/server";
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
import type { ApiSuccessResponse } from "@/types/api";

export async function PATCH(request: NextRequest) {
  const token = await getAuthToken();
  if (!token) {
    return jsonError("Unauthenticated.", 401);
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return jsonError("Invalid request body.", 400);
  }

  const payload = {
    current_password: body.current_password,
    password: body.password,
    password_confirmation: body.password_confirmation,
  };

  let result = await fetchLaravel<ApiSuccessResponse<null>>("/auth/password", {
    method: "PATCH",
    token,
    body: payload,
  });

  if (result.status === 401) {
    const refreshed = await tryRefreshLaravelToken(token);
    if (refreshed) {
      await setAuthToken(refreshed.token, refreshed.expires_in);
      result = await fetchLaravel<ApiSuccessResponse<null>>("/auth/password", {
        method: "PATCH",
        token: refreshed.token,
        body: payload,
      });
    } else {
      await clearAuthToken();
    }
  }

  return NextResponse.json(result.data, { status: result.status });
}
