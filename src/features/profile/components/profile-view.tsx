"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  CircleAlert,
  ExternalLink,
  KeyRound,
  LoaderCircle,
  Mail,
  ShieldCheck,
  Tag,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { InterestSelector } from "@/components/shared/interest-selector";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_CONFIG } from "@/config/env";
import {
  applyServerValidationErrors,
  extractApiError,
} from "@/lib/utils/api-error";
import { formatDisplayDate } from "@/lib/utils/date";
import {
  updatePasswordSchema,
  updateProfileSchema,
  type UpdatePasswordFormValues,
  type UpdateProfileFormValues,
} from "@/lib/validations/auth";
import {
  useGetMeQuery,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from "@/store/api/authApi";

export function ProfileView() {
  const { data: user, isLoading, isError, error, refetch } = useGetMeQuery();
  const [updateProfile, { isLoading: isSavingProfile }] =
    useUpdateProfileMutation();
  const [updatePassword, { isLoading: isSavingPassword }] =
    useUpdatePasswordMutation();

  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const profileForm = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      interests: [],
    },
  });

  const passwordForm = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
        interests: user.interests ?? [],
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (values: UpdateProfileFormValues) => {
    setProfileError(null);
    try {
      await updateProfile(values).unwrap();
      toast.success("Profile updated successfully.");
    } catch (err) {
      const message = applyServerValidationErrors(err, profileForm.setError, [
        "name",
        "email",
        "interests",
      ]);
      setProfileError(message);
    }
  };

  const onPasswordSubmit = async (values: UpdatePasswordFormValues) => {
    setPasswordError(null);
    try {
      await updatePassword(values).unwrap();
      toast.success("Password updated successfully.");
      passwordForm.reset();
    } catch (err) {
      const message = applyServerValidationErrors(err, passwordForm.setError, [
        "current_password",
        "password",
        "password_confirmation",
      ]);
      setPasswordError(message);
    }
  };

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
        description="Manage your account details, interests, and password."
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

        <CardContent className="space-y-4">
          <Separator />
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <UserRound className="size-3.5" aria-hidden="true" />
                Account Role
              </dt>
              <dd className="font-medium capitalize text-foreground">
                {user.role}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                Member Since
              </dt>
              <dd className="font-medium text-foreground">
                {formatDisplayDate(user.created_at)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg">Profile &amp; Interests</CardTitle>
          <CardDescription>
            Update your name, email address, and selectable interests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profileError && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{profileError}</span>
            </div>
          )}

          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  type="text"
                  disabled={isSavingProfile}
                  aria-invalid={Boolean(profileForm.formState.errors.name)}
                  {...profileForm.register("name")}
                />
                {profileForm.formState.errors.name && (
                  <p className="text-xs text-destructive">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  disabled={isSavingProfile}
                  aria-invalid={Boolean(profileForm.formState.errors.email)}
                  {...profileForm.register("email")}
                />
                {profileForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Tag className="size-3.5 text-primary" aria-hidden="true" />
                Interests
              </Label>
              <Controller
                name="interests"
                control={profileForm.control}
                render={({ field }) => (
                  <InterestSelector
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSavingProfile}
                  />
                )}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSavingProfile}>
                {isSavingProfile ? (
                  <>
                    <LoaderCircle
                      className="mr-2 size-4 animate-spin"
                      aria-hidden="true"
                    />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="size-4 text-primary" aria-hidden="true" />
            Change Password
          </CardTitle>
          <CardDescription>
            Confirm your current password before setting a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passwordError && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{passwordError}</span>
            </div>
          )}

          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                disabled={isSavingPassword}
                aria-invalid={Boolean(
                  passwordForm.formState.errors.current_password,
                )}
                {...passwordForm.register("current_password")}
              />
              {passwordForm.formState.errors.current_password && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.current_password.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isSavingPassword}
                  aria-invalid={Boolean(passwordForm.formState.errors.password)}
                  {...passwordForm.register("password")}
                />
                {passwordForm.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">
                  Confirm new password
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isSavingPassword}
                  aria-invalid={Boolean(
                    passwordForm.formState.errors.password_confirmation,
                  )}
                  {...passwordForm.register("password_confirmation")}
                />
                {passwordForm.formState.errors.password_confirmation && (
                  <p className="text-xs text-destructive">
                    {passwordForm.formState.errors.password_confirmation.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSavingPassword}>
                {isSavingPassword ? (
                  <>
                    <LoaderCircle
                      className="mr-2 size-4 animate-spin"
                      aria-hidden="true"
                    />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
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
