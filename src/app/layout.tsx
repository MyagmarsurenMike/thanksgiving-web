import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thanksgiving Messages - Share Your Gratitude",
  description: "Share what you're grateful for this Thanksgiving season. Submit your message and see what others are thankful for.",
  keywords: "thanksgiving, gratitude, messages, thankful, holiday, family, friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#ea580c', // Orange-600
                colorSuccess: '#16a34a', // Green-600
                colorWarning: '#d97706', // Amber-600
                colorError: '#dc2626', // Red-600
                borderRadius: 8,
                fontFamily: 'var(--font-geist-sans)',
              },
              components: {
                Button: {
                  borderRadius: 8,
                },
                Card: {
                  borderRadius: 12,
                },
                Modal: {
                  borderRadius: 12,
                },
                Input: {
                  borderRadius: 8,
                },
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
