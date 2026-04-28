interface GuestInfoFormProps {
    formData: any;
    setFormData: (data: any) => void;
}

export const GuestInfoForm = ({ formData, setFormData }: GuestInfoFormProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#252525]">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-[#252525] border border-[#303030] rounded-xl px-4 py-3 text-white"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Email *</label>
                    <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-[#252525] border border-[#303030] rounded-xl px-4 py-3 text-white"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Phone *</label>
                    <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="012 345 678"
                        className="w-full bg-[#252525] border border-[#303030] rounded-xl px-4 py-3 text-white"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Address *</label>
                    <textarea 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main St, Phnom Penh"
                        rows={3}
                        className="w-full bg-[#252525] border border-[#303030] rounded-xl px-4 py-3 text-white"
                    />
                </div>
            </div>
        </div>
    );
};