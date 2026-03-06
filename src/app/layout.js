import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ClientToaster from "@/components/ui/ClientToaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(
    "https://hire-flow-dashboard-web-git-699fc5-francescos-projects-3c47c947.vercel.app/",
  ),
  title: {
    default: "HireFlow - Il Recruiting Trasparente",
    template: "%s | HireFlow",
  },
  description:
    "Trova i candidati perfetti in 72 ore. HireFlow abbina aziende e candidati come Tinder: veloce, trasparente, senza CV infiniti.",
  keywords: [
    "recruiting",
    "lavoro",
    "offerte lavoro",
    "candidati",
    "hr",
    "hiring",
    "match candidati",
    "piattaforma recruiting",
    "trovare lavoro",
    "recruiter",
    "Tinder per lavoro",
    "assunzioni rapide",
    "recruiting trasparente",
  ],
  authors: "Francesco Davide di Vita",
  creator: "Francesco Davide di Vita",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
    other: [{ rel: "icon", url: "/favicon/favicon-96x96.png", sizes: "96x96" }],
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://hire-flow-dashboard-web-git-699fc5-francescos-projects-3c47c947.vercel.app/",
    siteName: "HireFlow",
    title: "HireFlow - Il Recruiting Trasparente",
    description:
      "Trova i candidati perfetti in 72 ore. Abbina aziende e candidati come Tinder.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HireFlow - Il Recruiting Trasparente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HireFlow - Il Recruiting Trasparente",
    description: "Trova i candidati perfetti in 72 ore.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

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
