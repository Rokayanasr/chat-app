import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./Services/auth/authApi";
import authSlice from "./Services/auth/authSlice";
import themeSlice from "./Services/theme/useThemeSlice";
import { messagesApi } from "./Services/messages/messagesApi";
import messagesSlice from "./Services/messages/messagesSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        theme: themeSlice,
        messages: messagesSlice,

        [messagesApi.reducerPath]: messagesApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, messagesApi.middleware),
});
