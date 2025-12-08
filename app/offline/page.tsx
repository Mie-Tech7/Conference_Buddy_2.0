// app/offline/page.tsx
// Offline fallback page for PWA

export default function OfflinePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
            <div className="text-center">
                <div className="text-6xl mb-4">📡</div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    You&apos;re Offline
                </h1>
                <p className="text-gray-400 max-w-md">
                    Please check your internet connection and try again.
                </p>
            </div>
        </main>
    );
}
