'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // TODO: Have this logged
        console.error('Unhandled App Error:', error);
    }, [error]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-2xl font-bold text-text-primary">Something went wrong!</h2>
            <p className="text-text-secondary mt-2 mb-6">
                {error.message || 'An unexpected error occurred while processing your request.'}
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-2.5 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
                >
                    Try Again
                </button>
                <button
                    onClick={() => (window.location.href = '/')}
                    className="px-6 py-2.5 border border-border text-text-primary rounded-md hover:bg-surface transition-colors"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}
