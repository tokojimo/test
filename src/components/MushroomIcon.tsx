import React from "react";

export function MushroomIcon(props: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.size || 40}
      height={props.size || 40}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <path
        d="M12 3c-5.5 0-9 3.2-9 6.5 0 1.4 1.3 2.5 2.8 2.5h12.4c1.5 0 2.8-1.1 2.8-2.5C21 6.2 17.5 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12v1.5A4 4 0 0 0 12 17a4 4 0 0 0 4-3.5V12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
