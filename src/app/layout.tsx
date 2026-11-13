import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OmniRouter — Smart AI Gateway & Multi-Model Router',
  description: 'Unified AI router with multi-provider fallback, latency optimization, and OpenAI-compatible proxy.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]" />
        </div>
        {children}
      </body>
    </html>
  );
}

