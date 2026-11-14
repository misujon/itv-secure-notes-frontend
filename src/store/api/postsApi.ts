import { baseApi } from "@/store/api/baseApi";
import type { PostFormValues } from "@/lib/validations/post";
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  Post,
  UserPostsResponse,
} from "@/types/api";

export interface PostsQueryParams {
  page?: number;
  per_page?: number;
}

export interface UserPostsQueryParams extends PostsQueryParams {
  userId: string;
}

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<ApiPaginatedResponse<Post>, PostsQueryParams | void>({
      query: (params) => {
        const page = params?.page ?? 1;
        const perPage = params?.per_page ?? 12;
        return `/proxy/posts?page=${page}&per_page=${perPage}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Post" as const, id })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),
    getPost: builder.query<Post, string>({
      query: (id) => `/proxy/posts/${id}`,
      transformResponse: (response: ApiSuccessResponse<Post>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),
    createPost: builder.mutation<Post, PostFormValues>({
      query: (body) => ({
        url: "/proxy/posts",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Post>) => response.data,
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),
    getUserPosts: builder.query<UserPostsResponse, UserPostsQueryParams>({
      query: ({ userId, page = 1, per_page = 12 }) =>
        `/proxy/users/${userId}/posts?page=${page}&per_page=${per_page}`,
      providesTags: (_result, _error, { userId }) => [
        { type: "Posts", id: `USER-${userId}` },
      ],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useGetUserPostsQuery,
} = postsApi;
