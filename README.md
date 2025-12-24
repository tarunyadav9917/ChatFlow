<div align="center">

# 💬 ChatFlow

![ChatFlow Banner](https://img.shields.io/badge/ChatFlow-Real--time%20Messaging-blue?style=for-the-badge&logo=react)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**A modern, feature-rich real-time chat application built with React and Firebase**

[🎯 Features](#-features) • [🎥 Demo](#-demo) • [🛠️ Tech Stack](#️-tech-stack) • [🚀 Getting Started](#-getting-started) • [☁️ Deployment](#️-deployment) • [📁 Structure](#-project-structure) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Features

<table>
<tr>
<td width="50%">

### 💬 Messaging
- ✅ **Real-time Messaging** - Instant delivery
- ✅ **Group Chats** - Multi-user conversations
- ✅ **Message Reactions** - Emoji support
- ✅ **Typing Indicators** - Live typing status
- ✅ **Read Receipts** - Message tracking
- ✅ **Message Editing** - Edit sent messages
- ✅ **Message Deletion** - Remove messages

</td>
<td width="50%">

### 👤 User Features
- ✅ **User Authentication** - Secure login/signup
- ✅ **Profile Management** - Custom avatars & status
- ✅ **Online Status** - Real-time presence
- ✅ **File Sharing** - Images & documents
- ✅ **Dark Mode** - Theme switching
- ✅ **Responsive Design** - Mobile-friendly
- ✅ **Notifications** - Stay updated

</td>
</tr>
</table>

---

## 🎥 Demo

<div align="center">

![ChatFlow Demo](demo.gif)

**[🌐 Live Demo](https://your-demo-link.com)** | **[📹 Video Walkthrough](https://your-video-link.com)**

</div>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend & Services
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Firebase Database](https://img.shields.io/badge/Realtime_DB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Firebase Storage](https://img.shields.io/badge/Cloud_Storage-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

### Development Tools
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

</div>

---

## 🚀 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- ![Node.js](https://img.shields.io/badge/Node.js-v14+-339933?style=flat&logo=node.js&logoColor=white) **Node.js** (v14 or higher)
- ![npm](https://img.shields.io/badge/npm-latest-CB3837?style=flat&logo=npm&logoColor=white) **npm** or **yarn**
- 🔥 **Firebase Account** - [Create one here](https://console.firebase.google.com/)

---

### ⚡ Quick Start

#### 1️⃣ **Clone the repository**

```bash
git clone https://github.com/tarunyadav9917/ChatFlow.git
cd ChatFlow
```

#### 2️⃣ **Install dependencies**

```bash
npm install
# or
yarn install
```

#### 3️⃣ **Set up Firebase**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - 🔐 **Authentication** (Email/Password)
   - 💾 **Realtime Database**
   - 📦 **Cloud Storage**
   - 🌐 **Hosting** (optional)
4. Copy your Firebase configuration

#### 4️⃣ **Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> 💡 **Tip:** Copy `.env.example` to `.env` and fill in your values

#### 5️⃣ **Start the development server**

```bash
npm run dev
# or
yarn dev
```

🎉 **Success!** Visit [`http://localhost:5173`](http://localhost:5173) to see your app!

---

## ☁️ Deployment

### Deploy to AWS

For comprehensive AWS deployment instructions, see our detailed guide:

**[📖 Full AWS Deployment Guide](AWS-DEPLOYMENT.md)** | **[⚡ Quick Start Guide](DEPLOYMENT-QUICK-START.md)**

The guide covers:
- ✅ AWS Amplify (Recommended - easiest with CI/CD)
- ✅ S3 + CloudFront (Cost-effective static hosting)
- ✅ Elastic Beanstalk (Advanced deployments)
- ✅ Custom domain setup with SSL
- ✅ CI/CD with GitHub Actions
- ✅ Monitoring and cost optimization

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Deploy to Other Platforms

- **Vercel:** [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tarunyadav9917/ChatFlow)
- **Netlify:** [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tarunyadav9917/ChatFlow)

---

## 📁 Project Structure

```
ChatFlow/
│
├── 📂 public/                  # Static assets
│   └── 📂 assets/
│       ├── images/
│       └── icons/
│
├── 📂 src/
│   ├── 📂 components/          # React components
│   │   ├── 🔐 Auth/           # Authentication components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ForgotPassword.jsx
│   │   │
│   │   ├── 💬 Chat/           # Chat components
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── TypingIndicator.jsx
│   │   │
│   │   ├── 📋 Sidebar/        # Sidebar components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatList.jsx
│   │   │   └── UserList.jsx
│   │   │
│   │   └── 👤 Profile/        # Profile components
│   │       ├── Profile.jsx
│   │       ├── ProfileEdit.jsx
│   │       └── Avatar.jsx
│   │
│   ├── 📂 context/             # React Context
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── 📂 firebase/            # Firebase configuration
│   │   ├── config.js
│   │   ├── auth.js
│   │   └── database.js
│   │
│   ├── 📂 hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   └── useFirestore.js
│   │
│   ├── 📂 utils/               # Utility functions
│   │   ├── helpers.js
│   │   └── constants.js
│   │
│   ├── 📂 styles/              # Global styles
│   │   ├── global.css
│   │   └── variables.css
│   │
│   ├── App.jsx                 # Main App component
│   └── main.jsx                # Entry point
│
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎨 Feature Highlights

### 🔐 Authentication System
- **Secure Registration** - Email/password with validation
- **Login System** - Persistent sessions with Firebase Auth
- **Password Recovery** - Reset via email
- **Session Management** - Auto logout & token refresh

### 💬 Real-time Messaging
- **Instant Delivery** - Messages appear immediately
- **Message History** - Scroll through past conversations
- **Edit & Delete** - Modify or remove messages
- **Timestamps** - Know exactly when messages were sent
- **Status Indicators** - Sent, delivered, and read states

### 🎨 User Interface
- **Modern Design** - Clean and intuitive
- **Smooth Animations** - Polished user experience
- **Mobile Responsive** - Perfect on all screen sizes
- **Dark Mode** - Easy on the eyes
- **Loading States** - Clear feedback during operations

---

## 🔒 Security

<table>
<tr>
<td>

### 🛡️ Security Features
- ✅ Firebase Security Rules
- ✅ Input sanitization (XSS prevention)
- ✅ Secure authentication flows
- ✅ Environment variable protection
- ✅ HTTPS encryption
- ✅ Private data isolation

</td>
<td>

### 📝 Security Rules Example
```javascript
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

</td>
</tr>
</table>

---

## 🤝 Contributing

We love contributions! 💖 Here's how you can help make ChatFlow better:

### 🔧 How to Contribute

1. **🍴 Fork the repository**
   ```bash
   # Click the 'Fork' button at the top right
   ```

2. **🌿 Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **💻 Make your changes**
   - Write clean, maintainable code
   - Follow existing code style
   - Add comments where necessary

4. **✅ Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

5. **📤 Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **🎉 Open a Pull Request**
   - Describe your changes
   - Reference any related issues

### 📜 Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

### 🐛 Found a Bug?

[Open an issue](https://github.com/tarunyadav9917/ChatFlow/issues/new) and let us know!

---

## 📊 Roadmap

- [ ] 🎥 Video calling
- [ ] 🎙️ Voice messages
- [ ] 🔍 Message search
- [ ] 📌 Pin messages
- [ ] 🌐 Multi-language support
- [ ] 📱 Mobile app (React Native)
- [ ] 🤖 Chatbot integration
- [ ] 📊 Analytics dashboard

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Copyright (c) 2025 Tarun Yadav
```

---

## 👨‍💻 Author

<div align="center">

### **Tarun Yadav**

[![GitHub](https://img.shields.io/badge/GitHub-tarunyadav9917-181717?style=for-the-badge&logo=github)](https://github.com/tarunyadav9917)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/your-profile)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your.email@example.com)

</div>

---

## 🙏 Acknowledgments

Special thanks to:

- 🔥 [**Firebase**](https://firebase.google.com/) - For amazing backend services
- ⚛️ [**React**](https://reactjs.org/) - For the powerful UI library
- ⚡ [**Vite**](https://vitejs.dev/) - For blazing fast builds
- 🎨 [**Shields.io**](https://shields.io/) - For awesome badges
- 💖 **All Contributors** - For making this project better

---

## 📮 Get in Touch

Have questions, suggestions, or just want to say hi? 👋

<div align="center">

[![Open Issue](https://img.shields.io/badge/Open-Issue-2ea44f?style=for-the-badge&logo=github)](https://github.com/tarunyadav9917/ChatFlow/issues)
[![Email Me](https://img.shields.io/badge/Email-Me-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your.email@example.com)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/your-handle)

</div>

---

<div align="center">

### ⭐ **If you found this project helpful, please give it a star!** ⭐

Made with ❤️ by [Tarun Yadav](https://github.com/tarunyadav9917)

**© 2025 ChatFlow. All rights reserved.**

</div>