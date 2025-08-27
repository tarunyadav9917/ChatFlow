export const loadFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return null;
  }
};

export const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const showNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body });
      }
    });
  }
};

export const formatTime = (date: Date): string => {
  const now = new Date();
  const messageDate = new Date(date);
  
  if (now.toDateString() === messageDate.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (now.getTime() - messageDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return messageDate.toLocaleDateString([], { weekday: 'short' });
  } else {
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

export const generateRandomAvatar = (): string => {
  const avatars = [
    'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/769745/pexels-photo-769745.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  ];
  return avatars[Math.floor(Math.random() * avatars.length)];
};