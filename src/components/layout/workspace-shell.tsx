"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  PanelLeft,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { APP_CONFIG } from "@/config/env";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/store/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileNavOpen, toggleSidebar } from "@/store/slices/uiSlice";
import type { User } from "@/types/api";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    requiresAuth: true,
  },
  {
    label: "My Notes",
    href: "/notes",
    icon: NotebookPen,
    requiresAuth: true,
  },
  {
    label: "Posts",
    href: "/posts",
    icon: FileText,
    requiresAuth: false,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserRound,
    requiresAuth: true,
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function SidebarNav({
  user,
  collapsed,
  onNavigate,
}: {
  user: User | null;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const visibleItems = NAV_ITEMS.filter((item) => !item.requiresAuth || Boolean(user));

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
        <Link
          href={user ? "/dashboard" : "/"}
          onClick={onNavigate}
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <NotebookPen className="size-4" aria-hidden="true" />
          </span>
          {!collapsed ? (
            <span className="truncate text-base font-semibold tracking-tight text-sidebar-foreground">
              {APP_CONFIG.name}
            </span>
          ) : null}
        </Link>
      </div>

      <nav
        aria-label="Workspace navigation"
        className="flex-1 space-y-1 p-3"
      >
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden="true" />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
          );
        })}

        {user?.role === "admin" ? (
          <div className="pt-4 mt-4 border-t border-sidebar-border">
            {!collapsed ? (
              <p className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Administration
              </p>
            ) : null}
            <a
              href={APP_CONFIG.adminPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={collapsed ? "Administration Portal (Laravel Blade)" : undefined}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                collapsed && "justify-center px-2",
              )}
            >
              <span className="flex items-center gap-3 min-w-0">
                <ShieldCheck className="size-[18px] shrink-0 text-primary" aria-hidden="true" />
                {!collapsed ? (
                  <span className="truncate">Administration Portal</span>
                ) : null}
              </span>
              {!collapsed ? (
                <ExternalLink className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
              ) : null}
            </a>
          </div>
        ) : null}
      </nav>

      {user && !collapsed ? (
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-muted/60 px-3 py-2">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function WorkspaceShell({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const mobileNavOpen = useAppSelector((state) => state.ui.mobileNavOpen);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Signed out successfully.");
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Could not sign out cleanly. Redirecting to sign in.");
      router.replace("/login");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 z-30 border-r border-sidebar-border bg-sidebar transition-all duration-200",
          collapsed ? "md:w-16" : "md:w-64",
        )}
      >
        <SidebarNav user={user} collapsed={collapsed} />
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-1 flex-col min-w-0 transition-all duration-200",
          collapsed ? "md:pl-16" : "md:pl-64",
        )}
      >
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/95 px-4 backdrop-blur-xs sm:px-6">
          <div className="flex items-center gap-2">
            {/* Mobile Sheet Trigger */}
            <Sheet
              open={mobileNavOpen}
              onOpenChange={(open) => dispatch(setMobileNavOpen(open))}
            >
              <SheetTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "md:hidden",
                )}
                aria-label="Open navigation menu"
              >
                <PanelLeft className="size-5" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarNav
                  user={user}
                  collapsed={false}
                  onNavigate={() => dispatch(setMobileNavOpen(false))}
                />
              </SheetContent>
            </Sheet>

            {/* Desktop Collapse Trigger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleSidebar())}
              className="hidden md:inline-flex"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeft className="size-5" aria-hidden="true" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Account menu"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {user.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium leading-none truncate">
                            {user.name}
                          </p>
                          <Badge variant="secondary" className="capitalize text-[10px]">
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <UserRound className="mr-2 size-4" aria-hidden="true" />
                    Profile
                  </DropdownMenuItem>

                  {user.role === "admin" ? (
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(
                          APP_CONFIG.adminPortalUrl,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                    >
                      <ShieldCheck className="mr-2 size-4 text-primary" aria-hidden="true" />
                      Administration Portal
                    </DropdownMenuItem>
                  ) : null}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 size-4" aria-hidden="true" />
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({ size: "sm" })}
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
