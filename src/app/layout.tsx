import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Minha Lista",
  description: "Lista de mercado simples e rápida",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EA1D2C",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
