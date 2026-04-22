"use client";

import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error") === "oauth";

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F8F8F9]">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-10">
          <img src="/logo.svg" alt="해냄!" className="w-40 h-auto mx-auto mb-2" />
          <p className="text-[#878680] text-sm mt-3">목표를 세우고, 매일 기록하세요</p>
        </div>

        {/* 오류 메시지 */}
        {hasError && (
          <div className="bg-[#D75A2F18] border border-[#D75A2F40] rounded-xl px-4 py-3 mb-4 text-center">
            <p className="text-[#D75A2F] text-sm">로그인에 실패했어요. 다시 시도해주세요.</p>
          </div>
        )}

        {/* Google 로그인 버튼 */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-[#E8E8E6] text-[#2C2C2A] rounded-2xl py-4 font-semibold text-base flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.4a4.6 4.6 0 01-2 3.02v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.31z" fill="#4285F4" />
            <path d="M10 20c2.7 0 4.97-.9 6.63-2.46l-3.24-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H1.06v2.58A10 10 0 0010 20z" fill="#34A853" />
            <path d="M4.41 11.88A5.98 5.98 0 014.1 10c0-.65.11-1.28.31-1.88V5.54H1.06A10 10 0 000 10c0 1.61.39 3.13 1.06 4.46l3.35-2.58z" fill="#FBBC05" />
            <path d="M10 3.96c1.47 0 2.79.5 3.82 1.5l2.86-2.85C14.97.99 12.7 0 10 0A10 10 0 001.06 5.54l3.35 2.58C5.2 5.72 7.4 3.96 10 3.96z" fill="#EA4335" />
          </svg>
          Google로 시작하기
        </button>

        <p className="text-center text-[#878680] text-xs mt-6">
          계속하면 서비스 이용약관 및 개인정보처리방침에 동의하는 것으로 간주합니다.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
