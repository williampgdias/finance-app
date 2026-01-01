import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar'; // <--- Import the Sidebar

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Personal Finance App',
    description: 'Built with Next.js, PHP, and AI',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className} suppressHydrationWarning={true}>
                {/* Main Layout Container */}
                <div className="flex min-h-screen bg-beige-100">
                    {/* 1. Fixed Sidebar */}
                    <Sidebar />

                    {/* 2. Main Content Area (Scrollable) */}
                    <main className="flex-1 overflow-y-auto bg-gray-50">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
