export type UserRole = 'ADMIN' | 'USER';

export interface User{
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    role: UserRole;
    phoneVerified: boolean;
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
    phoneVerified: boolean;
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


export interface UserStats {
    totalUsers: number;
    totalUsersGrowth: number;
    newThisWeek: number;
    newThisMonth: number;
    newUsersThisMonth: number;
    usersWithOrders: number;
    avgOrderValue: number;
    oneTimeBuyers: number;
    repeatCustomers: number;
    fullyVerified: number;
    emailVerified: number;
    phoneVerified: number;
  }