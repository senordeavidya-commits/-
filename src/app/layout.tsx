import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '期权冒险 - Options Adventure',
  description: '一款有趣的期权投教游戏',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-zinc-950">
        {children}
      </body>
    </html>
  );
}
