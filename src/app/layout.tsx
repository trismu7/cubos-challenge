import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import Image from "next/image";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cubos Movies",
  description:
    "Cubos Movies - Salve seus filmes favoritos e crie seu próprio catálogo personalizado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${roboto.variable} antialiased min-h-screen relative`}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="hero-container">
            <Image
              src="/assets/bg.png"
              alt="Background"
              className="hero-image light:opacity-60 light:bg-white dark:bg-black"
              width={1920}
              height={1080}
              priority
              quality={100}
            />
            <div className="hero-overlay"></div>
          </div>

          <div className="relative z-20 flex flex-col justify-between">
            <Header />
            <main className="flex-1">{children}</main>

            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
