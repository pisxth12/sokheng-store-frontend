export interface Brand {
    id: number;
    name: string;
    slug: string;
    logoUrl?: string;
}

export interface BrandNameListResponse {
    id: number;
    name: string;
    slug: string;
}