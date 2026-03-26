// components/ui/EmptyItems.tsx
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyItemsProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink: string;
}

export const EmptyItems = ({
  icon: Icon,
  title,
  description,
  buttonText = "Continue shopping",
  buttonLink,
}: EmptyItemsProps) => {
  return (
    <div className="min-h-screen py-12 bg-white dark:bg-[#0f0f0e] cp-page-enter">
      <div className="max-w-7xl mx-auto px-4 text-center pt-24">
        <Icon
          className="w-12 h-12 mx-auto mb-6 text-gray-200 dark:text-[#2a2a27]"
          strokeWidth={1}
        />
        <h1 className="text-xl font-normal text-gray-900 dark:text-white mb-3">
          {title}
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-7">
          {description}
        </p>
        <Link
          href={buttonLink}
          className="inline-block text-xs tracking-widest uppercase text-gray-900 dark:text-white border-b border-gray-900 dark:border-white pb-0.5 hover:opacity-50 transition"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};