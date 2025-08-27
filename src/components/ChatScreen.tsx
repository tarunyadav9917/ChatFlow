import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Image, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { User, Message } from '../types';
import { formatTime } from '../utils/storage';
import MessageBubble from './MessageBubble';
import ChatOptionsModal from './ChatOptionsModal';

interface ChatScreenProps {
  chatId: string;
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ chatId, onBack }) => {
  const { currentUser } = useAuth();
  const { chats, messages, users, sendMessage, markMessagesAsSeen } = useChat();
  const [messageText, setMessageText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chat = chats.find(c => c.id === chatId);
  const chatMessages = messages[chatId] || [];

  useEffect(() => {
    // Mark messages as seen when chat opens
    markMessagesAsSeen(chatId);
  }, [chatId, markMessagesAsSeen]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const getChatDisplayInfo = () => {
    if (!chat) return null;

    if (chat.type === 'group') {
      return {
        name: chat.name || 'Group Chat',
        profilePicture: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isOnline: false,
        lastSeen: null
      };
    }

    const otherParticipantId = chat.participants.find(id => id !== currentUser?.id);
    const otherUser = users.find(user => user.id === otherParticipantId);
    
    return {
      name: otherUser?.name || 'Unknown User',
      profilePicture: otherUser?.profilePicture || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isOnline: otherUser?.isOnline || false,
      lastSeen: otherUser?.lastSeen || null
    };
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(chatId, messageText.trim(), 'text');
      setMessageText('');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        sendMessage(chatId, imageDataUrl, 'image');
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const displayInfo = getChatDisplayInfo();

  if (!chat || !displayInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Chat not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <img
              src={displayInfo.profilePicture}
              alt={displayInfo.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {displayInfo.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div>
            <h2 className="font-semibold text-gray-900">{displayInfo.name}</h2>
            <p className="text-xs text-gray-500">
              {displayInfo.isOnline ? 'Online' : 
                displayInfo.lastSeen ? `Last seen ${formatTime(displayInfo.lastSeen)}` : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setShowOptions(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start the conversation</h3>
              <p className="text-gray-500">Send a message to begin chatting with {displayInfo.name}</p>
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((message, index) => {
              const showAvatar = index === chatMessages.length - 1 || 
                chatMessages[index + 1]?.senderId !== message.senderId;
              
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === currentUser?.id}
                  showAvatar={showAvatar}
                  senderInfo={users.find(u => u.id === message.senderId)}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Image className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Chat Options Modal */}
      {showOptions && (
        <ChatOptionsModal
          chat={chat}
          onClose={() => setShowOptions(false)}
          otherUser={chat.type === 'private' ? 
            users.find(u => u.id === chat.participants.find(id => id !== currentUser?.id)) : 
            undefined
          }
        />
      )}
    </div>
  );
};

export default ChatScreen;