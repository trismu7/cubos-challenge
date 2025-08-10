import Link from "next/link";
import SessionCheckComponent from "./session/SessionCheck";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default async function Header() {
  return (
    <header className="bg-card backdrop-blur-sm border-b border-border p-4 w-full">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          {/* desktop logo */}
          <Image
            src="/assets/cubos_logo_white.png"
            alt="logo"
            width={160}
            height={36}
            priority
            quality={100}
            className="hidden md:block light:invert"
          />
          {/* mobile logo */}
          <Image
            src="/assets/cubos_logo_sm.png"
            alt="logo"
            width={36}
            height={14}
            priority
            quality={100}
            className="block md:hidden light:invert" // Show on mobile, hide on desktop
          />
          <p className={`text-xl ${inter.variable} font-semibold`}>Movies</p>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SessionCheckComponent />
        </div>
      </div>
    </header>
  );
}
