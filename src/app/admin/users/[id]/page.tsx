"use client"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useUsers } from "@/hooks/admin/useUsers";
import { AlertCircle, ArrowLeft, Calendar, Home, Link, Mail, Phone, Shield } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDetailPage(){
    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id as string);
    const { fetchUserById , loading , error , deleteUser, user , } = useUsers();
    const [deleteDialog, setDeleteDialog] = useState(false);
    console.log(id)

    useEffect(()=> {
        if(id){
            fetchUserById(id);
        }
    },[fetchUserById,id]);

    const handleDelete = async () => {
        try{
            await deleteUser(id);
            router.push('/admin/users');
        }catch(error){
            console.log(error)
        }
    }

    const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

 if(loading || !user) {
    return (
      <></>
    );
  }

    return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users" className="p-2 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-light">User Details</h1>
        </div>
   
      </div>

      {/* User Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Basic Info */}
        <div className="border border-gray-200 p-6 col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-medium text-gray-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-medium">{user.name}</h2>
              <span className={`inline-block px-2 py-1 text-xs font-medium mt-2 ${
                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
              {user.emailVerified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">
                  Verified
                </span>
              )}
            </div>
            
            {user.phone && (
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{user.phone}</span>
              </div>
            )}

            {user.address && (
              <div className="flex items-center gap-3 text-gray-600">
                <Home className="w-4 h-4" />
                <span>{user.address}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Last updated {formatDate(user.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="border border-gray-200 p-6">
          <h3 className="font-medium mb-4">Account Statistics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="text-lg font-mono">#{user.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <p className="text-green-600">Active</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Verification</p>
              <p className={user.phoneVerified ? 'text-green-600' : 'text-yellow-600'}>
                {user.phoneVerified ? 'Verified' : 'Pending'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Verification</p>
              <p className={user.emailVerified ? 'text-green-600' : 'text-yellow-600'}>
                {user.emailVerified ? 'Verified' : 'Pending'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Delete User</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium">{user.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteDialog(false)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );





}