// Matches req.user shape returned by GET /api/auth/me
export interface AuthUser {
    userId: string;
    email: string;
}
