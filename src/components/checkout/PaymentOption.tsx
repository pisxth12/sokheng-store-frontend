import { PaymentMethod } from "@/types/open/cart.type";

interface PaymentOptionProps {
    id: PaymentMethod;
    name: string;
    icon: string;
    description?: string;
    selected: PaymentMethod;
    onSelect: (id: PaymentMethod) => void;
}

export const PaymentOption = ({ id, name, icon, description, selected, onSelect }: PaymentOptionProps) => (
    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
        ${selected === id 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-[#252525] hover:border-purple-500/30'}`}
    >
        <input 
            type="radio"
            name="payment"
            value={id}
            checked={selected === id}
            onChange={(e) => onSelect(e.target.value as PaymentMethod)}
            className="w-4 h-4 accent-purple-500"
        />
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <span className="font-medium">{name}</span>
            </div>
            {description && (
                <p className="text-xs text-gray-400 mt-1">{description}</p>
            )}
        </div>
    </label>
);