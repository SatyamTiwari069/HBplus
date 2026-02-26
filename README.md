# HB+ Authentication Platform

Cross-platform secure authentication app built with **React Native + Expo** (Web, Android, iOS) using **Google OAuth 2.0** and **Firebase**, with domain-restricted access for `@hbplus.fit` accounts, role-based access control, and Firestore user storage.

---

## 🎥 Working Demo Video

📹 **Full Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/1q-tDxBKPRvBAOIs1BR7-kGhRrPv53tmx/view?usp=sharing)

---

## 📸 Screenshots - RBAC Flow (Reversed Order)

11. **Session Management** - ![Session](./screenshots_hbplus/screenshot_11.png)
10. **RBAC Details** - ![RBAC](./screenshots_hbplus/screenshot_10.png)
9. **Module Management** - ![Module](./screenshots_hbplus/screenshot_9.png)
8. **Admin Panel** - ![Admin Panel](./screenshots_hbplus/screenshot_8.png)
7. **Admin Dashboard** - ![Admin](./screenshots_hbplus/screenshot_7.png)
6. **Security Settings** - ![Security](./screenshots_hbplus/screenshot_6.png)
5. **User Profile** - ![Profile](./screenshots_hbplus/screenshot_5.png)
4. **User Dashboard** - ![User](./screenshots_hbplus/screenshot_4.png)
3. **Domain Validation** - ![Domain](./screenshots_hbplus/screenshot_3.png)
2. **Google Sign-In** - ![Sign-In](./screenshots_hbplus/screenshot_2.png)
1. **Login Screen** - ![Login](./screenshots_hbplus/screenshot_1.png)

---

## 📋 Problem Statement & Solution

Secure authentication system that:
- ✅ **Google OAuth 2.0** login with domain validation
- ✅ **@hbplus.fit** domain restriction with error handling
- ✅ Cross-platform support (Web, Android, iOS)
- ✅ **Role-Based Access Control** (Admin/User)
- ✅ **Firestore** database integration
- ✅ Protected routes with session persistence

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|---|
| **Frontend** | React Native, React Native for Web, Expo |
| **Routing** | Expo Router |
| **Auth** | Google OAuth 2.0, Firebase Auth |
| **Database** | Firestore |
| **State** | Context API + useReducer |
| **Language** | TypeScript |
| **Build** | Expo CLI, Metro |
| **Deployment** | Netlify (Web), Expo EAS (Mobile) |

---

## ✨ Features Implemented

### Authentication & Security
- [x] Google Sign-In Button (Web, iOS, Android)
- [x] Domain validation (`@hbplus.fit` only)
- [x] Immediate session destruction for restricted domains
- [x] Protected routes (no direct URL bypass)
- [x] Firestore security rules
- [x] Session persistence (AsyncStorage, IndexedDB)

### Role-Based Access Control
- [x] Admin/User role detection
- [x] Admin panel & module management
- [x] Role-based dashboard features
- [x] Admin email list configuration

### User Management
- [x] Firestore user storage
- [x] User profile with Google data
- [x] Logout with session cleanup
- [x] User initials & avatar generation

### UI/UX
- [x] Animated HB+ logo
- [x] Loading screen with animations
- [x] Error alerts with animations
- [x] Responsive design (mobile, tablet, web)
- [x] Professional color scheme

---

## 🌍 Environment Variables

### Quick Start - Pre-Configured `.env`:
```dotenv
# Firebase Configuration — hbplusauth project
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBAO6Ii5-Dlt6crDPrV51hew8R3G-zAUzY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=hbplusauth.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=hbplusauth
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=hbplusauth.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=346226144445
EXPO_PUBLIC_FIREBASE_APP_ID=1:346226144445:web:58ec18afea7424207eb3d4

# Google OAuth Client IDs
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=499133736624-gtn38069fhjvrc4r9bd291776fm9ur99.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=346226144445-ios.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=346226144445-android.apps.googleusercontent.com

# Domain & Role Config
EXPO_PUBLIC_ALLOWED_DOMAIN=hbplus.fit
EXPO_PUBLIC_ADMIN_EMAILS=admin@hbplus.fit
```

> **These credentials are pre-configured and ready to use!** Simply copy this entire block into your `.env` file and run `npm run web`.

### Customize Your Own Setup:

| Variable | Description | Example |
|----------|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase API key | `AIzaSy...` |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | `my-project-123` |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket | `project.firebasestorage.app` |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID | `123456789` |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc...` |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Google OAuth web client | `123-web.apps.googleusercontent.com` |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | Google OAuth iOS client | `123-ios.apps.googleusercontent.com` |
| `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` | Google OAuth Android client | `123-android.apps.googleusercontent.com` |
| `EXPO_PUBLIC_ALLOWED_DOMAIN` | Email domain restriction | `company.com` |
| `EXPO_PUBLIC_ADMIN_EMAILS` | Admin email list (comma-separated) | `admin@company.com,manager@company.com` |

### Getting Your Own Credentials:
1. **Firebase**: Go to [console.firebase.google.com](https://console.firebase.google.com) → Project Settings
2. **Google OAuth**: Firebase → Authentication → Google sign-in method
3. **Domain**: Change `hbplus.fit` to your organization domain
4. **Admin Emails**: Comma-separated list

### ⚠️ Security Notes:
- The provided credentials are **demo credentials** for testing only
- For production, generate your own credentials
- Never commit `.env` to version control
- Use `.env.example` as template for your team
- Rotate keys if exposed
- Keep admin emails updated

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy .env file (already included in repo)
# The .env file is pre-configured with working credentials

# 3. Run on web
npm run web

# Or run on mobile
npm run ios          # iOS simulator
npm run android      # Android emulator
```

✅ **Everything is pre-configured!** Just run and test immediately.

---

## 🔥 Firebase Setup Checklist

### 1. Enable Google Sign-In
- Go to [Firebase Console](https://console.firebase.google.com)
- Authentication → Sign-in methods → Enable Google
- Add authorized domains

### 2. Create Firestore Database
- Firestore Database → Create → Start in test mode
- Apply rules from `firestore.rules`

### 3. Apply Security Rules
In Firebase Console → Firestore → Rules, paste `firestore.rules` content

---

## 📁 Folder Structure

```
hbplus-auth/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Root layout with AuthProvider
│   ├── index.tsx            # Login page
│   └── dashboard.tsx        # Protected dashboard
├── components/              # UI components
│   ├── HBLogo.tsx          # Animated logo
│   ├── GoogleButton.tsx     # Sign-in button
│   ├── ErrorAlert.tsx       # Error display
│   └── LoadingScreen.tsx    # Loading state
├── config/
│   ├── firebase.ts         # Firebase setup
│   └── userService.ts      # Firestore CRUD
├── constants/
│   └── index.ts            # Colors, domain, roles
├── context/
│   └── AuthContext.tsx     # Auth state machine
├── utils/
│   └── domainValidator.ts  # Domain & role logic
├── .env                    # Environment variables
├── .env.example            # Template
├── firestore.rules         # Security rules
└── app.json               # Expo config
```

---

## 🔐 Authentication Flow

```
[User taps "Continue with Google"]
           ↓
  Platform.OS === 'web'?
    ├─ YES → signInWithPopup
    └─ NO  → expo-auth-session
           ↓
   Firebase returns user
           ↓
  isAllowedDomain(email)?
    ├─ YES → getUserRole() → saveUserToDb → /dashboard
    └─ NO  → firebaseSignOut() → Show error
```

### Domain Validation (utils/domainValidator.ts):
```typescript
export const isAllowedDomain = (email: string): boolean => {
  return email.toLowerCase().trim().endsWith('@hbplus.fit');
};

export const getUserRole = (email: string): UserRole => {
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';
};
```

**Flow:**
1. Google returns valid Firebase user
2. Check email domain → if not `@hbplus.fit`, sign out immediately
3. Determine role (admin/user) from email
4. Save user to Firestore
5. Navigate to dashboard
6. Session re-validates on refresh (prevents token tampering)

---

## 👑 Role-Based Features

| Role | Access |
|------|--------|
| **User** | Profile, stats, security info |
| **Admin** | All user features + Administration Panel + Module management |

---

## 🔒 Protected Routes

- Dashboard requires authentication
- Direct URL access redirects to login
- Session persists on refresh
- Mobile: AsyncStorage | Web: Firebase IndexedDB

---

## 🚢 Deploying to Netlify

```bash
# Build
npx expo export --platform web

# Deploy
npm install -g netlify-cli
netlify login
netlify deploy --dir dist --prod
```

**Or via GitHub:**
- Build command: `npx expo export --platform web`
- Publish directory: `dist`
- Add env vars in Netlify dashboard

---

## 📱 Platform Notes

| Platform | Method |
|----------|--------|
| **Web** | `signInWithPopup` |
| **iOS** | `expo-auth-session` → `signInWithCredential` |
| **Android** | `expo-auth-session` → `signInWithCredential` |

---

*HB+ Platform · Secured by Firebase Auth · Built with React Native + Expo*
