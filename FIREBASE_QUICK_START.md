# Quick Start: Firebase Setup for Eyas Saree Drapist

## 🚀 Two Options to Configure Firebase

### Option 1: Direct Configuration (Fastest)

1. **Follow Steps 1-6** in `FIREBASE_SETUP_GUIDE.md` to create your Firebase project
2. **Copy your Firebase config** from the Firebase Console
3. **Open** `src/firebase.js`
4. **Replace the placeholder values** directly in the code:

```javascript
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAbc123...",  // ← Paste your actual key here
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eyas-drapist.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eyas-drapist",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eyas-drapist.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",  // ← Paste here
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123"  // ← Paste here
};
```

5. **Save** and you're done! ✅

---

### Option 2: Environment Variables (More Secure - Recommended for Production)

1. **Follow Steps 1-6** in `FIREBASE_SETUP_GUIDE.md`
2. **Copy** `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. **Edit** `.env` and paste your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyAbc123...
   VITE_FIREBASE_AUTH_DOMAIN=eyas-drapist.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=eyas-drapist
   VITE_FIREBASE_STORAGE_BUCKET=eyas-drapist.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```
4. **Restart your dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

---

## ✅ What I've Already Done

- ✅ Created comprehensive setup guide (`FIREBASE_SETUP_GUIDE.md`)
- ✅ Updated `firebase.js` to support environment variables
- ✅ Created `.env.example` template
- ✅ Added `.env` to `.gitignore` (your credentials won't be committed to Git)
- ✅ Your code already uses Firebase Firestore correctly

---

## 📋 Your Next Steps

1. **Go to**: https://console.firebase.google.com/
2. **Follow**: `FIREBASE_SETUP_GUIDE.md` (Steps 1-6)
3. **Configure**: Choose Option 1 or Option 2 above
4. **Test**: Create a booking and verify it appears in Firebase Console

---

## 🧪 Testing After Setup

Once you've configured Firebase:

1. **Open**: http://localhost:5173/EyasSareeDrapist/book
2. **Create a test booking** (fill out the form)
3. **Check Firebase Console**:
   - Go to Firestore Database
   - Look for `bookings` collection
   - Your test booking should appear there! 🎉

---

## 🆘 Need Help?

**Common Issues**:

- **"Firebase not initialized"**: Check that all config values are filled in
- **"Permission denied"**: Make sure you published the security rules in Step 4
- **Changes not working**: Restart the dev server after editing `.env`

**Let me know when you've completed the Firebase setup and I'll help you test it!**
