import { PageResponse, User, UserFilters, UserListResponse } from "@/types/admin/user.type";
import apiClient from "../open/client";

export const adminUserApi = {

    //Get all users
    getAllUsers: async (params?: UserFilters) => {
        const response = await apiClient.get<PageResponse<UserListResponse>>(
        "/admin/users",
        { params },
        );
        return response.data;
    },

    //Get user by id
    getUserById: async (id: number) => {
        const response = await apiClient.get<User>(`/admin/users/${id}`);
        return response.data;
    },

    //Get recent orders
    getRecentUsers: async (params?: UserFilters) => {
        const res = await apiClient.get<PageResponse<UserListResponse>>(`/admin/users/recent`, {params} )
        return res.data;
    },

    //search users;
    searchUsers: async (query: string, params?: UserFilters) =>  {
            const res = await apiClient.get<PageResponse<UserListResponse>>(`/admin/users/search`, {params: { query, ...params }});
            
            return res.data;

    },


    //Delete user
    deleteUser: async (id: number) => {
        await apiClient.delete(`/admin/users/${id}`);
    }
}