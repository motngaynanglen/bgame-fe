import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import AppProvider from "./app-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Board Game Impact",
  description: "The website for board game lovers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/antd@5.24.1/dist/antd.min.css"
          as="style"
        /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-svh`}
      >
        {/* {children} */}
        {/* <StyledComponentsRegistry>{children}</StyledComponentsRegistry> */}
        {/* <AntdRegistry> */}
        <ConfigProvider>
          <AppProvider>{children}</AppProvider>
        </ConfigProvider>
        {/* </AntdRegistry> */}
      </body>
    </html>
  );
}
