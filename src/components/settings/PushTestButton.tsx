"use client";

import { useState } from "react";

export default function PushTestButton() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleTest() {
    setStatus("전송 중...");
    const res = await fetch("/api/push/test", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setStatus("✅ 전송 완료! 알림을 확인해보세요.");
    } else {
      setStatus(`❌ 실패: ${data.error} (${data.statusCode})`);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8E8E6] overflow-hidden mb-4">
      <button
        onClick={handleTest}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <span className="text-sm text-[#2C2C2A]">알림 테스트</span>
        <span className="text-sm text-[#878680]">→</span>
      </button>
      {status && (
        <p className="px-4 pb-3 text-xs text-[#878680]">{status}</p>
      )}
    </div>
  );
}
