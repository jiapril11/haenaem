function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`bg-[#E8E8E6] rounded-xl animate-pulse ${className}`} />;
}

export default function StatsLoading() {
  return (
    <div className="px-4 pt-8 pb-6 space-y-5">
      <SkeletonBox className="h-7 w-16" />
      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-3">
        {Array(4).fill(null).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
            <SkeletonBox className="h-3 w-20 mb-2" />
            <SkeletonBox className="h-6 w-14" />
          </div>
        ))}
      </div>
      {/* 이번 주 */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
        <SkeletonBox className="h-4 w-16 mb-3" />
        <div className="grid grid-cols-7 gap-1.5">
          {Array(7).fill(null).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <SkeletonBox className="h-3 w-4" />
              <SkeletonBox className="w-full aspect-square rounded-lg" />
            </div>
          ))}
        </div>
      </div>
      {/* 히트맵 */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
        <SkeletonBox className="h-4 w-24 mb-3" />
        <div className="grid grid-cols-7 gap-1">
          {Array(35).fill(null).map((_, i) => (
            <SkeletonBox key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
      {/* 목표별 */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
        <SkeletonBox className="h-4 w-20 mb-4" />
        <div className="space-y-4">
          {Array(3).fill(null).map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <SkeletonBox className="h-4 w-32" />
                <SkeletonBox className="h-4 w-10" />
              </div>
              <SkeletonBox className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
