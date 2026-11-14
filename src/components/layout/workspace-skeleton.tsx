import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceSkeleton() {
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-border bg-card p-4 space-y-4">
        <Skeleton className="h-8 w-36" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-32" />
        </header>
        <main className="p-6 max-w-6xl w-full mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-36 w-full rounded-xl" />
          </div>
        </main>
      </div>
    </div>
  );
}
