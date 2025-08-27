import React, { useState, useEffect } from 'react';
import { Search, Plus, Settings, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Chat, User } from '../types';
import { formatTime } from '../utils/storage';

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
  onProfileClick: () => void;
  onNewChatClick: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect, onProfileClick, onNewChatClick }) => {
  const { currentUser } = useAuth();
  const { chats, messages, users } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);

  useEffect(() => {
    const userChats = chats.filter(chat => 
      chat.participants.includes(currentUser?.id || '')
    );

    const filtered = userChats.filter(chat => {
      if (!searchTerm) return true;
      
      if (chat.type === 'group' && chat.name) {
        return chat.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      // For private chats, search by other participant's name
      const otherParticipantId = chat.participants.find(id => id !== currentUser?.id);
      const otherUser = users.find(user => user.id === otherParticipantId);
      
      return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             otherUser?.username.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Sort by last message timestamp
    filtered.sort((a, b) => {
      const aTime = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const bTime = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return bTime - aTime;
    });

    setFilteredChats(filtered);
  }, [chats, searchTerm, currentUser, users]);

  const getChatDisplayInfo = (chat: Chat) => {
    if (chat.type === 'group') {
      return {
        name: chat.name || 'Group Chat',
        profilePicture: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isOnline: false
      };
    }

    const otherParticipantId = chat.participants.find(id => id !== currentUser?.id);
    const otherUser = users.find(user => user.id === otherParticipantId);
    
    return {
      name: otherUser?.name || 'Unknown User',
      profilePicture: otherUser?.profilePicture || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isOnline: otherUser?.isOnline || false
    };
  };

  const getUnreadCount = (chatId: string): number => {
    const chatMessages = messages[chatId] || [];
    return chatMessages.filter(msg => 
      msg.senderId !== currentUser?.id && msg.status !== 'seen'
    ).length;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={onProfileClick}
            className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500 hover:ring-4 transition-all"
          >
            <img
              src={currentUser?.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ChatFlow</h1>
          </div>
        </div>
        <button
          onClick={onNewChatClick}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No chats yet</h3>
            <p className="text-gray-500 mb-4">Start a new conversation to get chatting</p>
            <button
              onClick={onNewChatClick}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start New Chat
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat) => {
              const displayInfo = getChatDisplayInfo(chat);
              const unreadCount = getUnreadCount(chat.id);
              const lastMessageText = chat.lastMessage?.type === 'image' 
                ? '📷 Image' 
                : chat.lastMessage?.content || 'No messages yet';

              return (
                <div
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100"
                >
                  <div className="relative">
                    <img
                      src={displayInfo.profilePicture}
                      alt={displayInfo.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {displayInfo.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {displayInfo.name}
                      </h3>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessageText}
                      </p>
                      {unreadCount > 0 && (
                        <div className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;