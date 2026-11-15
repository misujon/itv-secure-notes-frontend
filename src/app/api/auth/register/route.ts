import { NextRequest, NextResponse } from "next/server";
import {
  fetchLaravel,
  jsonError,
  type LaravelAuthPayload,
} from "@/lib/api/laravel";
import { setAuthToken } from "@/lib/auth/cookies";
import type { ApiSuccessResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return jsonError("Invalid request body.", 400);
  }

  const result = await fetchLaravel<ApiSuccessResponse<LaravelAuthPayload>>(
    "/auth/register",
    {
      method: "POST",
      body: {
        name: body.name,
        email: body.email,
        password: body.password,
        password_confirmation: body.password_confirmation,
        ...(Array.isArray(body.interests) ? { interests: body.interests } : {}),
      },
    },
  );

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  const payload = (result.data as ApiSuccessResponse<LaravelAuthPayload>).data;
  await setAuthToken(payload.token, payload.expires_in);

  return NextResponse.json(
    {
      success: true,
      message: (result.data as ApiSuccessResponse<LaravelAuthPayload>).message,
      data: {
        user: payload.user,
      },
    },
    { status: 201 },
  );
}
