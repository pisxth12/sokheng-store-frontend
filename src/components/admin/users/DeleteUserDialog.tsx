import { X } from "lucide-react";
import { useState } from "react";

interface Props{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
}
export default function DeleteUserDialog({isOpen,onClose,onConfirm,userName}:Props){
    const [loading, setLoading] = useState(false);

    if(!isOpen){
        return null;
    }

    const handleDelete = async () => {
        setLoading(true);
        try{
            await onConfirm();
            onClose();
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false);
        }
    }

     return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Delete User</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600">
            Are you sure you want to delete user <span className="font-medium">"{userName}"</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );   


}