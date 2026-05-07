import Link from "next/link";

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10"/><path d="M12 10c0-3 2-5 5-5 0 3-2 5-5 5Z"/>
        <path d="M12 13c0-2.5-1.7-4.2-4.2-4.2 0 2.5 1.7 4.2 4.2 4.2Z"/>
        <path d="M6.5 20h11"/>
      </svg>
    ),
    title: "매일 기록",
    desc: "오늘 한 일을 체크하고 메모를 남겨요",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="12" width="4" height="8" rx="1" fill="currentColor" stroke="none"/>
        <rect x="10" y="8" width="4" height="12" rx="1" fill="currentColor" stroke="none"/>
        <rect x="16" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
    title: "진행 통계",
    desc: "요일별 패턴과 달성률을 한눈에 확인해요",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3"/><circle cx="16" cy="10" r="2.5"/>
        <path d="M3 19c0-3.314 2.686-6 6-6s6 2.686 6 6"/>
        <path d="M16 14c2.21 0 4 1.79 4 4"/>
      </svg>
    ),
    title: "커뮤니티",
    desc: "다른 사람들과 목표를 공유하고 자극받아요",
  },
];

export default function OnboardingView({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center pt-4 pb-8">
      {/* 로고 + 환영 */}
      <div className="flex flex-col items-center mb-8">
        <img src="/logo.svg" alt="해냄" className="w-20 h-20 mb-4" />
        <h2 className="text-xl font-bold text-[#2C2C2A] text-center">
          {name}님, 환영해요!
        </h2>
        <p className="text-sm text-[#878680] mt-2 text-center leading-relaxed">
          목표를 세우고 매일 꾸준히 기록해보세요.<br />작은 습관이 큰 변화를 만들어요.
        </p>
      </div>

      {/* 기능 소개 */}
      <div className="w-full flex flex-col gap-3 mb-8">
        {FEATURES.map((f) => (
          <div key={f.title} className="bg-white border border-[#E8E8E6] rounded-2xl px-4 py-3.5 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#6CBFA815] flex items-center justify-center text-[#6CBFA8] flex-shrink-0">
              {f.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#2C2C2A]">{f.title}</p>
              <p className="text-xs text-[#878680] mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/goals/new"
        className="w-full bg-[#6CBFA8] text-white py-4 rounded-2xl text-base font-bold text-center block cursor-pointer"
      >
        첫 목표 만들기
      </Link>
      <p className="text-xs text-[#C0BFB8] mt-3">목표를 추가하면 바로 시작할 수 있어요</p>
    </div>
  );
}
