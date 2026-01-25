# Get Your Firebase Credentials - Quick Guide

## Step 1: Go to Firebase Console
🔗 **Open**: https://console.firebase.google.com/

## Step 2: Create New Project
1. Click **"Create a project"** (or "Add project")
2. **Project name**: `eyas-drapist`
3. Click **"Continue"**
4. **Disable Google Analytics** (not needed)
5. Click **"Create project"**
6. Wait ~30 seconds
7. Click **"Continue"**

## Step 3: Register Web App
1. Click the **Web icon** `</>` (in the center or under "Get started by adding Firebase to your app")
2. **App nickname**: `Eyas Drapist Web`
3. ✅ Check **"Also set up Firebase Hosting"**
4. Click **"Register app"**

## Step 4: Copy Your Config
You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbc123def456...",
  authDomain: "eyas-drapist.firebaseapp.com",
  projectId: "eyas-drapist",
  storageBucket: "eyas-drapist.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

**📋 COPY THIS ENTIRE CONFIG** - you'll need it!

## Step 5: Enable Firestore Database
1. In the left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. **Start in production mode** (we'll add security rules next)
4. **Select location**: Choose closest to you (e.g., `asia-south1` for India)
5. Click **"Enable"**
6. Wait ~1 minute for database creation

## Step 6: Set Security Rules
1. In Firestore, click the **"Rules"** tab
2. Replace everything with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{bookingId} {
      allow create: if true;
      allow read: if true;
      allow update, delete: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 7: Enable Authentication
1. In the left sidebar, click **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Click **"Email/Password"**
4. Toggle **"Enable"**
5. Click **"Save"**

## Step 8: Create Admin User
1. In Authentication, click **"Users"** tab
2. Click **"Add user"**
3. **Email**: Your admin email
4. **Password**: Create a strong password
5. Click **"Add user"**

## Step 9: Update Your Code

**Option A: Direct in firebase.js** (Easiest)
1. Open `src/firebase.js`
2. Replace the placeholder values with your actual config from Step 4

**Option B: Use .env file** (More secure)
1. Copy `.env.example` to `.env`
2. Fill in your values from Step 4
3. Restart dev server

---

## ✅ You're Done!

Once you've completed these steps:
1. Your Firebase project is ready
2. Firestore Database is enabled
3. Security rules are set
4. Admin authentication is configured
5. Your code has the credentials

**Test it**: Create a booking on your website and check if it appears in Firestore Database!

---

## 🆘 Need Help?
Let me know which step you're on and I'll assist!
