import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cửa Hàng',
  description: 'Danh sách các chi nhánh nhà Cáo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}



