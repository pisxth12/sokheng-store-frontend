export type UserRole = 'ADMIN' | 'USER';

export interface User{
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserListResponse {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    emailVerified: boolean;
    createdAt: string;
}

export interface UserFilters {
    search?: string;
    page?: number;
    role?:UserRole; 
    size?: number;
    sort?:string;
    direction?: 'asc' | 'desc';
}

export interface PageResponse<T>{
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}