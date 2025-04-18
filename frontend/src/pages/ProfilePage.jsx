import { Camera, Mail, User } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useUpdateProfileMutation } from "../Redux/Services/auth/authApi";
import { toast } from "react-hot-toast";

function ProfilePage() {
    const { authUser } = useSelector((state) => state.auth);
    const [selectedImg, setSelectedImg] = useState(null);
    const [updateProfile, { isLoading, isFetching }] = useUpdateProfileMutation();
    console.log(authUser);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size before processing (1MB = 1024 * 1024 bytes)
        if (file.size > 1024 * 1024) {
            toast.error("Image size should be less than 1MB");
            return;
        }

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Img = reader.result;
            setSelectedImg(base64Img);

            try {
                await updateProfile({ profilePic: base64Img }).unwrap();
                toast.success("Profile updated successfully");
            } catch (error) {
                // Handle different types of errors
                if (error.status === 413) {
                    toast.error("Image is too large. Please choose a smaller file.");
                } else if (error.data && error.data.message) {
                    toast.error(error.data.message);
                } else {
                    toast.error("Failed to update profile. Please try again.");
                }
                console.error("Profile update error:", error);
            }
        };
    };

    return (
        <div className='h-screen pt-20'>
            <div className='max-w-2xl mx-auto p-4 py-8'>
                <div className='bg-base-300 rounded-xl p-6 space-y-8'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-semibold '>Profile</h1>
                        <p className='mt-2'>Your profile information</p>
                    </div>

                    {/* avatar upload section */}

                    <div className='flex flex-col items-center gap-4'>
                        <div className='relative'>
                            {isLoading || isFetching ? (
                                <div className='size-32 rounded-full object-cover border-4 bg-base-200 flex items-center justify-center'>
                                    <span className='loading loading-spinner loading-lg text-primary'></span>
                                </div>
                            ) : selectedImg || authUser.profilePic ? (
                                <img src={selectedImg || authUser.profilePic} alt='Profile' className='size-32 rounded-full object-cover border-4 ' />
                            ) : (
                                <div className='size-32 rounded-full object-cover border-4 bg-base-200 flex items-center justify-center'>
                                    <User className='w-16 h-16 text-base-content' />
                                </div>
                            )}
                            <label
                                htmlFor='avatar-upload'
                                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isLoading || isFetching ? "animate-pulse pointer-events-none" : ""}
                `}
                            >
                                <Camera className='w-5 h-5 text-base-200' />
                                <input type='file' id='avatar-upload' className='hidden' accept='image/*' onChange={handleImageUpload} disabled={isLoading || isFetching} />
                            </label>
                        </div>
                        <p className='text-sm text-base-content/70'>{isLoading || isFetching ? "Uploading..." : "Click the camera icon to update your photo"}</p>
                    </div>

                    <div className='space-y-6'>
                        <div className='space-y-1.5'>
                            <div className='text-sm text-base-content/70 flex items-center gap-2'>
                                <User className='w-4 h-4' />
                                Full Name
                            </div>
                            <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.fullname}</p>
                        </div>

                        <div className='space-y-1.5'>
                            <div className='text-sm text-base-content/70 flex items-center gap-2'>
                                <Mail className='w-4 h-4' />
                                Email Address
                            </div>
                            <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.email}</p>
                        </div>
                    </div>

                    <div className='mt-6 bg-base-300 rounded-xl p-6'>
                        <h2 className='text-lg font-medium  mb-4'>Account Information</h2>
                        <div className='space-y-3 text-sm'>
                            <div className='flex items-center justify-between py-2 border-b border-base-content/20'>
                                <span>Member Since</span>
                                <span>{authUser.createdAt?.split("T")[0]}</span>
                            </div>
                            <div className='flex items-center justify-between py-2'>
                                <span>Account Status</span>
                                <span className='text-green-500'>Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
