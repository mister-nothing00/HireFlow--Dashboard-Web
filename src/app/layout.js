import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ClientToaster from "@/components/ClientToaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HireFlow - Dashboard Recruiter",
  description: "La piattaforma di recruiting moderna",
};

// Layout principale dell'applicazione che avvolge tutte le pagine e fornisce il contesto globale e il toaster per le notifiche
export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <AppProvider>
          {children}
          <ClientToaster />
        </AppProvider>
      </body>
    </html>
  );
}
