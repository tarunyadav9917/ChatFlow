# 💬 ChatFlow

<div align="center">

![ChatFlow Banner](https://img.shields.io/badge/ChatFlow-Real--time%20Messaging-blue?style=for-the-badge&logo=react)

**A modern, feature-rich real-time chat application built with React, TypeScript, and Vite**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Project Structure](#-project-structure)

</div>

---

## 📖 Overview

ChatFlow is a sleek and modern real-time chat application that provides seamless messaging experience with a beautiful user interface. Built with cutting-edge technologies, it offers both mobile and desktop responsive layouts, making communication effortless across all devices.

## ✨ Features

### 🔐 Authentication
- **User Registration & Login** - Secure signup and login system
- **Profile Management** - Update profile information and avatar
- **User Sessions** - Persistent authentication using local storage

### 💬 Messaging
- **Real-time Messaging** - Instant message delivery
- **Private Chats** - One-on-one conversations
- **Group Chats** - Create and participate in group discussions
- **Message Status** - Track message delivery (sending, delivered, seen)
- **Message Deletion** - Delete messages from your view
- **Image Sharing** - Share images in conversations

### 👥 User Features
- **Online Status** - See who's currently online
- **Last Seen** - View when users were last active
- **User Profiles** - View detailed user information
- **Profile Pictures** - Personalized avatars
- **User Blocking** - Block/unblock unwanted users

### 🔔 Chat Management
- **Mute Notifications** - Mute/unmute specific chats
- **Chat List** - View all your conversations in one place
- **Search Users** - Find and start conversations with users
- **Unread Messages** - Visual indicators for unread messages

### 🎨 User Experience
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Dark Mode Ready** - Clean and modern UI
- **Smooth Animations** - Polished transitions and interactions
- **Intuitive Interface** - Easy-to-use chat interface

## 🛠 Tech Stack

### Frontend Framework
- **[React 18.3.1](https://reactjs.org/)** - Modern React with hooks and context API
- **[TypeScript 5.5.3](https://www.typescriptlang.org/)** - Type-safe JavaScript for better development experience
- **[Vite 5.4.2](https://vitejs.dev/)** - Next-generation frontend build tool for blazing fast HMR

### Styling
- **[Tailwind CSS 3.4.1](https://tailwindcss.com/)** - Utility-first CSS framework
- **[PostCSS 8.4.35](https://postcss.org/)** - CSS transformation
- **[Autoprefixer 10.4.18](https://autoprefixer.github.io/)** - Automatic vendor prefixing

### UI Components & Icons
- **[Lucide React 0.344.0](https://lucide.dev/)** - Beautiful & consistent icon library

### Development Tools
- **[ESLint 9.9.1](https://eslint.org/)** - Code linting and quality checks
- **[TypeScript ESLint 8.3.0](https://typescript-eslint.io/)** - TypeScript-specific linting rules

### State Management
- **React Context API** - Built-in state management for authentication and chat state
- **Local Storage** - Data persistence across sessions

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Git** - Version control system

### Step-by-step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tarunyadav9917/ChatFlow.git
   cd ChatFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or with yarn:
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   or with yarn:
   ```bash
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🚀 Usage

### Running the Application

#### Development Mode
Start the development server with hot module replacement:
```bash
npm run dev
```

#### Production Build
Build the application for production:
```bash
npm run build
```

#### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

#### Linting
Run ESLint to check code quality:
```bash
npm run lint
```

### Getting Started with the App

1. **Create an Account**
   - Click on "Sign Up" on the login screen
   - Fill in your username, email, name, and password
   - Click "Sign Up" to create your account

2. **Login**
   - Enter your email and password
   - Click "Login" to access the app

3. **Start Chatting**
   - Click "Start New Chat" to begin a conversation
   - Select a user from the available users list
   - Start sending messages!

4. **Explore Features**
   - Click on a chat to view the conversation
   - Use the options menu (three dots) to mute/unmute chats
   - Click on your profile picture to view/edit your profile
   - Block/unblock users from the chat options menu

## 📁 Project Structure

```
ChatFlow/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ChatList.tsx          # List of all chats
│   │   ├── ChatScreen.tsx        # Main chat interface
│   │   ├── ChatOptionsModal.tsx  # Chat settings modal
│   │   ├── Login.tsx             # Authentication component
│   │   ├── MessageBubble.tsx     # Individual message component
│   │   ├── NewChatModal.tsx      # Create new chat modal
│   │   └── Profile.tsx           # User profile component
│   ├── context/         # React context providers
│   │   ├── AuthContext.tsx       # Authentication state management
│   │   └── ChatContext.tsx       # Chat state management
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts              # All interfaces and types
│   ├── utils/           # Utility functions
│   │   └── storage.ts            # Local storage helpers
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # Vite type definitions
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── eslint.config.js     # ESLint configuration
└── README.md           # Project documentation
```

## 🏗️ Architecture

### Context-Based State Management

**AuthContext** - Manages authentication state:
- User login/logout
- User registration
- Current user information
- Profile updates

**ChatContext** - Manages chat functionality:
- Chat list management
- Message sending/receiving
- User blocking
- Chat muting
- Message status updates

### Component Hierarchy

```
App
├── AuthProvider
│   └── ChatProvider
│       ├── Login (when not authenticated)
│       └── Main Layout (when authenticated)
│           ├── ChatList
│           ├── ChatScreen
│           ├── Profile
│           ├── NewChatModal
│           └── ChatOptionsModal
```

## 🎨 Key Features Implementation

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Separate layouts for mobile and desktop
- Smooth transitions between screens

### Message System
- Real-time message updates
- Message status tracking (sending → delivered → seen)
- Auto-scroll to latest messages
- Image message support

### User Experience
- Optimistic UI updates
- Loading states
- Error handling
- Smooth animations

## 🔧 Configuration Files

- **vite.config.ts** - Vite bundler configuration
- **tsconfig.json** - TypeScript compiler options
- **tailwind.config.js** - Tailwind CSS customization
- **eslint.config.js** - Code linting rules

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

## 🐛 Known Issues & Future Enhancements

### Planned Features
- Real backend integration with WebSocket support
- End-to-end encryption
- Voice and video calling
- File sharing (documents, videos)
- Message reactions and replies
- Chat search functionality
- Dark mode toggle
- Push notifications

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Tarun Yadav**
- GitHub: [@tarunyadav9917](https://github.com/tarunyadav9917)

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Images from [Pexels](https://www.pexels.com/)
- Built with [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">

**Made with ❤️ by Tarun Yadav**

If you found this project helpful, please consider giving it a ⭐!

</div>
