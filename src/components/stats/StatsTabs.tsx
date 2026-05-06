"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { key: "active", label: "진행 중" },
  { key: "completed", label: "완료" },
  { key: "archived", label: "보관" },
] as const;

export type StatsTab = (typeof TABS)[number]["key"];

export default function StatsTabs({ active }: { active: StatsTab }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleTab(key: StatsTab) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.push(`/stats?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 bg-[#F0F0EE] rounded-xl p-1">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleTab(tab.key)}
          className={`flex-1 text-sm font-medium py-1.5 rounded-lg transition-colors ${
            active === tab.key
              ? "bg-white text-[#2C2C2A] shadow-sm"
              : "text-[#878680]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
