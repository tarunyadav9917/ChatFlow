import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Login from './components/Login';
import ChatList from './components/ChatList';
import ChatScreen from './components/ChatScreen';
import Profile from './components/Profile';
import NewChatModal from './components/NewChatModal';
import { loadFromStorage, saveToStorage, generateRandomAvatar } from './utils/storage';

type Screen = 'chatList' | 'chat' | 'profile';

const AppContent: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('chatList');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Initialize demo data
  useEffect(() => {
    const existingUsers = loadFromStorage('users');
    if (!existingUsers || existingUsers.length === 0) {
      const demoUsers = [
        {
          id: 'demo-user-1',
          username: 'alice_smith',
          email: 'alice@example.com',
          name: 'Alice Smith',
          profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isOnline: true,
          lastSeen: new Date()
        },
        {
          id: 'demo-user-2',
          username: 'bob_wilson',
          email: 'bob@example.com',
          name: 'Bob Wilson',
          profilePicture: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isOnline: false,
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          id: 'demo-user-3',
          username: 'emma_davis',
          email: 'emma@example.com',
          name: 'Emma Davis',
          profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isOnline: true,
          lastSeen: new Date()
        },
        {
          id: 'demo-user-4',
          username: 'john_doe',
          email: 'john@example.com',
          name: 'John Doe',
          profilePicture: 'https://images.pexels.com/photos/769745/pexels-photo-769745.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isOnline: false,
          lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        }
      ];
      saveToStorage('users', demoUsers);
    }
  }, []);

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    setCurrentScreen('chat');
  };

  const handleBack = () => {
    setCurrentScreen('chatList');
    setActiveChatId(null);
  };

  const handleProfileClick = () => {
    setCurrentScreen('profile');
  };

  const handleNewChatClick = () => {
    setShowNewChatModal(true);
  };

  const handleChatCreated = (chatId: string) => {
    setActiveChatId(chatId);
    setCurrentScreen('chat');
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <ChatProvider>
      <div className="h-screen flex bg-gray-100">
        {/* Mobile Layout */}
        <div className="flex-1 lg:hidden">
          {currentScreen === 'chatList' && (
            <ChatList
              onChatSelect={handleChatSelect}
              onProfileClick={handleProfileClick}
              onNewChatClick={handleNewChatClick}
            />
          )}
          {currentScreen === 'chat' && activeChatId && (
            <ChatScreen chatId={activeChatId} onBack={handleBack} />
          )}
          {currentScreen === 'profile' && (
            <Profile onBack={handleBack} />
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-1">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 bg-white">
            {currentScreen === 'profile' ? (
              <Profile onBack={handleBack} />
            ) : (
              <ChatList
                onChatSelect={handleChatSelect}
                onProfileClick={handleProfileClick}
                onNewChatClick={handleNewChatClick}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeChatId && currentScreen !== 'profile' ? (
              <ChatScreen chatId={activeChatId} onBack={handleBack} />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to ChatFlow</h3>
                  <p className="text-gray-500 mb-6">Select a chat to start messaging</p>
                  <button
                    onClick={handleNewChatClick}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start New Chat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Chat Modal */}
        {showNewChatModal && (
          <NewChatModal
            onClose={() => setShowNewChatModal(false)}
            onChatCreated={handleChatCreated}
          />
        )}
      </div>
    </ChatProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;