import { ReactNode } from "react"
import type { Metadata } from "next"

import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Unstability.AI",
  description: "Development Demo",
}
import "./globals.css"
import "./layout.css"

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body suppressHydrationWarning>
      <Header />
      <div className="container">{children}</div>
    </body>
  </html>
)

export default RootLayout
