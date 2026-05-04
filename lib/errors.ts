import axios from 'axios';

export function getErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        return err.message;
    }
    return 'An unexpected error occurred';
}
