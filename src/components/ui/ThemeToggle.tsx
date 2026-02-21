"use client"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Sparkles } from "lucide-react";

export default function ThemeToggle(){
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    if(!mounted) return null;

    return (
        <div className="fixed top-6 right-6 z-50">
            <button
                onClick={toggleTheme}
                className="
                    relative w-14 h-14 rounded-full
                    bg-gradient-to-br from-amber-200 to-amber-400
                    dark:from-indigo-900 dark:to-purple-900
                    shadow-lg hover:shadow-xl
                    transform hover:scale-110 active:scale-95
                    transition-all duration-300 ease-out
                    group
                    border-2 border-white/20 dark:border-white/10
                "
                aria-label="Toggle theme"
            >
                {/* Sun Icon */}
                <Sun 
                    className={`
                        absolute inset-0 m-auto w-6 h-6
                        text-amber-600 dark:text-amber-300
                        transition-all duration-500
                        ${theme === 'light' 
                            ? 'opacity-100 rotate-0 scale-100' 
                            : 'opacity-0 rotate-90 scale-0'
                        }
                    `}
                />
                
                {/* Moon Icon */}
                <Moon 
                    className={`
                        absolute inset-0 m-auto w-6 h-6
                        text-indigo-100
                        transition-all duration-500
                        ${theme === 'dark' 
                            ? 'opacity-100 rotate-0 scale-100' 
                            : 'opacity-0 -rotate-90 scale-0'
                        }
                    `}
                />

                {/* Sparkles effect on hover */}
                <Sparkles 
                    className="
                        absolute -top-1 -right-1 w-4 h-4
                        text-yellow-400 dark:text-purple-300
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-300
                        animate-pulse
                    "
                />
            </button>

            {/* Tooltip */}
            <div className="
                absolute top-16 right-0
                px-3 py-2 rounded-lg
                bg-gray-900/90 text-white text-xs font-medium
                dark:bg-gray-100/90 dark:text-gray-900
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
                whitespace-nowrap
                pointer-events-none
                backdrop-blur-sm
                shadow-xl
            ">
                {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            </div>
        </div>
    );
}