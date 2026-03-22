// components/ui/ImageModal.tsx
"use client";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function ImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
}: ImageModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(currentIndex);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setSelectedIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handlePrev = () => {
    const i = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(i);
    onIndexChange(i);
  };

  const handleNext = () => {
    const i = (selectedIndex + 1) % images.length;
    setSelectedIndex(i);
    onIndexChange(i);
  };

  const modalContent = (
    <div className="fixed inset-0 z-999999 bg-black/95 flex flex-col">
      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center relative py-8 px-20">
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-transparent border border-white/20 rounded-full text-white/55 hover:text-white hover:border-white/40 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-10"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        <img
          src={images[selectedIndex]}
          alt={`Image ${selectedIndex + 1} of ${images.length}`}
          onClick={onClose}
          className="max-w-[90vw] cursor-zoom-out max-h-[70vh] object-contain"
        />

        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-transparent border border-white/20 rounded-full text-white/55 hover:text-white hover:border-white/40 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-10"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
