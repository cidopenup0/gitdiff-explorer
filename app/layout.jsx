import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'GitDiff Explorer',
  description: 'Browse local Git repositories with diffs and history',
  icons: {
    icon: '/favicon.svg'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-light text-neutral-dark antialiased dark:bg-neutral-dark dark:text-neutral-light">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
