import { NextResponse } from "next/server";
import { getLaravelApiUrl } from "@/config/env";
import type { ApiErrorResponse, User } from "@/types/api";

const REQUEST_TIMEOUT_MS = 15_000;

export interface LaravelFetchResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
}

export interface LaravelAuthPayload {
  token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

const DEFAULT_STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  422: "Please check the highlighted form fields.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "An unexpected server error occurred. Please try again later.",
};

export function normalizeErrorMessage(status: number, rawMessage?: unknown): string {
  if (typeof rawMessage === "string" && rawMessage.trim().length > 0 && status < 500) {
    return rawMessage;
  }
  return DEFAULT_STATUS_MESSAGES[status] ?? "Something went wrong. Please try again.";
}

export async function fetchLaravel<T = unknown>(
  path: string,
  options: {
    method?: string;
    token?: string | null;
    body?: unknown;
    searchParams?: URLSearchParams;
  } = {},
): Promise<LaravelFetchResult<T | ApiErrorResponse>> {
  const baseUrl = getLaravelApiUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const query = options.searchParams?.toString();
  const url = `${baseUrl}${normalizedPath}${query ? `?${query}` : ""}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let bodyString: string | undefined;
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    bodyString = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body: bodyString,
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const contentType = response.headers.get("content-type") ?? "";
    let parsed: unknown = null;

    if (contentType.includes("application/json")) {
      parsed = await response.json().catch(() => null);
    }

    if (!response.ok) {
      const errObj = (parsed && typeof parsed === "object" ? parsed : {}) as Record<
        string,
        unknown
      >;
      const normalized: ApiErrorResponse = {
        success: false,
        message: normalizeErrorMessage(response.status, errObj.message),
        ...(errObj.errors && typeof errObj.errors === "object"
          ? { errors: errObj.errors as Record<string, string[]> }
          : {}),
      };
      return { ok: false, status: response.status, data: normalized };
    }

    return {
      ok: true,
      status: response.status,
      data: parsed as T,
    };
  } catch (error) {
    const isTimeout =
      error instanceof DOMException &&
      (error.name === "TimeoutError" || error.name === "AbortError");

    return {
      ok: false,
      status: isTimeout ? 504 : 502,
      data: {
        success: false,
        message: isTimeout
          ? "The server took too long to respond. Please try again."
          : "Unable to connect to the backend service.",
      },
    };
  }
}

export async function tryRefreshLaravelToken(
  currentToken: string,
): Promise<LaravelAuthPayload | null> {
  const result = await fetchLaravel<{
    success: boolean;
    data?: LaravelAuthPayload;
  }>("/auth/refresh", {
    method: "POST",
    token: currentToken,
  });

  if (!result.ok || !result.data || !("data" in result.data) || !result.data.data?.token) {
    return null;
  }

  return result.data.data;
}

export function jsonError(
  message: string,
  status: number,
  errors?: Record<string, string[]>,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    },
    { status },
  );
}
