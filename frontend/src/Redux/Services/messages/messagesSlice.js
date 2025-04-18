import { createSlice } from "@reduxjs/toolkit";
import { messagesApi } from "./messagesApi";
import toast from "react-hot-toast";
const initialState = {
    messages: [],
    users: [],
    selectedUser: null,
    isSendingMessage: false,
    isMessagesLoading: false,
    isUsersLoading: false,
    onlineUsers: []
};

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        getUsers: (state, action) => {
            state.users = state.users;
        },
        getMessages: (state, action) => {
            state.messages = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(messagesApi.endpoints.getUsers.matchPending, (state, action) => {
            state.isUsersLoading = true;
        });
        builder.addMatcher(messagesApi.endpoints.getUsers.matchRejected, (state, action) => {
            state.isUsersLoading = false;
            toast.error("Error fetching users");
        });
        builder.addMatcher(messagesApi.endpoints.getMessages.matchFulfilled, (state, action) => {
            console.log('action.payload in getMessages extraReducer', action.payload);
            state.messages = action.payload;
            state.isMessagesLoading = false;
        });
        builder.addMatcher(messagesApi.endpoints.getMessages.matchPending, (state, action) => {
            state.isMessagesLoading = true;
        });
        builder.addMatcher(messagesApi.endpoints.getMessages.matchRejected, (state, action) => {
            state.isMessagesLoading = false;
            toast.error("Error fetching messages");
        });
        builder.addMatcher(messagesApi.endpoints.addMessage.matchFulfilled, (state, action) => {
            state.messages.push(action.payload);
            state.isSendingMessage = false;
        });
        builder.addMatcher(messagesApi.endpoints.addMessage.matchPending, (state, action) => {
            state.isSendingMessage = true;
        });
        builder.addMatcher(messagesApi.endpoints.addMessage.matchRejected, (state, action) => {
            state.isSendingMessage = false;
        });
    },
});

export const { setUsers, getMessages, setSelectedUser, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
