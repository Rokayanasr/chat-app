import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithInterceptor from "../../../utils/interceptor";

export const messagesApi = createApi({
    reducerPath: "messagesApi",
    baseQuery: baseQueryWithInterceptor,
    tagTypes: ["Messages", "Users"],

    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => "/messages/users",
            method: "GET",
            providesTags: ["Users"],
        }),
        getMessages: builder.query({
            query: ({ id }) => {
                return {
                    url: `/messages/${id}`,
                    method: "GET",
                };
            },
            providesTags: ["Messages"],
        }),
        addMessage: builder.mutation({
            query: ({ id, message }) => {
                return {
                    url: `/messages/send/${id}`,
                    method: "POST",
                    body: message,
                };
            },
            invalidatesTags: ["Messages"],
        }),
    }),
});

export const { useGetUsersQuery, useGetMessagesQuery, useAddMessageMutation } = messagesApi;
