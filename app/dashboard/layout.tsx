import { Navigation } from "@/components/Navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation />

            {/* Main content area with proper padding for nav */}
            <main className="md:pt-20 pb-24 md:pb-8">
                <div className="container mx-auto px-4 py-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
