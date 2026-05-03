// Matches Express res.status().json({ status: 'error', message }) from errorHandler.ts
export interface BackendError {
    status: 'error';
    message: string;
}

// Matches Express res.status().json({ status: 'success', data }) from response.ts
export interface ApiSuccess<T> {
    status: 'success';
    data: T;
}
