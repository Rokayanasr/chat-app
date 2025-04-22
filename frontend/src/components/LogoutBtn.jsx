import React from "react";
import { useLogoutMutation } from "../Redux/Services/auth/authApi";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../Redux/Services/auth/authSlice";
import toast from "react-hot-toast";
import { messagesApi } from "../Redux/Services/messages/messagesApi";
import { authApi } from "../Redux/Services/auth/authApi";
import { setSelectedUser } from "../Redux/Services/messages/messagesSlice";
import { disconnectSocket } from "../libs/socket";

function LogoutBtn() {
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        logout({})
            .unwrap()
            .then(() => {
                navigate("/login");

                dispatch(setAuthUser(null));
                dispatch(setSelectedUser(null));
                
                // Disconnect socket
                disconnectSocket();
                
                dispatch(messagesApi.util.resetApiState());
                dispatch(authApi.util.resetApiState());

                toast.success("Logged out successfully");
            })
            .catch(() => {
                toast.error("Failed to logout");
            });
    };
    return (
        <button
            className='md:text-base text-sm h-10 text-base-content px-4 py-2 rounded-md flex items-center gap-2 hover:text-base-content/90 transition-all active:scale-95 duration-300 hover:bg-base-200 cursor-pointer'
            onClick={handleLogout}>
            <LogOut className='md:size-5 size-4' />
            <span className='md:block hidden'>Logout</span>
        </button>
    );
}

export default LogoutBtn;
