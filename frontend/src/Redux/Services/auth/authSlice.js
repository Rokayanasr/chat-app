import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

const initialState = {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthUser: (state, action) => {
            state.authUser = action.payload;
        },
        setIsSigningUp: (state, action) => {
            state.isSigningUp = action.payload;
        },
        setIsLoggingIn: (state, action) => {
            state.isLoggingIn = action.payload;
        },
        setIsCheckingAuth: (state, action) => {
            state.isCheckingAuth = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(authApi.endpoints.signup.matchPending, (state) => {
            state.isSigningUp = true;
        });
        builder.addMatcher(authApi.endpoints.signup.matchFulfilled, (state) => {
            state.isSigningUp = false;
        });
        builder.addMatcher(authApi.endpoints.signup.matchRejected, (state) => {
            state.isSigningUp = false;
        });
        builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
            state.isLoggingIn = true;
        });
        builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state) => {
            state.isLoggingIn = false;
        });
        builder.addMatcher(authApi.endpoints.login.matchRejected, (state) => {
            state.isLoggingIn = false;
        });
        builder.addMatcher(authApi.endpoints.checkAuth.matchPending, (state) => {
            state.isCheckingAuth = true;
        });
        builder.addMatcher(authApi.endpoints.checkAuth.matchFulfilled, (state, action) => {
            state.isCheckingAuth = false;
            state.authUser = action.payload;
        });
        builder.addMatcher(authApi.endpoints.checkAuth.matchRejected, (state) => {
            state.isCheckingAuth = false;
        });
    },
});

export const { setAuthUser, setIsSigningUp, setIsLoggingIn, setIsCheckingAuth } = authSlice.actions;

export default authSlice.reducer;
