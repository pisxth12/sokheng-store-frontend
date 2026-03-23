export type Role = "ADMIN" | "USER";
export interface User{
     id: number;
    name: string;
    email: string;
    role: Role;
    phone?: string;
    address?: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}