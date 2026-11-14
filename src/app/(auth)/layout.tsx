import Link from "next/link";
import { NotebookPen } from "lucide-react";
import { APP_CONFIG } from "@/config/env";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <NotebookPen className="size-5" aria-hidden="true" />
            </span>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              {APP_CONFIG.name}
            </span>
          </Link>
        </div>

        {children}

        <p className="text-center text-xs text-muted-foreground">
          Want to explore first?{" "}
          <Link
            href="/posts"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Browse public posts
          </Link>
        </p>
      </div>
    </div>
  );
}
