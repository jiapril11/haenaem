function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`bg-[#E8E8E6] rounded-xl animate-pulse ${className}`} />;
}

export default function GoalDetailLoading() {
  return (
    <div className="min-h-screen bg-[#F8F8F9]">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <SkeletonBox className="w-9 h-9 rounded-xl" />
        <SkeletonBox className="h-5 w-24 flex-1" />
        <SkeletonBox className="w-9 h-9 rounded-xl" />
      </div>

      <div className="px-4 pb-8 space-y-5">
        {/* 목표 헤더 */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
          <div className="flex items-center gap-3 mb-4">
            <SkeletonBox className="w-12 h-12 rounded-2xl flex-shrink-0" />
            <div>
              <SkeletonBox className="h-3 w-12 mb-1.5" />
              <SkeletonBox className="h-5 w-40" />
            </div>
          </div>
          <SkeletonBox className="h-1.5 w-full rounded-full mb-1.5" />
          <SkeletonBox className="h-3 w-24" />
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-2">
          {Array(3).fill(null).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-3 border border-[#E8E8E6]">
              <SkeletonBox className="h-3 w-12 mb-2 mx-auto" />
              <SkeletonBox className="h-5 w-10 mx-auto" />
            </div>
          ))}
        </div>

        {/* 캘린더 */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
          <SkeletonBox className="h-4 w-20 mb-3" />
          <div className="grid grid-cols-7 gap-1">
            {Array(35).fill(null).map((_, i) => (
              <SkeletonBox key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
