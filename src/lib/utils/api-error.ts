import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ApiErrorResponse } from "@/types/api";

export interface NormalizedClientError {
  status?: number;
  message: string;
  errors?: Record<string, string[]>;
}

export function extractApiError(error: unknown): NormalizedClientError {
  if (error && typeof error === "object") {
    if ("status" in error && "data" in error) {
      const fetchErr = error as { status: number | string; data: unknown };
      const status =
        typeof fetchErr.status === "number" ? fetchErr.status : undefined;
      const data = fetchErr.data as Partial<ApiErrorResponse> | undefined;

      if (data && typeof data === "object" && typeof data.message === "string") {
        return {
          status,
          message: data.message,
          errors: data.errors,
        };
      }

      if (fetchErr.status === "TIMEOUT_ERROR") {
        return { message: "Request timed out. Please try again." };
      }

      if (fetchErr.status === "FETCH_ERROR") {
        return { message: "Network error. Please check your connection." };
      }
    }

    if ("message" in error && typeof (error as { message: unknown }).message === "string") {
      return { message: (error as { message: string }).message };
    }
  }

  return { message: "Something went wrong. Please try again." };
}

export function applyServerValidationErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  validFields: ReadonlyArray<Path<T>>,
): string {
  const parsed = extractApiError(error);

  if (parsed.errors) {
    for (const [field, messages] of Object.entries(parsed.errors)) {
      if (
        validFields.includes(field as Path<T>) &&
        Array.isArray(messages) &&
        messages.length > 0
      ) {
        setError(field as Path<T>, {
          type: "server",
          message: messages[0],
        });
      }
    }
  }

  return parsed.message;
}
