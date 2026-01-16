import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'GitDiff Explorer',
  description: 'Browse local Git repositories with diffs and history'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-muted text-slate-900 antialiased dark:bg-mutedDark dark:text-slate-100">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
