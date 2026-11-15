import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "same-origin",
});

/**
 * Shared RTK Query base query that routes requests through Next.js BFF endpoints
 * and redirects to `/login?expired=1` when an authenticated session returns 401.
 */
const baseQueryWithSessionHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const requestUrl = typeof args === "string" ? args : args.url;
    const isAuthAttempt =
      requestUrl === "/auth/login" || requestUrl === "/auth/register";

    if (!isAuthAttempt && typeof window !== "undefined") {
      const path = window.location.pathname;
      const isPublicAuthPage =
        path === "/login" || path === "/register" || path === "/";
      if (!isPublicAuthPage) {
        window.location.assign("/login?expired=1");
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithSessionHandling,
  tagTypes: ["Auth", "Notes", "Note", "Posts", "Post"],
  endpoints: () => ({}),
});
