# Firebase Setup Guide for Eyas Saree Drapist

Follow these steps to set up Firebase Firestore for your application.

## Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Add project"** (or "Create a project")
3. **Enter project name**: `eyas-drapist` (or your preferred name)
4. **Click Continue**
5. **Disable Google Analytics** (optional, not needed for this app)
6. **Click "Create project"**
7. **Wait for project creation** (takes ~30 seconds)
8. **Click "Continue"** when ready

## Step 2: Register Your Web App

1. **In your Firebase project**, click the **Web icon** (`</>`) to add a web app
2. **App nickname**: Enter `Eyas Drapist Web App`
3. **Firebase Hosting**: Check this box (we're using GitHub Pages, but this enables additional features)
4. **Click "Register app"**
5. **Copy the Firebase configuration** - you'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "eyas-drapist.firebaseapp.com",
  projectId: "eyas-drapist",
  storageBucket: "eyas-drapist.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**⚠️ IMPORTANT**: Keep this window open or copy these values to a notepad - you'll need them in the next step!

## Step 3: Enable Firestore Database

1. **In the left sidebar**, click **"Build"** → **"Firestore Database"**
2. **Click "Create database"**
3. **Choose location**: Select your region (e.g., `asia-south1` for India)
4. **Start in production mode** (we'll add security rules next)
5. **Click "Enable"**
6. **Wait for database creation** (~1 minute)

## Step 4: Configure Security Rules

1. **In Firestore Database**, click the **"Rules"** tab
2. **Replace the default rules** with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to create bookings
    match /bookings/{bookingId} {
      allow create: if true;
      allow read: if true;  // Allow users to read their booking status
      allow update, delete: if request.auth != null;
    }
    
    // Admin-only collections
    match /customers/{customerId} {
      allow read, write: if request.auth != null;
    }
    
    match /partners/{partnerId} {
      allow read, write: if request.auth != null;
    }
    
    match /payments/{paymentId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. **Click "Publish"**

## Step 5: Enable Authentication (for Admin Login)

1. **In the left sidebar**, click **"Build"** → **"Authentication"**
2. **Click "Get started"**
3. **Click on "Email/Password"** under Sign-in providers
4. **Enable "Email/Password"**
5. **Click "Save"**

## Step 6: Create Admin User

1. **In Authentication**, click the **"Users"** tab
2. **Click "Add user"**
3. **Email**: Enter your admin email (e.g., `admin@eyasdrapist.com`)
4. **Password**: Enter a strong password
5. **Click "Add user"**

## Step 7: Update Your Code

Now you need to update the Firebase configuration in your code:

1. **Open**: `src/firebase.js`
2. **Replace the placeholder values** with your actual Firebase config from Step 2
3. **Save the file**

Your `firebase.js` should look like:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY_FROM_STEP_2",
    authDomain: "eyas-drapist.firebaseapp.com",
    projectId: "eyas-drapist",
    storageBucket: "eyas-drapist.appspot.com",
    messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
    appId: "YOUR_ACTUAL_APP_ID"
};
```

## Step 8: Test Locally

1. **Make sure dev server is running**: `npm run dev`
2. **Open**: http://localhost:5173/EyasSareeDrapist/
3. **Navigate to Booking page**
4. **Create a test booking**
5. **Check Firebase Console** → Firestore Database → `bookings` collection
6. **Verify the booking appears**

## Step 9: Deploy to Production

Once everything works locally:

```bash
npm run deploy
```

Then test on: https://maniraja5599.github.io/EyasSareeDrapist/

---

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules are published
- Verify you're using the correct Firebase project

### "Firebase not initialized" errors
- Verify all config values are correct in `firebase.js`
- Check for typos in API keys

### Bookings not appearing
- Open browser console (F12) and check for errors
- Verify Firestore Database is enabled
- Check network tab to see if requests are being made

---

## Next Steps After Setup

Once Firebase is working:
1. ✅ Test booking flow
2. ✅ Test admin login with the user you created
3. ✅ Test admin dashboard features
4. ✅ Deploy to production
5. 📧 (Optional) Add email notifications
6. 📊 (Optional) Add Google Sheets export for reporting

---

**Need Help?** Let me know which step you're on and I'll assist you!
