import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedAuth = loadFromStorage('auth');
    const savedUser = loadFromStorage('currentUser');
    
    if (savedAuth && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(savedUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = loadFromStorage('users') || [];
    const user = users.find((u: User) => u.email === email);
    
    if (user && password === 'password') {
      const updatedUser = { ...user, isOnline: true, lastSeen: new Date() };
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      saveToStorage('auth', true);
      saveToStorage('currentUser', updatedUser);
      
      const updatedUsers = users.map((u: User) => u.id === user.id ? updatedUser : u);
      saveToStorage('users', updatedUsers);
      
      return true;
    }
    return false;
  };

  const signup = async (username: string, email: string, password: string, name: string): Promise<boolean> => {
    const users = loadFromStorage('users') || [];
    const existingUser = users.find((u: User) => u.email === email || u.username === username);
    
    if (existingUser) {
      return false;
    }
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      name,
      isOnline: true,
      lastSeen: new Date(),
      profilePicture: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`
    };
    
    users.push(newUser);
    saveToStorage('users', users);
    
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    saveToStorage('auth', true);
    saveToStorage('currentUser', newUser);
    
    return true;
  };

  const logout = () => {
    if (currentUser) {
      const users = loadFromStorage('users') || [];
      const updatedUser = { ...currentUser, isOnline: false, lastSeen: new Date() };
      const updatedUsers = users.map((u: User) => u.id === currentUser.id ? updatedUser : u);
      saveToStorage('users', updatedUsers);
    }
    
    setIsAuthenticated(false);
    setCurrentUser(null);
    saveToStorage('auth', false);
    saveToStorage('currentUser', null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    saveToStorage('currentUser', updatedUser);
    
    const users = loadFromStorage('users') || [];
    const updatedUsers = users.map((u: User) => u.id === currentUser.id ? updatedUser : u);
    saveToStorage('users', updatedUsers);
  };

  const value: AuthState = {
    isAuthenticated,
    currentUser,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};