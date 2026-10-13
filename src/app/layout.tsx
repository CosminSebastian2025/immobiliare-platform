import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Header} from '@components/layout/header'
import {Footer} from '@components/layout/footer'

const inter = Inter({ subset: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ImmobiliarePlatform - Trova la tua casa',
    template: '%s - ImmobiliarePlatform',
  },
  description: "Portale immobiliare per vendita e affitto di case, appartamenti e camere in Italia.",
  keywords: ['immobiliare', 'case', 'appartamenti', 'affitto', 'vendita', 'camere'],
};

export default function RootLayout({ children }: { children: React.ReactNode}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <div className={"flex minh-h-screen flex-col"} >
          <Header />
          <main className="flex-1" >{children}</main>
          <Footer/>
        </div>
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
