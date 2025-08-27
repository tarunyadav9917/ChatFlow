import React from 'react';
import { X, VolumeX, Volume2, UserX, UserCheck, Info } from 'lucide-react';
import { Chat, User } from '../types';
import { useChat } from '../context/ChatContext';

interface ChatOptionsModalProps {
  chat: Chat;
  onClose: () => void;
  otherUser?: User;
}

const ChatOptionsModal: React.FC<ChatOptionsModalProps> = ({ chat, onClose, otherUser }) => {
  const { muteChat, unmuteChat, blockUser, unblockUser, blockedUsers } = useChat();

  const isBlocked = otherUser && blockedUsers.includes(otherUser.id);

  const handleMuteToggle = () => {
    if (chat.isMuted) {
      unmuteChat(chat.id);
    } else {
      muteChat(chat.id);
    }
    onClose();
  };

  const handleBlockToggle = () => {
    if (!otherUser) return;
    
    if (isBlocked) {
      unblockUser(otherUser.id);
    } else {
      blockUser(otherUser.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full mx-4 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Chat Options</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-2">
          {/* Chat Info */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={otherUser?.profilePicture || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                alt="Chat"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {chat.type === 'group' ? chat.name : otherUser?.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {chat.type === 'group' ? `${chat.participants.length} members` : 'Private chat'}
                </p>
              </div>
            </div>
          </div>

          {/* Mute/Unmute */}
          <button
            onClick={handleMuteToggle}
            className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {chat.isMuted ? (
              <Volume2 className="w-5 h-5 text-green-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-orange-600" />
            )}
            <span className="text-gray-900">
              {chat.isMuted ? 'Unmute Chat' : 'Mute Chat'}
            </span>
          </button>

          {/* Block/Unblock (only for private chats) */}
          {chat.type === 'private' && otherUser && (
            <button
              onClick={handleBlockToggle}
              className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isBlocked ? (
                <UserCheck className="w-5 h-5 text-green-600" />
              ) : (
                <UserX className="w-5 h-5 text-red-600" />
              )}
              <span className="text-gray-900">
                {isBlocked ? `Unblock ${otherUser.name}` : `Block ${otherUser.name}`}
              </span>
            </button>
          )}

          {/* Chat Info */}
          <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="text-gray-900">Chat Info</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatOptionsModal;