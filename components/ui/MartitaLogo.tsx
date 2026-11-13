"use client";

import React from "react";

interface MartitaLogoProps {
  className?: string;
  variant?: "light" | "dark";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg" | "hero";
}

export function MartitaLogo({
  className = "",
  variant = "light",
  showTagline = true,
  size = "md",
}: MartitaLogoProps) {
  const goldColor = "#CFB583";
  const coralColor = "#E77759";

  const sizeClasses = {
    sm: {
      wrapper: "gap-2",
      icon: "w-7 h-10",
      title: "text-2xl sm:text-3xl",
      tagline: "text-[8px] tracking-[0.28em]",
    },
    md: {
      wrapper: "gap-3",
      icon: "w-9 h-12",
      title: "text-3xl sm:text-4xl",
      tagline: "text-[9px] tracking-[0.3em]",
    },
    lg: {
      wrapper: "gap-4",
      icon: "w-12 h-16",
      title: "text-5xl sm:text-6xl",
      tagline: "text-[11px] tracking-[0.34em]",
    },
    hero: {
      wrapper: "gap-4 sm:gap-5",
      icon: "w-14 h-20 sm:w-16 sm:h-24",
      title: "text-6xl sm:text-7xl md:text-8xl",
      tagline: "text-xs sm:text-sm tracking-[0.38em]",
    },
  }[size];

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div className={`flex items-center ${sizeClasses.wrapper}`}>
        {/* Taça c/ Sol e Ondas — Ícone Oficial Martita em SVG Vetorial */}
        <svg
          viewBox="0 0 80 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses.icon} shrink-0 transition-transform duration-500 group-hover:scale-105`}
          aria-hidden="true"
        >
          {/* Bowl of the glass */}
          <path
            d="M18 10 H62 C68 28 72 46 69 61 C65 77 53 84 40 84 C27 84 15 77 11 61 C8 46 12 28 18 10 Z"
            stroke={goldColor}
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Sun inside the glass */}
          <circle
            cx="48"
            cy="37"
            r="9.5"
            stroke={goldColor}
            strokeWidth="3.6"
          />
          {/* Upper wave */}
          <path
            d="M11.5 54 C21 47 31 48 41 54 C51 60 61 59 68.5 53"
            stroke={goldColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          {/* Lower wave */}
          <path
            d="M13 65 C22 59 32 60 41 66 C50 72 60 70 66.5 64"
            stroke={goldColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          {/* Stem */}
          <path
            d="M40 84 V111"
            stroke={goldColor}
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          {/* Base */}
          <path
            d="M23 112 C31 109.5 49 109.5 57 112"
            stroke={goldColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* Wordmark "Martita" */}
        <span
          className={`font-serif-editorial italic font-semibold leading-none tracking-tight ${sizeClasses.title}`}
          style={{ color: coralColor }}
        >
          Martita
        </span>
      </div>

      {showTagline && (
        <span
          className={`mt-1.5 font-sans-editorial font-semibold uppercase ${sizeClasses.tagline}`}
          style={{
            color: variant === "dark" ? "#CFB583" : "#B89B67",
          }}
        >
          CAFÉ E GASTROBAR
        </span>
      )}
    </div>
  );
}

