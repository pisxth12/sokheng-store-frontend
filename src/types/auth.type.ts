export interface LoginCredentials{
    email: string;
    password: string
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyResetCodeRequest {
    email: string;
    code: string;
    newPassword: string;
}

export interface ApiResponse {
    message: string;
}

export interface GoogleLoginRequest {
     idToken: string;
}

export interface AuthResponse {
    token: string;
    userId: number;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
}