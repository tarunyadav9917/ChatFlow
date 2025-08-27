import React, { useState } from 'react';
import { Check, CheckCheck, Trash2 } from 'lucide-react';
import { Message, User } from '../types';
import { useChat } from '../context/ChatContext';
import { formatTime } from '../utils/storage';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  senderInfo?: User;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwn, 
  showAvatar, 
  senderInfo 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { deleteMessage } = useChat();

  const handleDelete = () => {
    deleteMessage(message.id, message.chatId);
    setShowMenu(false);
  };

  if (message.deletedForMe) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg italic text-sm">
          Message deleted
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 group`}>
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className="w-8 h-8 flex-shrink-0">
          {!isOwn && showAvatar && senderInfo && (
            <img
              src={senderInfo.profilePicture}
              alt={senderInfo.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
        </div>

        {/* Message Content */}
        <div
          className="relative"
          onContextMenu={(e) => {
            e.preventDefault();
            if (isOwn) setShowMenu(true);
          }}
          onClick={() => setShowMenu(false)}
        >
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-blue-600 text-white rounded-br-md'
                : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
            } shadow-sm`}
          >
            {message.type === 'image' ? (
              <img
                src={message.content}
                alt="Shared image"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '300px' }}
              />
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            )}
          </div>

          {/* Message Info */}
          <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </span>
            {isOwn && (
              <div className="flex items-center">
                {message.status === 'delivered' && (
                  <Check className="w-3 h-3 text-gray-500" />
                )}
                {message.status === 'seen' && (
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                )}
              </div>
            )}
          </div>

          {/* Context Menu */}
          {showMenu && isOwn && (
            <div className="absolute top-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete for me</span>
              </button>
            </div>
          )}
        </div>

        {/* Delete button (visible on hover for desktop) */}
        {isOwn && (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-full transition-all"
          >
            <Trash2 className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;