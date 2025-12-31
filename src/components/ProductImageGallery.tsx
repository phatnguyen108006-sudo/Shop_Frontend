"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export default function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  // Nếu không có ảnh, dùng ảnh placeholder
  const safeImages = images.length > 0 ? images : ["https://placehold.co/600x600?text=No+Image"];
  const [activeImage, setActiveImage] = useState(safeImages[0]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ẢNH CHÍNH (Lớn) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-gray-50 shadow-sm group">
        <Image
          src={activeImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Badge Mới (Trang trí) */}
        <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          New Arrival
        </div>
      </div>

      {/* LIST ẢNH NHỎ (Thumbnails) */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {safeImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
                activeImage === img 
                  ? "border-black ring-1 ring-black opacity-100" 
                  : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
              )}
            >
              <Image 
                src={img} 
                alt={`${title} - ${index}`} 
                fill 
                className="object-cover" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}