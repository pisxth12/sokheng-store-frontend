'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSelectProps {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const CustomSelect = ({ 
  options, 
  placeholder = "Select option",
  value,
  onChange,
  className = ""
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center"
      >
        <span className="text-gray-900 dark:text-white">
          {selected || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-darkbg border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-hide">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-4"
            >
              <span className="text-gray-900 dark:text-white">{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;