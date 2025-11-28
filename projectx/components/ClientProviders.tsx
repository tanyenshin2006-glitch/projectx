"use client"

import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { Toaster } from "sonner";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <ReactQueryProvider>
          <Toaster position="top-center" />
          {children}
        </ReactQueryProvider>
    </ThemeProvider>
  );
}