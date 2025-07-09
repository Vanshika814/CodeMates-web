import React from "react";

export default function PlusIcon({ size = 48, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="2" />
      <line x1="24" y1="14" x2="24" y2="34" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="24" x2="34" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
} 