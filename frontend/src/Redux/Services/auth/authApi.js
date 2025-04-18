import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithInterceptor from "../../../utils/interceptor";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithInterceptor,
    tagTypes: ["User", "Users"],
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (body) => ({
                url: "/auth/signup",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Users"],
        }),
        login: builder.mutation({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),
        updateProfile: builder.mutation({
            query: (profilePic) => ({
                url: "/auth/update",
                method: "PUT",
                body: profilePic,
            }),
            invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
        }),
        checkAuth: builder.query({
            query: () => "/auth/check",
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }),
        getAllUsers: builder.query({
            query: () => "/auth/getAllUsers",
            providesTags: ["Users"],
        }),
        getUserById: builder.query({
            query: (id) => `/auth/getUserById/${id}`,
            providesTags: (result, error, id) => [{ type: "User", id }],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/auth/deleteUser/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "User", id }, "Users"],
        }),
    }),
});

export const {
    useSignupMutation,
    useLoginMutation,
    useLogoutMutation,
    useUpdateProfileMutation,
    useCheckAuthQuery,
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useDeleteUserMutation,
} = authApi;
