'use client';

interface DeletePlanModalProps {
    planName: string;
    isDeleting: boolean;
    error: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeletePlanModal({
    planName,
    isDeleting,
    error,
    onConfirm,
    onCancel,
}: DeletePlanModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-sm mx-4 p-6 bg-surface rounded-lg border shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="font-mono text-lg font-bold text-text-primary">Delete Plan</h2>
                <p className="mt-2 text-sm text-text-secondary">
                    Are you sure you want to delete{' '}
                    <span className="font-medium text-text-primary">{planName}</span>? This cannot
                    be undone.
                </p>
                {error && <p className="mt-3 text-sm text-error">{error}</p>}
                <div className="mt-6 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="cursor-pointer px-4 py-2 text-sm rounded-md border border-border text-text-primary hover:bg-background transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="cursor-pointer px-4 py-2 text-sm rounded-md bg-error text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
