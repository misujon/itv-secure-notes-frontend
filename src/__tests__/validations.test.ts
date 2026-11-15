import { describe, expect, it } from "vitest";
import {
  loginSchema,
  registerSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from "@/lib/validations/auth";
import { noteSchema } from "@/lib/validations/note";
import { postSchema } from "@/lib/validations/post";

describe("Validation schemas", () => {
  it("validates login credentials", () => {
    expect(
      loginSchema.safeParse({ email: "user@example.com", password: "secret" })
        .success,
    ).toBe(true);

    expect(
      loginSchema.safeParse({ email: "not-an-email", password: "" }).success,
    ).toBe(false);
  });

  it("validates registration and password confirmation", () => {
    expect(
      registerSchema.safeParse({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
        password_confirmation: "password123",
      }).success,
    ).toBe(true);

    const mismatch = registerSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      password_confirmation: "different",
    });
    expect(mismatch.success).toBe(false);
  });

  it("validates note title and content limits", () => {
    expect(
      noteSchema.safeParse({ title: "My Note", content: "Some content" }).success,
    ).toBe(true);

    expect(noteSchema.safeParse({ title: "   ", content: "Body" }).success).toBe(
      false,
    );

    expect(
      noteSchema.safeParse({ title: "a".repeat(201), content: "Body" }).success,
    ).toBe(false);
  });

  it("validates post title and content", () => {
    expect(
      postSchema.safeParse({ title: "Public Post", content: "Hello world" })
        .success,
    ).toBe(true);

    expect(postSchema.safeParse({ title: "", content: "" }).success).toBe(
      false,
    );
  });

  it("validates profile update and password update schemas", () => {
    expect(
      updateProfileSchema.safeParse({
        name: "Jane Doe",
        email: "jane@example.com",
        interests: ["chess", "reading"],
      }).success,
    ).toBe(true);

    expect(
      updateProfileSchema.safeParse({
        name: "",
        email: "invalid",
        interests: [],
      }).success,
    ).toBe(false);

    expect(
      updatePasswordSchema.safeParse({
        current_password: "oldpassword",
        password: "newpassword123",
        password_confirmation: "newpassword123",
      }).success,
    ).toBe(true);

    expect(
      updatePasswordSchema.safeParse({
        current_password: "oldpassword",
        password: "newpassword123",
        password_confirmation: "mismatch",
      }).success,
    ).toBe(false);
  });
});
