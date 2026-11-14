export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  interests: string[];
  created_at: string | null;
  updated_at: string | null;
}

export interface AuthorSummary {
  id: string;
  name: string;
  email: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  user?: AuthorSummary;
  created_at: string | null;
  updated_at: string | null;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  user?: AuthorSummary;
  created_at: string | null;
  updated_at: string | null;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface UserPostsAggregation {
  user: Pick<User, "id" | "name" | "email" | "role" | "interests">;
  posts: Post[];
}

export interface UserPostsResponse {
  success: true;
  message: string;
  data: UserPostsAggregation;
  meta: PaginationMeta;
}
