"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export default function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const safeImages = images.length > 0 ? images : ["https://placehold.co/600x600?text=No+Image"];
  const [activeImage, setActiveImage] = useState(safeImages[0]);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="luxury-panel relative aspect-square w-full overflow-hidden rounded-[32px] p-3 group">
        <div className="relative h-full w-full overflow-hidden rounded-[24px]">
          <Image
            src={activeImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute left-4 top-4 rounded-full bg-[rgba(255,250,243,0.82)] px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-[var(--accent-deep)] backdrop-blur">
            Tuyển chọn mới
          </div>
        </div>
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {safeImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={cn(
                "luxury-panel relative h-24 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-[20px] p-1 transition-all",
                activeImage === img ? "ring-1 ring-[var(--accent-deep)] opacity-100" : "opacity-70 hover:opacity-100"
              )}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[14px]">
                <Image src={img} alt={`${title} - ${index + 1}`} fill className="object-cover" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
