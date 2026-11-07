'use client'
import Image from "next/image"
import { MapPinIcon, SearchIcon } from "lucide-react"

import globe from "@/components/ui/images/globe.png"

const trendingRoles = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

const HeroSection = () => {
    const HandelSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const query = formData.get("q");
        const location = formData.get("location");

        console.log(query, location);
    };
    return (
        <section className="relative isolate overflow-hidden bg-[#050507] text-white">
            {/* Soft ambient light behind the headline */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(65%_100%_at_50%_0%,rgba(48,48,56,0.55)_0%,rgba(5,5,7,0)_72%)]"
            />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-14 text-center sm:pt-20 lg:pt-44">
                {/* Badge */}
                <div className="flex w-full max-w-lg min-w-0 flex-wrap items-center justify-center gap-3">
                    <span
                        aria-hidden="true"
                        className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"
                    />
                    <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2">
                        <span aria-hidden="true" className="text-sm leading-none">
                            💼
                        </span>
                        <span className="text-sm font-semibold tracking-tight">
                            50,000+
                        </span>
                        <span className="font-mono text-[11px] tracking-[0.16em] text-white/45 uppercase">
                            New Jobs This Month
                        </span>
                    </div>
                    <span
                        aria-hidden="true"
                        className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20"
                    />
                </div>

                {/* Headline */}
                <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:mt-10 sm:text-5xl lg:text-[56px]">
                    Find Your Dream Job Today
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-[17px]">
                    HireLoop connects top talent with world-class companies. Browse
                    thousands of curated opportunities and land your next role — faster.
                </p>

                {/* Search */}
                <form
                    onSubmit={HandelSearch}
                    action="/jobs"
                    method="get"
                    className="mt-10 flex w-full max-w-3xl items-center gap-2 rounded-2xl border border-white/10 bg-[#0d0d10]/90 p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] sm:mt-12"
                >
                    <label className="flex min-w-0 flex-1 items-center gap-2.5 px-3">
                        <SearchIcon className="size-4 shrink-0 text-white/40" />
                        <span className="sr-only">Job title, skill or company</span>
                        <input
                            type="text"
                            name="q"
                            placeholder="Job title, skill or company"
                            className="h-11 w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                        />
                    </label>

                    <span aria-hidden="true" className="h-6 w-px bg-white/10" />

                    <label className="flex min-w-0 flex-1 items-center gap-2.5 px-3">
                        <MapPinIcon className="size-4 shrink-0 text-white/40" />
                        <span className="sr-only">Location or Remote</span>
                        <input
                            type="text"
                            name="location"
                            placeholder="Location or Remote"
                            className="h-11 w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                        />
                    </label>

                    <button
                        type="submit"
                        aria-label="Search jobs"
                        className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-400/60 focus-visible:outline-none"
                    >
                        <SearchIcon className="size-5" />
                    </button>
                </form>

                {/* Trending */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2">
                    <span className="mr-1 text-sm text-white/40">Trending Position</span>
                    {trendingRoles.map((role) => (
                        <span
                            key={role}
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] font-medium text-white/70"
                        >
                            {role}
                        </span>
                    ))}
                </div>
            </div>

            {/* Globe */}
            <div className="relative z-0 mt-10 sm:mt-12">
                <div className="relative mx-auto aspect-[9/5] w-full max-w-[1440px] overflow-hidden sm:aspect-[16/7] lg:aspect-[12/5]">
                    <Image
                        src={globe}
                        alt=""
                        width={1440}
                        height={1882}
                        priority
                        sizes="(max-width: 1440px) 100vw, 1440px"
                        className="-mt-[45%] h-auto w-full max-w-none select-none"
                    />

                    <div className="absolute inset-x-0 bottom-[15%] px-4">
                        <p className="text-center text-2xl leading-snug font-medium text-white/85 sm:text-3xl lg:text-4xl">
                            Assisting over{" "}
                            <span className="font-semibold text-white">15,000</span> job
                            seekers
                            <br />
                            find their dream positions.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
