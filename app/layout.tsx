import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./Global.css"
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Liban's World🌍🇰🇪",
  description: "Welcome to Joseph Liban M.'s portfolio - Full Stack Developer showcasing beautiful and functional web applications",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Script
          strategy="afterInteractive"
          data-goatcounter="https://liban-portfolio.goatcounter.com/count"
          src="//gc.zgo.at/count.js"
        />
      </body>
    </html>
  )
}
