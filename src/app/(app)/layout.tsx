import AppLayout from "@/components/layout/AppLayout";
import QueryProvider from "@/providers/QueryProvider";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AppLayout>{children}</AppLayout>
    </QueryProvider>
  );
}
