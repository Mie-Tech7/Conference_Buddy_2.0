// lib/auth.ts
// NextAuth Configuration - Shared options for server-side usage

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { OAuthConfig } from "next-auth/providers/oauth";

interface LinkedInProfile {
    sub: string;
    name: string;
    email: string;
    picture: string;
    given_name: string;
    family_name: string;
    email_verified: boolean;
}

// Custom LinkedIn Provider with OpenID Connect
const LinkedInProvider: OAuthConfig<LinkedInProfile> = {
    id: "linkedin",
    name: "LinkedIn",
    type: "oauth",
    authorization: {
        url: "https://www.linkedin.com/oauth/v2/authorization",
        params: {
            scope: "openid profile email",
            response_type: "code",
        },
    },
    token: {
        url: "https://www.linkedin.com/oauth/v2/accessToken",
        async request({ params, provider }) {
            const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: params.code!,
                    redirect_uri: provider.callbackUrl,
                    client_id: provider.clientId!,
                    client_secret: provider.clientSecret!,
                }),
            });

            const tokens = await response.json();

            if (!response.ok) {
                console.error('Token exchange failed:', tokens);
                throw new Error('Failed to exchange code for token');
            }

            return { tokens };
        },
    },
    userinfo: {
        url: "https://api.linkedin.com/v2/userinfo",
        async request({ tokens }) {
            const response = await fetch("https://api.linkedin.com/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }

            return await response.json();
        },
    },
    client: {
        token_endpoint_auth_method: "client_secret_post",
    },
    profile(profile: LinkedInProfile) {
        console.log("LinkedIn Profile received:", profile);

        return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            firstName: profile.given_name,
            lastName: profile.family_name,
            emailVerified: profile.email_verified,
        };
    },
    clientId: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
};

export const authOptions: NextAuthOptions = {
    providers: [
        LinkedInProvider,
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
        newUser: '/onboarding',
    },

    callbacks: {
        async jwt({ token, account, profile, user }) {
            if (account && profile) {
                console.log("JWT Callback - Provider:", account.provider);
                console.log("JWT Callback - Profile sub:", (profile as LinkedInProfile).sub);

                token.provider = account.provider;
                token.sub = (profile as LinkedInProfile).sub || user?.id;
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.provider = token.provider as string;
            }
            return session;
        },

        async signIn({ user, account, profile }) {
            console.log("=== SIGN IN CALLBACK ===");
            console.log("Provider:", account?.provider);
            console.log("User email:", user.email);
            console.log("Profile data available:", !!profile);

            if (account?.provider === 'linkedin') {
                if (!user.email && !(profile as LinkedInProfile)?.email) {
                    console.warn("No email from LinkedIn, will collect in onboarding");
                }
            }

            return true;
        },
    },

    debug: process.env.NODE_ENV === 'development',

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    secret: process.env.NEXTAUTH_SECRET,
};
