export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Secure Notes",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  adminPortalUrl:
    process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL ?? "http://127.0.0.1:8000/admin/login",
} as const;

export function getLaravelApiUrl(): string {
  const url = process.env.LARAVEL_API_URL;
  if (!url) {
    throw new Error("LARAVEL_API_URL environment variable is not configured.");
  }
  return url.replace(/\/+$/, "");
}
