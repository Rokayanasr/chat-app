import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, setUsers } from "../Redux/Services/messages/messagesSlice";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useGetUsersQuery } from "../Redux/Services/messages/messagesApi";
import { User, Users } from "lucide-react";

function Sidebar() {
    const { data, isLoading } = useGetUsersQuery();
    const dispatch = useDispatch();
    const { users, selectedUser, onlineUsers } = useSelector((state) => state.messages);

    useEffect(() => {
        dispatch(setUsers(data));
    }, [data, dispatch]);

    if (isLoading) return <SidebarSkeleton />;

    return (
        <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
            <div className='border-b border-base-300 w-full p-5'>
                <div className='flex items-center gap-2'>
                    <Users className='size-6' />
                    <span className='font-medium hidden lg:block'>Contacts</span>
                </div>
                {/* TODO: online filter toggle */}
            </div>
            <div className='overflow-y-auto w-full py-3'>
                {users?.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => {
                            dispatch(setSelectedUser(user));
                            // console.log(selectedUser);
                        }}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                            selectedUser?._id == user._id ? "bg-base-300 ring-1 ring-base-300" : ""
                        }`}>
                        <div className='relative mx-auto lg:mx-0'>
                            {user.profilePic !== "" ? (
                                <img
                                    src={user.profilePic}
                                    alt={user.fullname}
                                    className='size-12 object-cover rounded-full'
                                />
                            ) : (
                                <div className='size-13 flex items-center justify-center bg-base-200 rounded-full'>
                                    <User className=' text-base' />
                                </div>
                            )}
                            {onlineUsers.includes(user._id) && (
                                <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900' />
                            )}
                        </div>

                        {/* User info - only visible on larger screens */}
                        <div className='hidden lg:block text-left min-w-0'>
                            <div className='font-medium truncate'>{user.fullname}</div>
                            <div className='text-sm text-zinc-400'>
                                {onlineUsers?.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    );
}

export default Sidebar;
