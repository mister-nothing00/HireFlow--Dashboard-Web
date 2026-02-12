import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HireFlow - Dashboard Recruiter",
  description: "La piattaforma di recruiting moderna",
};

// RootLayout con AppProvider per contesto globale e Toaster per notifiche
export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className={inter.className}>
        {/* Context globale per auth, settings, chat, etc. */}
        <AppProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: "12px", fontFamily: "Inter, sans-serif" },
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}
