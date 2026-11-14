import { describe, expect, it, vi } from "vitest";
import {
  applyServerValidationErrors,
  extractApiError,
} from "@/lib/utils/api-error";

describe("extractApiError", () => {
  it("extracts Laravel API error message and field errors", () => {
    const err = {
      status: 422,
      data: {
        success: false,
        message: "Validation failed",
        errors: {
          email: ["The email has already been taken."],
        },
      },
    };

    const parsed = extractApiError(err);
    expect(parsed.status).toBe(422);
    expect(parsed.message).toBe("Validation failed");
    expect(parsed.errors?.email?.[0]).toBe("The email has already been taken.");
  });

  it("handles timeout and network errors", () => {
    expect(extractApiError({ status: "TIMEOUT_ERROR", data: null }).message).toContain(
      "timed out",
    );
    expect(extractApiError({ status: "FETCH_ERROR", data: null }).message).toContain(
      "Network error",
    );
  });

  it("maps server validation errors onto react-hook-form fields", () => {
    const setError = vi.fn();
    const err = {
      status: 422,
      data: {
        success: false,
        message: "Validation failed",
        errors: {
          title: ["The title field is required."],
          unknown_field: ["Ignored"],
        },
      },
    };

    const message = applyServerValidationErrors(err, setError, [
      "title",
      "content",
    ]);

    expect(message).toBe("Validation failed");
    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenCalledWith("title", {
      type: "server",
      message: "The title field is required.",
    });
  });
});
