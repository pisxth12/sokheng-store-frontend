export interface Banner{
    id:number,
    title:string,
    imageUrl:string,
    link?:string,
    sortOrder:number
    isActive:boolean,
    createdAt?:string,
}

export interface BannerRequest{
    title?: string,
    image: File,
    link?: string,
    sortOrder?: number,
    isActive?: boolean
}


export interface BannerResponse extends Banner{
    message?: string
}