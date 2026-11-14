import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { NotebookPen } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { NoteForm } from "@/features/notes/components/note-form";
import { LoginForm } from "@/features/auth/components/login-form";
import { makeStore } from "@/store";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/login",
}));

describe("Shared & Feature Components", () => {
  it("renders EmptyState with title and description", () => {
    render(
      <EmptyState
        icon={NotebookPen}
        title="No notes yet"
        description="Create your first note."
      />,
    );
    expect(screen.getByText("No notes yet")).toBeInTheDocument();
    expect(screen.getByText("Create your first note.")).toBeInTheDocument();
  });

  it("renders ErrorState and triggers retry callback", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState message="Failed to fetch" onRetry={onRetry} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Failed to fetch");
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("handles PaginationControls page navigation", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <PaginationControls
        meta={{ current_page: 2, per_page: 12, total: 30, last_page: 3 }}
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("validates NoteForm before submitting", async () => {
    const user = userEvent.setup();
    const onSubmitValues = vi.fn();

    render(
      <NoteForm
        submitLabel="Save Note"
        cancelHref="/notes"
        isSubmitting={false}
        onSubmitValues={onSubmitValues}
      />,
    );

    await user.click(screen.getByRole("button", { name: /save note/i }));
    expect(await screen.findByText("Title is required.")).toBeInTheDocument();
    expect(await screen.findByText("Content is required.")).toBeInTheDocument();
    expect(onSubmitValues).not.toHaveBeenCalled();
  });

  it("validates LoginForm fields and toggles password visibility", async () => {
    const user = userEvent.setup();
    const store = makeStore();

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>,
    );

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(await screen.findByText("Password is required.")).toBeInTheDocument();
  });
});
