function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`bg-[#E8E8E6] rounded-xl animate-pulse ${className}`} />;
}

function FeedCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SkeletonBox className="w-7 h-7 rounded-full" />
          <SkeletonBox className="h-3 w-16" />
        </div>
        <SkeletonBox className="h-4 w-12" />
      </div>
      <div className="flex items-center gap-2.5 mb-3">
        <SkeletonBox className="w-9 h-9 rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <SkeletonBox className="h-4 w-36 mb-1.5" />
          <SkeletonBox className="h-3 w-16" />
        </div>
      </div>
      <SkeletonBox className="h-1.5 w-full rounded-full" />
      <SkeletonBox className="h-3 w-28 mt-1.5" />
    </div>
  );
}

export default function CommunityLoading() {
  return (
    <div className="px-4 pt-8 pb-6">
      <div className="flex items-center justify-between mb-5">
        <SkeletonBox className="h-7 w-20" />
        <SkeletonBox className="h-4 w-20" />
      </div>
      <div className="flex flex-col gap-3">
        {Array(4).fill(null).map((_, i) => (
          <FeedCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
