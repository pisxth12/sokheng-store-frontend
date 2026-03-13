export interface Banner {
    id: number;
    title: string;
    imageUrl: string;
    link?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt?: string;
}