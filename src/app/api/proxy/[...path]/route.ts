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

const OBJECT_ID_REGEX = /^[a-f0-9]{24}$/i;

type AllowedRoute = {
  requiresAuth: boolean;
};

function resolveAllowedRoute(
  segments: string[],
  method: string,
): AllowedRoute | null {
  const path = segments.join("/");

  if (path === "notes" && (method === "GET" || method === "POST")) {
    return { requiresAuth: true };
  }

  if (
    segments.length === 2 &&
    segments[0] === "notes" &&
    OBJECT_ID_REGEX.test(segments[1]) &&
    (method === "GET" || method === "PATCH" || method === "DELETE")
  ) {
    return { requiresAuth: true };
  }

  if (path === "interests" && method === "GET") {
    return { requiresAuth: false };
  }

  if (path === "posts" && method === "GET") {
    return { requiresAuth: false };
  }

  if (path === "posts" && method === "POST") {
    return { requiresAuth: true };
  }

  if (
    segments.length === 2 &&
    segments[0] === "posts" &&
    OBJECT_ID_REGEX.test(segments[1]) &&
    method === "GET"
  ) {
    return { requiresAuth: false };
  }

  if (
    segments.length === 2 &&
    segments[0] === "posts" &&
    OBJECT_ID_REGEX.test(segments[1]) &&
    method === "PATCH"
  ) {
    return { requiresAuth: true };
  }

  if (
    segments.length === 3 &&
    segments[0] === "users" &&
    OBJECT_ID_REGEX.test(segments[1]) &&
    segments[2] === "posts" &&
    method === "GET"
  ) {
    return { requiresAuth: false };
  }

  return null;
}

async function handleProxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  const method = request.method.toUpperCase();
  const routeRule = resolveAllowedRoute(segments, method);

  if (!routeRule) {
    return jsonError("Endpoint not found.", 404);
  }

  const token = await getAuthToken();
  if (routeRule.requiresAuth && !token) {
    return jsonError("Unauthenticated.", 401);
  }

  let body: unknown = undefined;
  if (method === "POST" || method === "PATCH") {
    body = await request.json().catch(() => null);
    if (body === null) {
      return jsonError("Invalid JSON request body.", 400);
    }
  }

  const laravelPath = `/${segments.join("/")}`;
  const searchParams = request.nextUrl.searchParams;

  let result = await fetchLaravel(laravelPath, {
    method,
    token,
    body,
    searchParams,
  });

  if (result.status === 401 && token) {
    const refreshed = await tryRefreshLaravelToken(token);
    if (refreshed) {
      await setAuthToken(refreshed.token, refreshed.expires_in);
      result = await fetchLaravel(laravelPath, {
        method,
        token: refreshed.token,
        body,
        searchParams,
      });
    } else {
      await clearAuthToken();
    }
  }

  return NextResponse.json(result.data, { status: result.status });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, context);
}
