import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithInterceptor from "../../../utils/interceptor";

export const messagesApi = createApi({
    reducerPath: "messagesApi",
    baseQuery: baseQueryWithInterceptor,
    tagTypes: ["Messages", "Users"],

    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => "/messages/users",
            providesTags: ["Users"],
        }),
        getMessages: builder.query({
            query: ({ id }) => ({
                url: `/messages/${id}`,
                method: "GET",
            }),
            providesTags: ["Messages"],
        }),
        sendMessage: builder.mutation({
            query: ({ id, message }) => ({
                url: `/messages/send/${id}`,
                method: "POST",
                body: message,
            }),
            invalidatesTags: ["Messages"],
        }),
    }),
});

export const { useGetUsersQuery, useGetMessagesQuery, useSendMessageMutation } = messagesApi;
