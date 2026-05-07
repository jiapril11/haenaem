"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "목표",
    icon: (active: boolean) => {
      const c = active ? "#6CBFA8" : "#878680";
      return (
        <svg width="24" height="24" viewBox="0 0 400 400" fill="none">
          <path d="M200 52L42 300" stroke={c} strokeWidth="33" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M200 52L358 300" stroke={c} strokeWidth="33" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M100 308L200 243" stroke={c} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M200 243L300 308" stroke={c} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M44.9998 309.095L198.697 205.667" stroke={c} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M354.697 309.095L201 205.667" stroke={c} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M101.146 219.698L200 151" stroke={c} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M199.999 151L298.986 219.507" stroke={c} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M91.5361 244.851C91.8687 244.605 92.2012 244.359 98.4822 239.519C104.763 234.678 116.982 225.25 124.121 219.612C131.26 213.975 132.947 212.413 135.756 210.327C138.565 208.242 142.445 205.679 145.403 203.855C148.362 202.031 150.283 201.022 152.262 199.982" stroke={c} strokeWidth="32" strokeLinecap="round"/>
          <path d="M152.261 199.982C156.068 197.394 159.874 194.806 164.15 191.883C168.427 188.959 173.058 185.78 177.238 182.734C185.104 177.004 189.07 173.775 190.715 172.972C194.148 171.297 196.954 170.123 198.166 169.907C201.146 169.377 203.186 171.999 212.807 181.227C215.397 183.711 217.568 185.016 220.777 186.701C223.986 188.386 228.272 190.297 231.772 191.68C237.783 194.053 241.113 194.995 242.596 196C244.823 197.507 246.817 199.85 249.773 202.656C251.704 204.49 254.802 206.833 258.312 209.336C265.595 214.528 271.466 218.245 274.503 220.481C276.577 222.008 280.608 224.683 285.928 228.539C289.375 231.038 291.428 232.047 293.335 233.702C296.932 236.827 300.458 240.076 303.44 242.543C306.89 245.396 309.954 248.881 314.42 253.639C321.903 261.609 325.885 267.845 326.975 268.732C329.615 270.88 330.75 271.878 331.532 272.993C331.879 273.488 332.222 273.768 328.731 271.416C325.239 269.064 317.926 264.054 313.718 261.053C308.527 257.35 306.031 254.45 302.514 250.724C296.864 244.738 295.173 243.698 292.854 242.258C288.669 239.66 283.815 236.927 276.907 232.02C272.939 229.201 267.663 226.249 262.834 222.97C253.474 216.616 248.819 212.57 247.796 211.791C246.3 210.652 244.372 208.815 238.752 205.201C234.432 202.423 226.959 197.998 221.653 194.952C213.49 190.265 208.449 188.435 205.275 187.69C202.376 187.01 198.315 190.265 191.244 194.34C182.619 199.311 176.423 200.872 174.832 201.875C172.35 203.439 166.351 206.918 158.886 210.893C154.887 213.022 149.539 216.183 142.395 219.987C139.603 221.474 138.697 222.411 135.369 224.47C132.041 226.529 126.366 229.772 122.907 231.704C118.41 234.217 115.183 236.007 111.55 238.225C109.137 239.699 107.422 240.64 104.447 242.828C93.9799 250.521 92.1875 251.952 89.7759 253.235C87.5809 254.404 83.6451 258.463 78.9821 262.293C75.7199 264.279 71.6063 266.853 68.5612 270.106C67.8925 270.817 67.5584 271.094 67.145 271.422" stroke={c} strokeWidth="32" strokeLinecap="round"/>
        </svg>
      );
    },
  },
  {
    href: "/stats",
    label: "통계",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="4"
          y="12"
          width="4"
          height="8"
          rx="1"
          fill={active ? "#6CBFA8" : "#878680"}
        />
        <rect
          x="10"
          y="8"
          width="4"
          height="12"
          rx="1"
          fill={active ? "#6CBFA8" : "#878680"}
        />
        <rect
          x="16"
          y="4"
          width="4"
          height="16"
          rx="1"
          fill={active ? "#6CBFA8" : "#878680"}
        />
      </svg>
    ),
  },
  {
    href: "/community",
    label: "커뮤니티",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="9"
          cy="8"
          r="3"
          stroke={active ? "#6CBFA8" : "#878680"}
          strokeWidth="2"
        />
        <circle
          cx="16"
          cy="10"
          r="2.5"
          stroke={active ? "#6CBFA8" : "#878680"}
          strokeWidth="2"
        />
        <path
          d="M3 19c0-3.314 2.686-6 6-6s6 2.686 6 6"
          stroke={active ? "#6CBFA8" : "#878680"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 14c2.21 0 4 1.79 4 4"
          stroke={active ? "#6CBFA8" : "#878680"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "설정",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 15a3 3 0 100-6 3 3 0 000 6z"
          stroke={active ? "#6CBFA8" : "#878680"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
          stroke={active ? "#6CBFA8" : "#878680"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-[#E8E8E6]">
      <div className="flex max-w-[390px] mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center gap-1 pt-3 pb-5 cursor-pointer"
            >
              {tab.icon(active)}
              <span
                className={`text-[11px] font-medium ${active ? "text-[#6CBFA8]" : "text-[#878680]"}`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
