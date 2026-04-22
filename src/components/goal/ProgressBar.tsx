interface ProgressBarProps {
  percent: number; // 0~100
  color?: string;
}

export default function ProgressBar({ percent, color = "#6CBFA8" }: ProgressBarProps) {
  return (
    <div className="w-full h-1.5 bg-[#E8E8E6] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: color }}
      />
    </div>
  );
}
