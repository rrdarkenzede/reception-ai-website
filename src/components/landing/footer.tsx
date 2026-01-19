import { Link } from "react-router-dom"
import { Target, Headphones } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Cas d'usage", href: "#use-cases" },
    { label: "Offres", href: "#offers" },
    { label: "FAQ", href: "#faq" },
  ],
  company: [
    { label: "À propos", to: "/about" },
    { label: "Blog", to: "/blog" },
  ],
  support: [
    { label: "Centre de Support", to: "/contact" },
    { label: "Espace Client", to: "/login" },
  ],
  legal: [
    { label: "Mentions Légales", to: "/legal/terms" },
    { label: "CGV", to: "/legal/terms" },
    { label: "Confidentialité", to: "/legal/privacy" },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Description */}
          <div className="col-span-2 md:col-span-5 lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">ReceptionAI</span>
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              La première IA de réception qui s'intègre à votre écosystème. 
              Réservations, Commandes, Support. 24/7.
            </p>

            {/* Support CTA */}
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 text-cyan-400 hover:border-cyan-500/40 transition-all text-sm font-medium"
            >
              <Headphones className="w-4 h-4" />
              Centre de Support
            </Link>
          </div>

          {/* Product links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-semibold text-foreground mb-4">Produit</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-semibold text-foreground mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-semibold text-foreground mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 ReceptionAI - Agence Certifiée. Tous droits réservés.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ in Paris
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
