# Demo Data Setup Guide

This guide explains the demo data structure in ChatFlow and how to customize it for your own project.

## 📍 Demo Data Location

Demo data is initialized in `/src/App.tsx` in the `useEffect` hook (lines 20-63).

## 🎭 Current Demo Users

```typescript
const demoUsers = [
  {
    id: 'demo-user-1',
    username: 'alice_smith',
    email: 'alice@example.com',
    name: 'Alice Smith',
    profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    isOnline: true,
    lastSeen: new Date()
  },
  {
    id: 'demo-user-2',
    username: 'bob_wilson',
    email: 'bob@example.com',
    name: 'Bob Wilson',
    profilePicture: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg',
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  // ... more users
];
```

## 🔄 Customizing Demo Data

### Option 1: Modify Existing Demo Data

Edit `/src/App.tsx`:

```typescript
const demoUsers = [
  {
    id: 'user-1',
    username: 'your_username',
    email: 'your@email.com',
    name: 'Your Name',
    profilePicture: 'https://your-image-url.com/photo.jpg',
    isOnline: true,
    lastSeen: new Date()
  }
];
```

### Option 2: Remove Demo Data

If you're connecting to Firebase or another backend, remove the demo data initialization:

**In `/src/App.tsx`:**

```typescript
// REMOVE THIS ENTIRE useEffect:
useEffect(() => {
  const existingUsers = loadFromStorage('users');
  if (!existingUsers || existingUsers.length === 0) {
    const demoUsers = [ ... ];
    saveToStorage('users', demoUsers);
  }
}, []);
```

### Option 3: Load Data from API

Replace demo data with API calls:

```typescript
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await fetch('https://your-api.com/users');
      const users = await response.json();
      saveToStorage('users', users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  fetchUsers();
}, []);
```

## 📦 Data Structure

### User Object

```typescript
interface User {
  id: string;              // Unique identifier
  username: string;        // Username
  email: string;           // Email address
  name: string;            // Display name
  profilePicture: string;  // Profile picture URL
  isOnline: boolean;       // Online status
  lastSeen: Date;          // Last seen timestamp
}
```

### Message Object

```typescript
interface Message {
  id: string;              // Unique identifier
  chatId: string;          // Chat room ID
  senderId: string;        // User ID who sent
  text: string;            // Message content
  timestamp: Date;         // When sent
  isRead: boolean;         // Read status
  reactions?: {            // Optional reactions
    [emoji: string]: string[];  // emoji -> userIds[]
  };
}
```

### Chat Object

```typescript
interface Chat {
  id: string;              // Unique identifier
  name: string;            // Chat name
  type: 'direct' | 'group'; // Chat type
  participants: string[];   // User IDs
  lastMessage?: Message;    // Last message
  createdAt: Date;         // Creation date
  updatedAt: Date;         // Last update
}
```

## 🎨 Profile Pictures

Demo data uses free Pexels images. Options:

### Free Image Sources
- [Unsplash](https://unsplash.com/) - Free high-quality photos
- [Pexels](https://www.pexels.com/) - Free stock photos
- [UI Avatars](https://ui-avatars.com/) - Generate avatar from name
- [DiceBear](https://dicebear.com/) - Avatar generation API
- [Gravatar](https://gravatar.com/) - User avatars by email

### Generate Placeholder Avatars

```typescript
// Using UI Avatars
const getAvatar = (name: string) => 
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

// Using DiceBear
const getAvatar = (id: string) => 
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;
```

## 🔥 Firebase Integration

When using Firebase, replace local storage with Firestore:

### Setup Firestore

```typescript
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase/config';

// Add user to Firestore
const addUser = async (user: User) => {
  await addDoc(collection(db, 'users'), user);
};

// Get all users
const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Real-time Updates

```typescript
import { onSnapshot } from 'firebase/firestore';

useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'users'),
    (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(users);
    }
  );
  
  return () => unsubscribe();
}, []);
```

## 🧪 Testing Data

For testing, you can use JSON files:

### Create `src/data/test-users.json`

```json
[
  {
    "id": "test-1",
    "username": "testuser1",
    "email": "test1@example.com",
    "name": "Test User 1",
    "profilePicture": "https://ui-avatars.com/api/?name=Test+User+1",
    "isOnline": true
  }
]
```

### Import in your component

```typescript
import testUsers from './data/test-users.json';

useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    saveToStorage('users', testUsers);
  }
}, []);
```

## 🎯 Best Practices

1. **Don't commit real user data** - Use fake data for demos
2. **Use environment variables** - For API endpoints and keys
3. **Implement pagination** - Don't load all users at once in production
4. **Cache data** - Use local storage/IndexedDB for offline support
5. **Validate data** - Always validate user input
6. **Sanitize content** - Prevent XSS attacks in messages

## 🔄 Migration Path

To migrate from demo data to production:

1. **Setup Firebase/Backend** - Configure your data source
2. **Create API service** - Centralize data fetching
3. **Update components** - Use API instead of local storage
4. **Remove demo data** - Delete initialization code
5. **Test thoroughly** - Ensure all features work with real data

## 📚 Additional Resources

- [Firebase Firestore Guide](https://firebase.google.com/docs/firestore)
- [React Data Fetching](https://react.dev/reference/react/hooks#data-fetching)
- [Local Storage Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

For more information, see [STARTER-TEMPLATE-GUIDE.md](STARTER-TEMPLATE-GUIDE.md)
