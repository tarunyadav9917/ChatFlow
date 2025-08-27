export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  profilePicture?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Message {
  id: string;
  senderId: string;
  chatId: string;
  content: string;
  type: 'text' | 'image';
  timestamp: Date;
  status: 'sending' | 'delivered' | 'seen';
  deletedForMe?: boolean;
}

export interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string;
  participants: string[];
  lastMessage?: Message;
  isMuted: boolean;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export interface ChatState {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  activeChat: string | null;
  users: User[];
  blockedUsers: string[];
  sendMessage: (chatId: string, content: string, type: 'text' | 'image') => void;
  deleteMessage: (messageId: string, chatId: string) => void;
  createChat: (participantIds: string[], type: 'private' | 'group', name?: string) => string;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  muteChat: (chatId: string) => void;
  unmuteChat: (chatId: string) => void;
  markMessagesAsSeen: (chatId: string) => void;
}