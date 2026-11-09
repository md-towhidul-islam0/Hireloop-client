import AfterHeroSection from "@/components/AfterHeroSection"
import HeroSection from "@/components/HeroSection"
import Navbar from "@/components/Navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050507]">
      <Navbar />
      <HeroSection />
      <AfterHeroSection />
    </main>
  )
}

