import { Briefcase, Building2, UserSearch, Star } from "lucide-react"

interface StatItem {
  icon: React.ComponentType<{ className?: string }>
  value: string
  label: string
}

const stats: StatItem[] = [
  {
    icon: Briefcase,
    value: "50K",
    label: "Active Jobs",
  },
  {
    icon: Building2,
    value: "12K",
    label: "Companies",
  },
  {
    icon: UserSearch,
    value: "2M",
    label: "Job Seekers",
  },
  {
    icon: Star,
    value: "97%",
    label: "Satisfaction Rate",
  },
]

const AfterHeroSection = () => {
  return (
    <section className="relative isolate z-10 -mt-6  text-white pt-2 pb-20 sm:-mt-10 sm:pt-4 sm:pb-28 lg:-mt-16 lg:pb-36">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-72 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(99,102,241,0.18)_0%,rgba(5,5,7,0)_75%)]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="group relative flex min-h-[160px] flex-col justify-between rounded-2xl border border-white/10 bg-[#0c0c0e]/90 p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-[#121216] sm:min-h-[175px] sm:p-7"
              >
                <div>
                  <Icon className="size-5 text-white/55 transition-colors duration-200 group-hover:text-white/80" />
                </div>
                <div className="mt-8">
                  <div className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {stat.value}
                  </div>
                  <p className="mt-1.5 text-xs text-white/50 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AfterHeroSection
