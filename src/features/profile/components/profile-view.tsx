"use client";

import {
  CalendarDays,
  ExternalLink,
  Mail,
  ShieldCheck,
  Tag,
  UserRound,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_CONFIG } from "@/config/env";
import { extractApiError } from "@/lib/utils/api-error";
import { formatDisplayDate } from "@/lib/utils/date";
import { useGetMeQuery } from "@/store/api/authApi";

export function ProfileView() {
  const { data: user, isLoading, isError, error, refetch } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-14 w-1/2" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <ErrorState
        title="Unable to load profile"
        message={
          error ? extractApiError(error).message : "Profile data is unavailable."
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Profile"
        description="Your account details and interests."
      />

      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <Mail className="size-3.5" aria-hidden="true" />
              {user.email}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="capitalize">
            {user.role}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <dl className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <UserRound className="size-3.5" aria-hidden="true" />
                Account Role
              </dt>
              <dd className="font-medium capitalize text-foreground">
                {user.role}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                Member Since
              </dt>
              <dd className="font-medium text-foreground">
                {formatDisplayDate(user.created_at)}
              </dd>
            </div>
          </dl>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Tag className="size-4 text-primary" aria-hidden="true" />
              Interests
            </div>
            {user.interests && user.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <Badge key={interest} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No interests listed on your profile.
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground pt-2 border-t border-border/60">
            Account details are read-only in this workspace.
          </p>
        </CardContent>
      </Card>

      {user.role === "admin" ? (
        <Card className="border-primary/25 bg-accent/30 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
              Administration Portal
            </CardTitle>
            <CardDescription>
              User management, global notes overview, and interest aggregations
              are available in the Laravel Blade Administration Portal (requires
              separate session login).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href={APP_CONFIG.adminPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Open Administration Portal
              <ExternalLink className="ml-2 size-3.5" aria-hidden="true" />
            </a>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
