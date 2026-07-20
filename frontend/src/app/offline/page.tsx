"use client";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728m12.728 0A9 9 0 015.636 18.364m12.728-12.728L5.636 18.364" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">You&apos;re Offline</h1>
        <p className="text-muted-foreground mb-6">
          It looks like you&apos;ve lost your internet connection. Some features may not be available until you&apos;re back online.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
