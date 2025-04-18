import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {  setSelectedUser, getUsers } from '../Redux/Services/messages/messagesSlice';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { useGetUsersQuery } from '../Redux/Services/messages/messagesApi';

function Sidebar() {
  const [data, isLoading] = useGetUsersQuery();
  
  const dispatch = useDispatch();
  const {users, selectedUser, isUsersLoading} = useSelector((state) => state.messages);
  
  const onlineUsers = [];

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch, getUsers]);
  console.log('users', users);

  if(isUsersLoading) return <SidebarSkeleton />;

  return (
    <div>Sidebar</div>
  )
}

export default Sidebar