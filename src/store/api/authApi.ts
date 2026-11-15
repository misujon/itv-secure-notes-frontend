import { baseApi } from "@/store/api/baseApi";
import type {
  LoginFormValues,
  RegisterFormValues,
  UpdatePasswordFormValues,
  UpdateProfileFormValues,
} from "@/lib/validations/auth";
import type { ApiSuccessResponse, User } from "@/types/api";

export interface InterestItem {
  id: string;
  name: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      transformResponse: (response: ApiSuccessResponse<User>) => response.data,
      providesTags: ["Auth"],
    }),
    getInterests: builder.query<InterestItem[], void>({
      query: () => "/proxy/interests",
      transformResponse: (response: ApiSuccessResponse<InterestItem[]>) =>
        response.data,
    }),
    login: builder.mutation<User, LoginFormValues>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ApiSuccessResponse<{ user: User }>) =>
        response.data.user,
      invalidatesTags: ["Auth", { type: "Notes", id: "LIST" }],
    }),
    register: builder.mutation<User, RegisterFormValues>({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: ApiSuccessResponse<{ user: User }>) =>
        response.data.user,
      invalidatesTags: ["Auth", { type: "Notes", id: "LIST" }],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),
    updateProfile: builder.mutation<User, UpdateProfileFormValues>({
      query: (body) => ({
        url: "/auth/me",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<User>) => response.data,
      invalidatesTags: ["Auth"],
    }),
    updatePassword: builder.mutation<void, UpdatePasswordFormValues>({
      query: (body) => ({
        url: "/auth/password",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetInterestsQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = authApi;
