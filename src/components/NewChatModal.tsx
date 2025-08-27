import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { User } from '../types';

interface NewChatModalProps {
  onClose: () => void;
  onChatCreated: (chatId: string) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ onClose, onChatCreated }) => {
  const { currentUser } = useAuth();
  const { users, createChat, blockedUsers } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [chatType, setChatType] = useState<'private' | 'group'>('private');
  const [groupName, setGroupName] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const availableUsers = users.filter(user => 
      user.id !== currentUser?.id && 
      !blockedUsers.includes(user.id) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(availableUsers);
  }, [users, currentUser, blockedUsers, searchTerm]);

  const handleUserSelect = (userId: string) => {
    if (chatType === 'private') {
      setSelectedUsers([userId]);
    } else {
      setSelectedUsers(prev => 
        prev.includes(userId) 
          ? prev.filter(id => id !== userId)
          : [...prev, userId]
      );
    }
  };

  const handleCreateChat = () => {
    if (selectedUsers.length === 0) return;
    
    if (chatType === 'group' && !groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    const chatId = createChat(
      selectedUsers, 
      chatType, 
      chatType === 'group' ? groupName.trim() : undefined
    );
    
    onChatCreated(chatId);
    onClose();
  };

  const canCreateChat = selectedUsers.length > 0 && 
    (chatType === 'private' || (chatType === 'group' && groupName.trim()));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">New Chat</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Type Selection */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={() => setChatType('private')}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                chatType === 'private'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <UserPlus className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Private Chat</span>
            </button>
            <button
              onClick={() => setChatType('group')}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                chatType === 'group'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Group Chat</span>
            </button>
          </div>
        </div>

        {/* Group Name Input (only for group chats) */}
        {chatType === 'group' && (
          <div className="p-4 border-b border-gray-100">
            <input
              type="text"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* User List */}
        <div className="max-h-80 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user.id)}
                    className={`flex items-center space-x-3 p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border-r-4 border-blue-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleCreateChat}
            disabled={!canCreateChat}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Chat
            {selectedUsers.length > 0 && (
              <span className="ml-2">({selectedUsers.length} selected)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;