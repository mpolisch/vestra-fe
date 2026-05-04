import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl font-bold text-text-primary">404</h2>
            <p className="text-text-secondary mt-2 mb-6">
                Oops! The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
                href="/"
                className="px-6 py-2.5 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
            >
                Back to Home
            </Link>
        </div>
    );
}
