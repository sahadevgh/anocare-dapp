import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Nunito } from "next/font/google";
import { headers } from "next/headers";
import Providers from "./Providers";

// ✅ Set correct subset for Latin characters
const manrope = Nunito({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = (await headers()).get("cookie");

  return (
    <html lang="en">
      <body className={manrope.className}>
        <Providers cookie={cookie}>{children}</Providers>
      </body>
    </html>
  );
}
