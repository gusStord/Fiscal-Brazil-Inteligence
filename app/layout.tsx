import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import { LiveDataProvider } from "@/components/dashboard/LiveDataProvider";
import ReadingProgressBar from "@/components/dashboard/ReadingProgressBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brazil Fiscal Intelligence — Dashboard de Análise Fiscal",
  description: "Dashboard interativo de análise fiscal do Governo Geral brasileiro (2018-2025). Dados de CIG, Demonstrativos, STN e BCB para investidores e acadêmicos. Inclui simulador fiscal, calculadora de impostos e comparação internacional.",
  keywords: ["Brasil", "fiscal", "investimento", "CIG", "demonstrativos", "governo", "análise", "dashboard", "IBGE", "STN", "BCB", "DBGG", "FBCF", "simulador fiscal"],
  authors: [{ name: "Brazil Fiscal Intelligence" }],
  openGraph: {
    title: "Brazil Fiscal Intelligence — Dashboard de Análise Fiscal",
    description: "Dashboard interativo de análise fiscal do Governo Geral brasileiro (2018-2025). KPIs, gráficos, simulador fiscal, calculadora de impostos e comparação internacional.",
    type: "website",
    locale: "pt_BR",
    siteName: "Brazil Fiscal Intelligence",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brazil Fiscal Intelligence — Dashboard Fiscal",
    description: "Análise fiscal do Brasil 2018-2025. Dados oficiais IBGE/STN/BCB.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ReadingProgressBar />
        <div className="min-h-screen flex flex-col">
          <DashboardHeader />
          <ErrorBoundary>
            <LiveDataProvider>
              <div className="flex-1">
                {children}
              </div>
              <DashboardFooter />
            </LiveDataProvider>
          </ErrorBoundary>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
