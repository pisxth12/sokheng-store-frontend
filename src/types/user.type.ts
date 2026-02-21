export type Role = "ADMIN" | "USER";
export interface User{
     id: string;
    name: string;
    email: string;
    role: Role;
    phone?: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}