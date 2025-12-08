# Conference Buddy

> AI-powered multi-tenant conference networking platform

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js (LinkedIn + Google OAuth)
- **Database:** Firebase Firestore (multi-tenant)
- **PWA:** next-pwa

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in all required values in `.env.local`

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth API routes
│   ├── layout.tsx               # Root layout (PWA setup)
│   ├── page.tsx                 # Home page
│   └── offline/                 # PWA offline fallback
├── components/
│   └── providers/               # Context providers
├── lib/
│   └── firebase.ts              # Firebase client
├── public/
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker
├── types/
│   └── next-auth.d.ts           # NextAuth type augmentations
└── .env.example                 # Environment template
```

## Multi-Tenant Convention

Firestore collections follow: `conferences/[conferenceId]/...`

```typescript
import { conferenceCollection } from '@/lib/firebase';

// Get users collection for a conference
const usersRef = conferenceCollection('afrotech-2025', 'users');
```

## OAuth Setup

### LinkedIn
1. Create app at [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Add `openid`, `profile`, `email` scopes
3. Set callback URL: `http://localhost:3000/api/auth/callback/linkedin`

### Google
1. Create credentials at [Google Cloud Console](https://console.cloud.google.com/)
2. Set callback URL: `http://localhost:3000/api/auth/callback/google`
