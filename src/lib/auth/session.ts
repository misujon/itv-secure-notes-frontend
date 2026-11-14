import { fetchLaravel } from "@/lib/api/laravel";
import { getAuthToken } from "@/lib/auth/cookies";
import type { ApiSuccessResponse, User } from "@/types/api";

export async function getServerUser(): Promise<User | null> {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }

  const result = await fetchLaravel<ApiSuccessResponse<User>>("/auth/me", {
    method: "GET",
    token,
  });

  if (!result.ok || !result.data || !("data" in result.data)) {
    return null;
  }

  return result.data.data;
}
