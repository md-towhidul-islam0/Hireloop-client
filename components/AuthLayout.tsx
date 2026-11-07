import Image from "next/image"
import Link from "next/link"
import { CheckIcon } from "lucide-react"

import logo from "@/components/ui/images/logo.png"
import globe from "@/components/ui/images/globe.png"
import adobeLogo from "@/components/ui/logos/adobe.png"
import amazonLogo from "@/components/ui/logos/amazon.png"
import appleLogo from "@/components/ui/logos/apple.png"
import googleLogo from "@/components/ui/logos/google.png"
import metaLogo from "@/components/ui/logos/meta.png"
import spotifyLogo from "@/components/ui/logos/spotify.png"

const perks = [
  "10,000+ new jobs added every month",
  "Verified openings from world-class companies",
  "Apply in one click with your HireLoop profile",
]

const partners = [
  { src: googleLogo, name: "Google" },
  { src: metaLogo, name: "Meta" },
  { src: amazonLogo, name: "Amazon" },
  { src: appleLogo, name: "Apple" },
  { src: adobeLogo, name: "Adobe" },
  { src: spotifyLogo, name: "Spotify" },
]

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[#050507] text-white">
      {/* Soft ambient light behind the brand panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(55%_100%_at_25%_0%,rgba(48,48,56,0.55)_0%,rgba(5,5,7,0)_72%)]"
      />

      <div className="relative z-10 mx-auto grid min-h-svh w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        {/* Brand panel */}
        <aside className="relative hidden overflow-hidden border-r border-white/5 px-10 py-9 lg:flex lg:flex-col lg:gap-12">
          <Link
            href="/"
            aria-label="HireLoop home"
            className="relative z-10 flex shrink-0 items-center"
          >
            <Image
              src={logo}
              alt="HireLoop"
              priority
              className="h-auto w-36 xl:w-40"
            />
          </Link>

          <div className="relative z-10 max-w-xl">
            <p className="font-mono text-xs tracking-[0.24em] text-indigo-400 uppercase">
              Your career, in motion
            </p>

            <h2 className="mt-5 text-4xl leading-[1.12] font-semibold tracking-tight xl:text-5xl">
              Find Your Dream Job Today
            </h2>

            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              HireLoop connects top talent with world-class companies. Browse
              thousands of curated opportunities and land your next role —
              faster.
            </p>

            <ul className="mt-9 space-y-3.5">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-3 text-sm text-white/70"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-indigo-500/15 text-indigo-400">
                    <CheckIcon className="size-3" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <p className="font-mono text-[10px] tracking-[0.22em] text-white/35 uppercase">
                Candidates hired at
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-4">
                {partners.map((partner) => (
                  <Image
                    key={partner.name}
                    src={partner.src}
                    alt={partner.name}
                    className="h-5 w-auto opacity-55"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Globe */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] overflow-hidden"
          >
            <Image
              src={globe}
              alt=""
              width={1440}
              height={1882}
              className="-mt-[45%] h-auto w-full max-w-none select-none"
            />
          </div>
        </aside>

        {/* Form panel */}
        <section className="relative flex min-h-svh flex-col px-5 py-6 sm:px-10 lg:min-h-0 lg:py-9">
          {/* Indigo halo behind the card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-[-140px] h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.14)_0%,rgba(79,70,229,0)_65%)]"
          />

          <header className="relative z-10 flex shrink-0 items-center justify-between gap-4">
            <Link
              href="/"
              aria-label="HireLoop home"
              className="flex items-center lg:hidden"
            >
              <Image src={logo} alt="HireLoop" className="h-auto w-28" />
            </Link>
            <Link
              href="/"
              className="ml-auto text-sm text-white/45 transition-colors hover:text-white"
            >
              ← Back to home
            </Link>
          </header>

          <div className="relative z-10 flex flex-1 items-center justify-center py-10">
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AuthLayout
