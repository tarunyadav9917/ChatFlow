import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ChatState, Chat, Message, User } from '../types';
import { useAuth } from './AuthContext';
import { loadFromStorage, saveToStorage, showNotification } from '../utils/storage';

const ChatContext = createContext<ChatState | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  useEffect(() => {
    const savedChats = loadFromStorage('chats') || [];
    const savedMessages = loadFromStorage('messages') || {};
    const savedUsers = loadFromStorage('users') || [];
    const savedBlockedUsers = loadFromStorage(`blockedUsers_${currentUser?.id}`) || [];

    setChats(savedChats);
    setMessages(savedMessages);
    setUsers(savedUsers);
    setBlockedUsers(savedBlockedUsers);
  }, [currentUser]);

  const sendMessage = useCallback((chatId: string, content: string, type: 'text' | 'image') => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      chatId,
      content,
      type,
      timestamp: new Date(),
      status: 'delivered'
    };

    // Batch state updates
    setMessages(prev => {
      const updatedMessages = {
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage]
      };
      // Save to storage after state update
      saveToStorage('messages', updatedMessages);
      return updatedMessages;
    });

    setChats(prev => {
      const chat = prev.find(c => c.id === chatId);
      const updatedChats = prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: newMessage }
          : chat
      );
      // Save to storage after state update
      saveToStorage('chats', updatedChats);
      
      // Show notification to other participants
      if (chat && !chat.isMuted) {
        showNotification('New message', content);
      }
      
      return updatedChats;
    });
  }, [currentUser]);

  const deleteMessage = useCallback((messageId: string, chatId: string) => {
    setMessages(prev => {
      const updatedMessages = {
        ...prev,
        [chatId]: prev[chatId].map(msg => 
          msg.id === messageId 
            ? { ...msg, deletedForMe: true }
            : msg
        )
      };
      saveToStorage('messages', updatedMessages);
      return updatedMessages;
    });
  }, []);

  const createChat = useCallback((participantIds: string[], type: 'private' | 'group', name?: string): string => {
    if (!currentUser) return '';

    const chatId = Math.random().toString(36).substr(2, 9);
    const allParticipants = [...participantIds, currentUser.id];

    const newChat: Chat = {
      id: chatId,
      type,
      name,
      participants: allParticipants,
      isMuted: false,
      createdAt: new Date()
    };

    setChats(prev => {
      const updatedChats = [...prev, newChat];
      saveToStorage('chats', updatedChats);
      return updatedChats;
    });

    return chatId;
  }, [currentUser]);

  const blockUser = useCallback((userId: string) => {
    setBlockedUsers(prev => {
      const updatedBlockedUsers = [...prev, userId];
      saveToStorage(`blockedUsers_${currentUser?.id}`, updatedBlockedUsers);
      return updatedBlockedUsers;
    });
  }, [currentUser?.id]);

  const unblockUser = useCallback((userId: string) => {
    setBlockedUsers(prev => {
      const updatedBlockedUsers = prev.filter(id => id !== userId);
      saveToStorage(`blockedUsers_${currentUser?.id}`, updatedBlockedUsers);
      return updatedBlockedUsers;
    });
  }, [currentUser?.id]);

  const muteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const updatedChats = prev.map(chat => 
        chat.id === chatId ? { ...chat, isMuted: true } : chat
      );
      saveToStorage('chats', updatedChats);
      return updatedChats;
    });
  }, []);

  const unmuteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const updatedChats = prev.map(chat => 
        chat.id === chatId ? { ...chat, isMuted: false } : chat
      );
      saveToStorage('chats', updatedChats);
      return updatedChats;
    });
  }, []);

  const markMessagesAsSeen = useCallback((chatId: string) => {
    if (!currentUser) return;

    setMessages(prev => {
      // Check if there are any messages to update before creating new state
      const chatMsgs = prev[chatId];
      if (!chatMsgs) return prev;
      
      const hasUnseenMessages = chatMsgs.some(msg => 
        msg.senderId !== currentUser.id && msg.status !== 'seen'
      );
      
      if (!hasUnseenMessages) return prev;
      
      const updatedMessages = {
        ...prev,
        [chatId]: chatMsgs.map(msg => 
          msg.senderId !== currentUser.id && msg.status !== 'seen'
            ? { ...msg, status: 'seen' }
            : msg
        )
      };
      saveToStorage('messages', updatedMessages);
      return updatedMessages;
    });
  }, [currentUser]);

  const value: ChatState = {
    chats,
    messages,
    users,
    blockedUsers,
    sendMessage,
    deleteMessage,
    createChat,
    blockUser,
    unblockUser,
    muteChat,
    unmuteChat,
    markMessagesAsSeen,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};