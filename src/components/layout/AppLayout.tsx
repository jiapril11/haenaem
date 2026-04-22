import BottomNav from "./BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
