# 🎯 Getting Started with ChatFlow as a Template

## 🚀 Three Ways to Start

### Option 1: Automated Setup (Recommended) ⭐

```bash
# 1. Clone the repository
git clone https://github.com/tarunyadav9917/ChatFlow.git my-awesome-app
cd my-awesome-app

# 2. Run the setup script
chmod +x setup-starter.sh
./setup-starter.sh
```

**The script will ask you:**
- Project name
- Description  
- Your name
- Your email
- Reset git history? (y/n)
- Install dependencies? (y/n)

**Done! Your project is ready in 2 minutes!** ⚡

---

### Option 2: GitHub Template (Easiest) 🎯

1. Click **"Use this template"** button on GitHub
2. Name your repository
3. Clone your new repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/your-repo.git
   cd your-repo
   ```
4. Install and configure:
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

---

### Option 3: Manual Setup (Full Control) 🔧

```bash
# 1. Clone
git clone https://github.com/tarunyadav9917/ChatFlow.git my-project
cd my-project

# 2. Reset Git
rm -rf .git
git init

# 3. Update package.json
npm pkg set name="my-project"
npm pkg set description="My awesome project"
npm pkg set author="Your Name <your@email.com>"

# 4. Setup environment
cp .env.example .env
nano .env  # Add your Firebase config

# 5. Install
npm install

# 6. Start
npm run dev
```

---

## 📋 Post-Setup Checklist

After running setup, complete these steps:

### 1️⃣ Configure Firebase (5 minutes)

1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Get your config from Project Settings
5. Add to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2️⃣ Customize Branding (10 minutes)

Update these files:

**`index.html`** - Change title:
```html
<title>Your App Name</title>
```

**`tailwind.config.js`** - Update colors:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',  // Your brand color
      }
    }
  }
}
```

**`README.md`** - Update content:
- Project name
- Description
- Features
- Author info

### 3️⃣ Remove Demo Data (2 minutes)

Edit `src/App.tsx`, remove lines 20-63:
```typescript
// DELETE THIS:
useEffect(() => {
  const existingUsers = loadFromStorage('users');
  if (!existingUsers || existingUsers.length === 0) {
    const demoUsers = [ ... ];
    saveToStorage('users', demoUsers);
  }
}, []);
```

### 4️⃣ Test Your App (1 minute)

```bash
npm run dev
```

Visit `http://localhost:5173` - it should work! 🎉

---

## 🎨 Customization Examples

### Example 1: Change Primary Color

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  }
}
```

Then use: `bg-primary-500`, `text-primary-700`, etc.

### Example 2: Add New Page

```bash
# Install React Router
npm install react-router-dom
```

Create `src/pages/Home.tsx`:
```typescript
export default function Home() {
  return (
    <div className="p-8">
      <h1>Welcome to My App!</h1>
    </div>
  );
}
```

Update `src/App.tsx`:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Example 3: Use Different Backend

Replace Firebase with your API:

```typescript
// src/services/api.ts
const API_URL = 'https://your-api.com';

export const api = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },
  
  async getMessages(chatId: string) {
    const response = await fetch(`${API_URL}/chats/${chatId}/messages`);
    return response.json();
  }
};
```

---

## 🚀 Deploy Your App

Once customized, deploy using the included guides:

### AWS Amplify (Easiest)
```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

### AWS S3 + CloudFront (Cheapest)
```bash
# Configure deploy-s3.sh with your bucket name
./deploy-s3.sh
```

### GitHub Actions (Automated)
```bash
cp .github/workflows/deploy-aws.yml.example .github/workflows/deploy-aws.yml
# Add secrets to GitHub
# Push to main branch
```

See full details in [AWS-DEPLOYMENT.md](AWS-DEPLOYMENT.md)

---

## 📚 Next Steps

1. ✅ Complete the checklist above
2. 📖 Read [STARTER-TEMPLATE-GUIDE.md](STARTER-TEMPLATE-GUIDE.md) for detailed customization
3. 🎨 Explore [DEMO-DATA-GUIDE.md](DEMO-DATA-GUIDE.md) for data management
4. 🚀 Check [AWS-DEPLOYMENT.md](AWS-DEPLOYMENT.md) when ready to deploy
5. 🎯 Build something awesome!

---

## 🆘 Common Issues

### "Firebase not configured"
→ Check `.env` file has all `VITE_FIREBASE_*` variables

### "Port 5173 already in use"
→ Stop other Vite instances or change port: `vite --port 3000`

### "Module not found"
→ Run `npm install` again

### Build fails
→ Clear cache: `rm -rf node_modules package-lock.json && npm install`

---

## 💡 Pro Tips

1. **Start Simple** - Get basic features working first
2. **Commit Often** - Use git to save your progress
3. **Read the Docs** - Check the included markdown files
4. **Test on Mobile** - Use Chrome DevTools responsive mode
5. **Deploy Early** - See your app live soon

---

<div align="center">

### 🎉 You're all set! Start building! 🎉

Questions? Check [STARTER-TEMPLATE-GUIDE.md](STARTER-TEMPLATE-GUIDE.md)

[📖 Full Guide](STARTER-TEMPLATE-GUIDE.md) | [🚀 Deploy](AWS-DEPLOYMENT.md) | [💬 Issues](https://github.com/tarunyadav9917/ChatFlow/issues)

</div>
