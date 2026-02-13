"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/Button";

const quickActions = [
    {
        title: "Discover Events",
        description: "Find sessions tailored to your interests",
        href: "/dashboard/events",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        gradient: "from-blue-600 to-blue-800",
    },
    {
        title: "Network",
        description: "Connect with relevant attendees",
        href: "/dashboard/network",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        gradient: "from-purple-600 to-purple-800",
    },
    {
        title: "Share QR Card",
        description: "Exchange contact info instantly",
        href: "/dashboard/qr",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
        ),
        gradient: "from-secondary-500 to-secondary-700",
    },
    {
        title: "My Schedule",
        description: "View your personalized agenda",
        href: "/dashboard/schedule",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
        gradient: "from-green-600 to-green-800",
    },
];

export default function DashboardPage() {
    const { data: session } = useSession();

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome header */}
            <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {greeting()}, {session?.user?.name?.split(" ")[0] || "there"}! 👋
                </h1>
                <p className="text-white/60 text-lg">
                    What would you like to do today?
                </p>
            </div>

            {/* Quick actions grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                    <Link
                        key={action.title}
                        href={action.href}
                        className="glass-card rounded-2xl p-6 group hover:border-secondary-500/50 transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0
                bg-gradient-to-br ${action.gradient}
                group-hover:scale-110 transition-transform duration-300
              `}>
                                <span className="text-white">{action.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-white group-hover:text-secondary-400 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-white/50 mt-1">
                                    {action.description}
                                </p>
                            </div>
                            <svg
                                className="w-5 h-5 text-white/30 group-hover:text-secondary-400 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Activity section placeholder */}
            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                    <Button variant="ghost" size="sm">View All</Button>
                </div>

                <div className="space-y-4">
                    {/* Placeholder activity items */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">Welcome to Conference Buddy!</p>
                            <p className="text-sm text-white/50">Get started by exploring events</p>
                        </div>
                        <span className="text-xs text-white/30">Just now</span>
                    </div>

                    <div className="text-center py-8 text-white/40">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p>Your activity will appear here</p>
                    </div>
                </div>
            </div>

            {/* AI Suggestions placeholder */}
            <div className="glass-card rounded-2xl p-6 border-secondary-500/30">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500 to-accent-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">AI Insights</h2>
                        <p className="text-sm text-white/50">Personalized recommendations</p>
                    </div>
                </div>

                <p className="text-white/60 mb-4">
                    Complete your profile to unlock AI-powered session recommendations and networking suggestions.
                </p>

                <Link href="/dashboard/profile">
                    <Button variant="primary" size="sm">
                        Complete Profile
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
