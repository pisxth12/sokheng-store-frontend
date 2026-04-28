"use client"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    if (!mounted) return null;

    return (
        <div className="  right-6  flex items-center gap-3">
          
            <button
                onClick={toggleTheme}
                className="
                    relative w-12 h-6 rounded-full
                    bg-gray-300 dark:bg-blue-500
                    transition-colors duration-300
                 
                    focus:outline-none focus:ring-1 focus:ring-white
                "
                aria-label="Toggle theme"
            >
                <div
                    className={`
                        absolute top-1 left-1
                        w-4 h-4 rounded-full
                        bg-white
                        shadow-md
                        transform transition-transform duration-300
                        ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}
                    `}
                />
            </button>
        </div>
    );
}