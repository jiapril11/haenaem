function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`bg-[#E8E8E6] rounded-xl animate-pulse ${className}`} />;
}

function GoalCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E8E6]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <SkeletonBox className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1">
            <SkeletonBox className="h-4 w-32 mb-1.5" />
            <SkeletonBox className="h-3 w-20" />
          </div>
        </div>
        <SkeletonBox className="h-6 w-14 rounded-full" />
      </div>
      <div className="flex gap-1 mb-3">
        {Array(20).fill(null).map((_, i) => (
          <SkeletonBox key={i} className="w-3 h-3 rounded-full flex-shrink-0" />
        ))}
      </div>
      <SkeletonBox className="h-1.5 w-full rounded-full mb-4" />
      <SkeletonBox className="h-10 w-full" />
    </div>
  );
}

export default function HomeLoading() {
  return (
    <div className="px-4 pt-8 pb-6">
      {/* 헤더 */}
      <div className="mb-6">
        <SkeletonBox className="h-5 w-24 mb-1.5" />
        <SkeletonBox className="h-7 w-40" />
      </div>
      {/* 인사이트 배너 */}
      <SkeletonBox className="h-14 w-full rounded-2xl mb-6" />
      {/* 목표 카드들 */}
      <div className="flex flex-col gap-4">
        <GoalCardSkeleton />
        <GoalCardSkeleton />
      </div>
    </div>
  );
}
