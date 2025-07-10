import { Rajdhani, Source_Code_Pro } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const sourceCodePro = Source_Code_Pro({ 
  subsets: ["latin"],
  variable: '--font-source-code-pro',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-rajdhani',
})

export const metadata = {
  title: "Javier's Portfolio",
  description: "A modern portfolio with a technical feel.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sourceCodePro.variable} ${rajdhani.variable} font-mono animated-background`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
