import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ClientToaster from "@/components/ui/ClientToaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HireFlow - Dashboard Recruiter",
  description: "La piattaforma di recruiting moderna",
};

//  Layout principale dell'app
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
