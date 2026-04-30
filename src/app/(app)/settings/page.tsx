import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/settings/SignOutButton";
import NicknameForm from "@/components/settings/NicknameForm";
import PushTestButton from "@/components/settings/PushTestButton";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, avatar_url")
    .eq("id", user.id)
    .single();

  const displayName = profile?.nickname ?? user.email?.split("@")[0] ?? "사용자";
  const avatarUrl = profile?.avatar_url ?? user.user_metadata?.avatar_url;

  return (
    <div className="px-4 pt-8 pb-6">
      <h1 className="text-xl font-bold text-[#2C2C2A] mb-6">설정</h1>

      {/* 프로필 */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6] flex items-center gap-4 mb-6">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="프로필"
            className="w-14 h-14 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-[#6CBFA818] flex items-center justify-center flex-shrink-0">
            <span className="text-[#6CBFA8] text-xl font-bold">
              {displayName[0]?.toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <NicknameForm initialNickname={displayName} />
          <p className="text-xs text-[#878680] truncate mt-0.5">{user.email}</p>
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className="bg-white rounded-2xl border border-[#E8E8E6] overflow-hidden mb-4">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F0F0EE]">
          <span className="text-sm text-[#2C2C2A]">버전</span>
          <span className="text-sm text-[#878680]">1.0.0</span>
        </div>
        <a
          href="mailto:tadadadacoding@gmail.com?subject=해냄! 문의"
          className="flex items-center justify-between px-4 py-3.5"
        >
          <span className="text-sm text-[#2C2C2A]">문의하기</span>
          <span className="text-sm text-[#878680]">→</span>
        </a>
      </div>

      {/* 알림 테스트 */}
      <PushTestButton />

      {/* 로그아웃 */}
      <SignOutButton />
    </div>
  );
}
