import axios from 'axios';

export function getErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        return err.message; // Your interceptor already cleaned this up
    }
    return 'An unexpected error occurred';
}
