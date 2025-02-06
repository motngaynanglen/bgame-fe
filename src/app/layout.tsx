import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import PreloadAntdCSS from "../components/Loading/PreloadAntdCSS";
import StyledComponentsRegistry from "../components/AntdConfig/AntdRegistry";
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
  title: "BoGemStore",
  description: "The website for board game lovers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <head>
        <noscript>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/5.4.1/antd.min.css" />
        </noscript>
      </head> */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Preload Ant Design CSS */}
        {/* <PreloadAntdCSS /> */}

        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
