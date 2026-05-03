import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
            <div className="flex flex-col items-center gap-6 text-center max-w-lg -mt-24">
                <h1 className="font-mono text-5xl font-bold tracking-tight text-text-primary">
                    Vestra
                </h1>

                <p className="font-sans text-lg text-text-secondary leading-relaxed">
                    AI-powered retirement planning for Canadians
                </p>

                <div className="flex gap-4 mt-2">
                    <Link
                        href="/login"
                        className="px-6 py-2.5 rounded-md border font-medium text-text-primary bg-background hover:bg-surface transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        className="px-6 py-2.5 rounded-md font-medium text-white bg-accent hover:bg-accent-hover transition-colors shadow-sm border border-transparent"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </main>
    );
}
