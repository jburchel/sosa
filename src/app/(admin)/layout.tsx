import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | SOSA Basketball',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sosa-black text-white">
      {children}
    </div>
  );
}
