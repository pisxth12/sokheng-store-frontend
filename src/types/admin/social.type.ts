export interface SocialLinks {
    id?: number;
    phone: string;
     facebook: string;
    telegram: string;
    tiktok: string;
    googleMap: string;
    createdAt?: string;
    updatedAt?: string;
}



export interface SocialLinksResponse  extends SocialLinks{
    message: string;
}