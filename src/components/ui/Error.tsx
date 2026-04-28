import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SimpleErrorProps {
    error?: string;
}

const SimpleError: React.FC<SimpleErrorProps> = ({ error = "Something went wrong" }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-red-100 p-3 rounded-full mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-red-600 font-medium mb-2">Error</p>
            <p className="text-gray-600 text-center">{error}</p>
        </div>
    );
};

export default SimpleError;