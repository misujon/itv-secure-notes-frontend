import { baseApi } from "@/store/api/baseApi";
import type { NoteFormValues } from "@/lib/validations/note";
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  Note,
} from "@/types/api";

export interface NotesQueryParams {
  page?: number;
  per_page?: number;
}

export const notesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Paginate the authenticated user's private notes. */
    getNotes: builder.query<ApiPaginatedResponse<Note>, NotesQueryParams | void>({
      query: (params) => {
        const page = params?.page ?? 1;
        const perPage = params?.per_page ?? 12;
        return `/proxy/notes?page=${page}&per_page=${perPage}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Note" as const, id })),
              { type: "Notes", id: "LIST" },
            ]
          : [{ type: "Notes", id: "LIST" }],
    }),
    /** Fetch a single private note by ID. */
    getNote: builder.query<Note, string>({
      query: (id) => `/proxy/notes/${id}`,
      transformResponse: (response: ApiSuccessResponse<Note>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Note", id }],
    }),
    /** Create a new private note and invalidate the notes list cache. */
    createNote: builder.mutation<Note, NoteFormValues>({
      query: (body) => ({
        url: "/proxy/notes",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Note>) => response.data,
      invalidatesTags: [{ type: "Notes", id: "LIST" }],
    }),
    /** Update an existing private note by ID. */
    updateNote: builder.mutation<Note, { id: string } & Partial<NoteFormValues>>({
      query: ({ id, ...body }) => ({
        url: `/proxy/notes/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Note>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Note", id },
        { type: "Notes", id: "LIST" },
      ],
    }),
    /** Soft-delete a private note by ID. */
    deleteNote: builder.mutation<void, string>({
      query: (id) => ({
        url: `/proxy/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Note", id },
        { type: "Notes", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
