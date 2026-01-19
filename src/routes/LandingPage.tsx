import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { UseCases } from "@/components/landing/use-cases"
import { Offers } from "@/components/landing/offers"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <UseCases />
      <Offers />
      <FAQ />
      <Footer />
    </main>
  )
}
