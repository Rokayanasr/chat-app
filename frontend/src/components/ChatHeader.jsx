import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedUser } from '../Redux/Services/messages/messagesSlice';
import { X, User } from 'lucide-react';

function ChatHeader() {
    const {selectedUser, onlineUsers} = useSelector(state => state.messages);
    const dispatch = useDispatch();

    return (
        <div className="p-2.5 border-b border-base-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="avatar">
                <div className="size-10 rounded-full relative">
                    {selectedUser.profilePic ? (
                        <img src={selectedUser.profilePic} alt={selectedUser.fullname} />
                    ) : (
                        <div className="size-10 bg-base-300 rounded-full flex items-center justify-center">
                            <User className="size-5" />
                        </div>
                    )}
                </div>
              </div>
    
              {/* User info */}
              <div>
                <h3 className="font-medium capitalize">{selectedUser.fullname}</h3>
                <p className="text-sm text-base-content/70">
                  {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                </p>
              </div>
            </div>
    
            {/* Close button */}
            <button onClick={() => dispatch(setSelectedUser(null))}>
              <X />
            </button>
          </div>
        </div>
      );
}

export default ChatHeader