import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  const [activeChat, setActiveChat] = useState<string | null>(null);
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

  const sendMessage = (chatId: string, content: string, type: 'text' | 'image') => {
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

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }));

    // Update last message in chat
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage: newMessage }
        : chat
    ));

    // Save to storage
    const updatedMessages = {
      ...messages,
      [chatId]: [...(messages[chatId] || []), newMessage]
    };
    saveToStorage('messages', updatedMessages);

    const updatedChats = chats.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage: newMessage }
        : chat
    );
    saveToStorage('chats', updatedChats);

    // Show notification to other participants
    const chat = chats.find(c => c.id === chatId);
    if (chat && !chat.isMuted) {
      showNotification('New message', content);
    }
  };

  const deleteMessage = (messageId: string, chatId: string) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => 
        msg.id === messageId 
          ? { ...msg, deletedForMe: true }
          : msg
      )
    }));

    const updatedMessages = {
      ...messages,
      [chatId]: messages[chatId].map(msg => 
        msg.id === messageId 
          ? { ...msg, deletedForMe: true }
          : msg
      )
    };
    saveToStorage('messages', updatedMessages);
  };

  const createChat = (participantIds: string[], type: 'private' | 'group', name?: string): string => {
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

    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    saveToStorage('chats', updatedChats);

    return chatId;
  };

  const blockUser = (userId: string) => {
    const updatedBlockedUsers = [...blockedUsers, userId];
    setBlockedUsers(updatedBlockedUsers);
    saveToStorage(`blockedUsers_${currentUser?.id}`, updatedBlockedUsers);
  };

  const unblockUser = (userId: string) => {
    const updatedBlockedUsers = blockedUsers.filter(id => id !== userId);
    setBlockedUsers(updatedBlockedUsers);
    saveToStorage(`blockedUsers_${currentUser?.id}`, updatedBlockedUsers);
  };

  const muteChat = (chatId: string) => {
    const updatedChats = chats.map(chat => 
      chat.id === chatId ? { ...chat, isMuted: true } : chat
    );
    setChats(updatedChats);
    saveToStorage('chats', updatedChats);
  };

  const unmuteChat = (chatId: string) => {
    const updatedChats = chats.map(chat => 
      chat.id === chatId ? { ...chat, isMuted: false } : chat
    );
    setChats(updatedChats);
    saveToStorage('chats', updatedChats);
  };

  const markMessagesAsSeen = (chatId: string) => {
    if (!currentUser) return;

    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId]?.map(msg => 
        msg.senderId !== currentUser.id && msg.status !== 'seen'
          ? { ...msg, status: 'seen' }
          : msg
      ) || []
    }));

    const updatedMessages = {
      ...messages,
      [chatId]: messages[chatId]?.map(msg => 
        msg.senderId !== currentUser.id && msg.status !== 'seen'
          ? { ...msg, status: 'seen' }
          : msg
      ) || []
    };
    saveToStorage('messages', updatedMessages);
  };

  const value: ChatState = {
    chats,
    messages,
    activeChat,
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