import { Phone, Brain, ShieldAlert, Puzzle, Activity, Zap } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/5 via-blue-600/5 to-transparent rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass-card text-xs font-medium text-cyan-400 uppercase tracking-wider mb-4">
            Fonctionnalités
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Tout ce dont vous avez besoin.
            <br />
            <span className="gradient-text">Rien de superflu.</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {/* Box 1 - Large: Omnicanalité */}
          <div className="bento-large glass-card-hover rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/20">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Omnicanalité</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Un flux unifié : de l'appel téléphonique à l'écran cuisine. Votre IA orchestre tout.
              </p>
            </div>
            
            {/* Visual flow */}
            <div className="flex items-center justify-between gap-4 mt-auto">
              <div className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5">
                <Phone className="w-8 h-8 text-cyan-400" />
                <span className="text-xs text-muted-foreground">Appel</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
                <Zap className="w-4 h-4 text-cyan-400 mx-1" />
                <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5">
                <div className="flex gap-0.5 h-6 items-end">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full animate-waveform"
                      style={{ 
                        height: `${40 + Math.sin(i * 0.8) * 40}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">IA</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5">
                <div className="w-8 h-6 rounded bg-gradient-to-br from-emerald-500/50 to-emerald-600/50 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">OK</span>
                </div>
                <span className="text-xs text-muted-foreground">Cuisine</span>
              </div>
            </div>
          </div>

          {/* Box 2 - Small: Knowledge Base */}
          <div className="bento-small glass-card-hover rounded-2xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border border-purple-500/20 mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Knowledge Base</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connaît votre Wifi, Parking & Menu par cœur. Réponses précises, chaque fois.
            </p>
          </div>

          {/* Box 3 - Small: Mode 86 */}
          <div className="bento-small glass-card-hover rounded-2xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center border border-orange-500/20 mb-4">
              <ShieldAlert className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Mode 86</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gestion des ruptures de stock en temps réel. L'IA s'adapte instantanément.
            </p>
          </div>

          {/* Box 4 - Medium: Intégration Totale */}
          <div className="bento-medium glass-card-hover rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center border border-blue-500/20">
                  <Puzzle className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Intégration Totale</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Connectez vos outils existants. Nous nous adaptons à votre stack.
              </p>
            </div>
            
            {/* Integration logos (grayscale placeholders) */}
            <div className="flex flex-wrap items-center gap-3">
              {['RestoOS', 'MediCal', 'GarageFlow', 'BookPro', 'CashDesk'].map((name) => (
                <div 
                  key={name}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-muted-foreground/60 grayscale hover:grayscale-0 hover:text-muted-foreground transition-all duration-300"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
