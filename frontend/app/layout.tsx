import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "AI CSV Importer",
  description: "GrowEasy Assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
         <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              padding: "12px 16px",
            },
          }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}