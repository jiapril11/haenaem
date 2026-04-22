"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateNickname } from "@/lib/actions/profile";

function NicknameContent() {
  const searchParams = useSearchParams();
  const googleName = searchParams.get("name") ?? "";

  const [value, setValue] = useState(googleName);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit() {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setError("2자 이상 입력해주세요");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        await updateNickname(trimmed);
        router.replace("/");
      } catch {
        setError("저장에 실패했어요. 다시 시도해주세요.");
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F8F8F9]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src="/logo.svg" alt="해냄!" className="w-20 h-auto mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#2C2C2A]">닉네임을 만들어주세요</h2>
          <p className="text-sm text-[#878680] mt-2">앱에서 사용할 이름이에요 (2~20자)</p>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="닉네임 입력"
          maxLength={20}
          autoFocus
          className="w-full border border-[#E8E8E6] rounded-2xl px-4 py-4 text-base text-[#2C2C2A] placeholder:text-[#C0BFB8] outline-none focus:border-[#6CBFA8] bg-white mb-2"
        />
        <p className="text-xs text-[#C0BFB8] text-right mb-3">{value.trim().length}/20</p>

        {error && <p className="text-sm text-[#D75A2F] mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isPending || value.trim().length < 2}
          className="w-full bg-[#6CBFA8] text-white py-4 rounded-2xl text-base font-bold disabled:opacity-40 active:scale-[0.98] transition-transform"
        >
          {isPending ? "저장 중..." : "시작하기"}
        </button>
      </div>
    </div>
  );
}

export default function NicknamePage() {
  return (
    <Suspense>
      <NicknameContent />
    </Suspense>
  );
}
