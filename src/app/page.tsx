import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Lock,
  NotebookPen,
  ShieldCheck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_CONFIG } from "@/config/env";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <NotebookPen className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {APP_CONFIG.name}
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Primary">
            <Link href="/posts" className={buttonVariants({ variant: "ghost" })}>
              Public Posts
            </Link>
            <Link href="/login" className={buttonVariants({ variant: "outline" })}>
              Sign in
            </Link>
            <Link href="/register" className={buttonVariants()}>
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Your notes and ideas, organized securely.
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg leading-relaxed">
              A calm, distraction-free workspace for managing private notes,
              reading public community posts, and keeping your thoughts
              structured.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
                Open Workspace
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/posts"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Browse Public Posts
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <Card className="border-border shadow-xs">
              <CardHeader className="space-y-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Lock className="size-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-lg">Private by Default</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Your personal notes are scoped to your account and protected by
                server-side JWT session cookies.
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs">
              <CardHeader className="space-y-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <NotebookPen className="size-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-lg">Clean Notes Workflow</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Create, read, update, and delete notes with instant validation,
                server-side pagination, and clear feedback.
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs">
              <CardHeader className="space-y-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <FileText className="size-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-lg">Public Posts</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Explore public posts from the community, view author profiles,
                and publish your own posts when signed in.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            <span>{APP_CONFIG.name}</span>
          </div>
          <span>Powered by Next.js &amp; Laravel REST API</span>
        </div>
      </footer>
    </div>
  );
}
