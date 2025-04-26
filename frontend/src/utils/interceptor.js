import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { redirect } from "react-router-dom";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_MODE === "development" ? import.meta.env.VITE_DEV_URL : import.meta.env.VITE_PROD_URL,
    credentials: "include", // This will include cookies in the request
    prepareHeaders: (headers) => {
        return headers;
    },
});

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    //if success
    if (result.data) {
        return result;
    }
    //if error
    if (result.error && result.error.status === 401) {
        console.error(result.error)
        redirect("/login")
    }
    return result;
};

export default baseQueryWithInterceptor;
