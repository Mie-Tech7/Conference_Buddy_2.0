// types/next-auth.d.ts
// TypeScript module augmentation for NextAuth

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            provider?: string;
        };
    }

    interface User {
        id: string;
        firstName?: string;
        lastName?: string;
        emailVerified?: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub?: string;
        provider?: string;
        accessToken?: string;
        idToken?: string;
    }
}
