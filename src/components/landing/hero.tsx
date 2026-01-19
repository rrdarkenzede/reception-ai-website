import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"

// CSS-only Kitchen Ticket Mockup Component
function KitchenTicketMockup() {
  return (
    <div className="relative w-full max-w-md mx-auto animate-float">
      {/* Ambient glow behind */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-3xl scale-150" />
      
      {/* Main ticket card */}
      <div className="relative glass-card rounded-2xl p-6 ticket-shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">En direct</span>
          </div>
          <span className="text-xs text-muted-foreground">13:42</span>
        </div>

        {/* AI Waveform visualization */}
        <div className="flex items-center gap-1 h-8 mb-4">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full animate-waveform"
              style={{ 
                animationDelay: `${i * 0.05}s`,
                height: `${20 + Math.sin(i * 0.5) * 30}%`
              }}
            />
          ))}
        </div>

        {/* Order content */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nouvelle Commande</p>
              <p className="text-lg font-semibold text-foreground">2× Kebab Maison</p>
              <p className="text-sm text-muted-foreground">+ Frites, Sauce Blanche</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <span className="text-xs font-medium text-emerald-400">Confirmé par IA</span>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-dashed border-white/10" />
          
          {/* Footer details */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Retrait prévu</span>
            <span className="font-medium text-foreground">13:55</span>
          </div>
        </div>
      </div>

      {/* Floating notification badge */}
      <div className="absolute -top-3 -right-3 glass-card rounded-xl px-3 py-2 animate-pulse-glow">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">+3</span>
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-foreground">Appels traités</p>
            <p className="text-[10px] text-muted-foreground">cette heure</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-blob" />
        {/* Secondary accent blob */}
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/10 via-cyan-500/5 to-transparent rounded-full blur-3xl animate-blob" style={{ animationDelay: '-4s' }} />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Text content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm mb-8 animate-slide-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-muted-foreground">Propulsé par</span>
              <span className="font-semibold text-foreground">Retell AI</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-foreground">Ne perdez plus </span>
              <span className="gradient-text">jamais 1€</span>
              <br />
              <span className="text-foreground">de chiffre d'affaires.</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              La première IA de réception qui s'intègre à votre écosystème. 
              <span className="text-foreground font-medium"> Réservations, Commandes, Support.</span> 24/7.
            </p>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Latence &lt; 800ms
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Onboarding 48h
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Support Agence
              </span>
            </div>

            {/* CTA Button */}
            <div className="mt-10 flex items-center justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-6 text-base shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-105"
                >
                  Réserver un Audit Gratuit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right column - Visual */}
          <div className="hidden lg:block animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <KitchenTicketMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
