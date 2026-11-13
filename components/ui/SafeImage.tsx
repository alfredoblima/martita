"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  fallbackLabel?: string;
}

export function SafeImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  fallbackLabel,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state whenever src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#38271F] via-[#2A1D17] to-[#211A17] text-[#CFB583] p-6 text-center ${className}`}
      >
        <div className="w-12 h-12 rounded-full border border-[#CFB583]/30 flex items-center justify-center mb-3 bg-[#CFB583]/10">
          <Sparkles className="w-5 h-5 text-[#E77759]" />
        </div>
        <span className="font-serif-editorial italic text-xl text-[#F8F4EC]">
          {fallbackLabel || alt || "Martita Café & Gastrobar"}
        </span>
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#CFB583]/70 mt-1">
          Fotografia Autoral Martita
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#EFE5D5]/50 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover block ${imgClassName}`}
      />
    </div>
  );
}
