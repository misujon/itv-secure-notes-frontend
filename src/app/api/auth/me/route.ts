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
    name: body.name,
    email: body.email,
    ...(Array.isArray(body.interests) ? { interests: body.interests } : {}),
  };

  let result = await fetchLaravel<ApiSuccessResponse<User>>("/auth/me", {
    method: "PATCH",
    token,
    body: payload,
  });

  if (result.status === 401) {
    const refreshed = await tryRefreshLaravelToken(token);
    if (refreshed) {
      await setAuthToken(refreshed.token, refreshed.expires_in);
      result = await fetchLaravel<ApiSuccessResponse<User>>("/auth/me", {
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
