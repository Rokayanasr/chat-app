import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import Navbar from "./components/Navbar";
import { useCheckAuthQuery } from "./Redux/Services/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "./Redux/Services/auth/authSlice";
import {Toaster} from "react-hot-toast"
import { useEffect } from "react";
import SocketManager from "./components/SocketManager";

function App() {
    const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);
    const { data, isLoading, isError } = useCheckAuthQuery();

    useEffect(() => {
        if (data) {
            dispatch(setAuthUser(data));
        }
    }, [data, dispatch]);

    if (isCheckingAuth && !authUser)
        return (
            <div className='flex items-center justify-center h-screen'>
                <span className='loading loading-ring w-24'></span>
            </div>
        );
    return (
        <div data-theme={theme}>
            <Navbar />
            
            {/* Socket manager to handle socket connection */}
            {authUser && <SocketManager />}

            <Routes>
                <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
                <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to='/' />} />
                <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
                <Route path='/settings' element={<SettingsPage />} />
                <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
            </Routes>

            <Toaster />
        </div>
    );
}

export default App;
