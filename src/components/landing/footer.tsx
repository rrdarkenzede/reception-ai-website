import { Link } from "react-router-dom"
import { Target } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f2ff]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center text-center">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00f2ff] to-blue-600 flex items-center justify-center shadow-lg shadow-[#00f2ff]/20">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">ReceptionAI</span>
          </Link>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
            La première IA de réception qui s'intègre à votre écosystème. 
            Réservations, Commandes, Support. 24/7.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a 
              href="https://cal.com/reception-ai/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00f2ff] to-blue-600 text-white font-semibold shadow-lg shadow-[#00f2ff]/20 hover:shadow-[#00f2ff]/40 transition-all"
            >
              Réserver une Démo
            </a>
            <Link 
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground font-medium hover:bg-white/10 transition-all"
            >
              Espace Client
            </Link>
          </div>

          {/* Legal links only */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
            <Link to="/legal/terms" className="hover:text-foreground transition-colors">
              Mentions Légales
            </Link>
            <Link to="/legal/privacy" className="hover:text-foreground transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 ReceptionAI - Agence Certifiée. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
