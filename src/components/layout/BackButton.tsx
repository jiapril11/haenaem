"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-[#E8E8E6] mb-4 cursor-pointer"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M12 5l-5 5 5 5"
          stroke="#2C2C2A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
