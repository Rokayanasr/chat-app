import React, { useEffect, useState } from "react";
import { useSignupMutation } from "../Redux/Services/auth/authApi";
import { MessageSquare, User, Mail, Lock, Eye, EyeOff, Loader, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, redirect } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";
import { setIsSigningUp } from "../Redux/Services/auth/authSlice";
import { useNavigate } from "react-router-dom";

function SignupPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSigningUp } = useSelector((state) => state.auth); 
    const [signup, { isLoading }] = useSignupMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const validateForm = () => {
        if (!formData.fullName.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!formData.password.trim()) return toast.error("Password is required");
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) return toast.error("Invalid Email Format");
        if (!/^[A-Za-z\s]{2,}$/.test(formData.fullName)) return toast.error("Invalid Name Format");
        // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) return toast.error("Invalid password Format");
        if (formData.password.length < 8) return toast.error("Password must be at least 8 characters long");
        if (formData.fullName.length < 2) return toast.error("Full name must be at least 2 characters long");
        if (formData.email.length < 5) return toast.error("Email must be at least 5 characters long");
        
        return true;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validateForm();
        if(success === true) {
            // Format data according to backend expectations
            const formattedData = {
                fullname: formData.fullName,
                email: formData.email,
                password: formData.password
            };
            
            signup(formattedData)
                .unwrap()
                .then((res) => {
                    console.log("Signup successful:", res);
                    toast.success("Account created successfully!");
                    dispatch(setIsSigningUp(true));
                    formData.fullName = "";
                    formData.email = "";
                    formData.password = "";
                    navigate("/");
                })
                .catch((err) => {
                    console.error("Signup error:", err);
                    // More detailed error handling
                    if (err.data && err.data.message) {
                        toast.error(err.data.message);
                    } else if (err.error) {
                        toast.error(err.error);
                    } else {
                        toast.error("Failed to create account. Please try again.");
                    }
                });
        }
    };

    return (
        <div className='min-h-screen grid lg:grid-cols-2'>
            {/* left side */}
            <div className='flex flex-col items-center justify-center p-6 sm:p-12'>
                <div className='w-full max-w-md space-y-8'>
                    {/* logo */}
                    <div className='flex flex-col justify-center items-center gap-2 group'>
                        <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                            <MessageSquare className='size-6 text-primary' />
                        </div>
                        <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
                        <p className='text-base-content/60'>Get started with your free account</p>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* full name */}
                        <div className='space-y-2'>
                            <label htmlFor='fullName' className='block text-sm font-medium text-base-content'>
                                Full Name
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <User className='size-5 z-10 text-base-content/40' />
                                </div>
                                <input
                                    type='text'
                                    id='fullName'
                                    className='input input-bordered w-full pl-10'
                                    placeholder='John Doe'
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* email */}
                        <div className='space-y-2'>
                            <label htmlFor='email' className='block text-sm font-medium text-base-content'>
                                Email Address
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Mail className='size-5 z-10 text-base-content/40' />
                                </div>
                                <input
                                    type='email'
                                    id='email'
                                    className='input input-bordered w-full pl-10'
                                    placeholder='your@email.com'
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* password */}
                        <div className='space-y-2'>
                            <label htmlFor='password' className='block text-sm font-medium text-base-content'>
                                Password
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className='size-5 z-10 text-base-content/40' />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    className='input input-bordered w-full pl-10'
                                    placeholder='Create a password'
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button 
                                    type="button"
                                    className='flex items-center gap-2 absolute right-0 top-0 inset-y-0 cursor-pointer px-2'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className='size-5 z-10 transition-all text-base-content/40' />
                                    ) : (
                                        <Eye className='size-5 z-10 transition-all text-base-content/40' />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* create account button */}
                        <button type='submit' className='w-full cursor-pointer active:scale-95 bg-primary text-base-content py-2 px-4 rounded-md hover:bg-primary/90 transition-colors'>
                            {isLoading ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <Loader2 className='size-4 animate-spin' />
                                    loading ...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className='text-center'>
                        <p className='text-sm'>
                            Already have an account?{" "}
                            <Link to='/login' className='text-primary font-medium'>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* right side */}
            <AuthImagePattern title='Join our community' subtitle='connect with friends, share moments and stay in touch with your loved ones' />
        </div>
    );
}

export default SignupPage;
