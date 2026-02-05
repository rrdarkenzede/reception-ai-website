import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Calendar, 
  Bot, 
  ChefHat, 
  Zap, 
  Clock, 
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Utensils,
  Stethoscope,
  Scale,
  MessageSquare,
  BarChart3,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Navbar Component
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "glass-card py-3" : "py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text-cyan">ReceptionAI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
          <a href="#use-cases" className="text-muted-foreground hover:text-foreground transition-colors">Cas d'usage</a>
          <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="btn-secondary">Se connecter</Link>
          <Link to="/contact" className="btn-primary flex items-center gap-2">
            Demander un audit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <a href="#features" className="text-foreground py-2">Fonctionnalités</a>
              <a href="#use-cases" className="text-foreground py-2">Cas d'usage</a>
              <Link to="/contact" className="text-foreground py-2">Contact</Link>
              <hr className="border-border" />
              <Link to="/login" className="btn-secondary text-center">Se connecter</Link>
              <Link to="/contact" className="btn-primary text-center">Demander un audit</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid-bg opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge badge-cyan mb-6">
              <Zap className="w-3 h-3 mr-1" /> Propulsé par NeuralVoice™
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Ne perdez plus jamais{' '}
              <span className="gradient-text">1€ de chiffre d'affaires.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              La première IA réceptionniste vocale qui répond à vos appels 24/7, 
              prend les réservations et gère vos commandes en temps réel.
            </p>

            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>Latence &lt; 800ms</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Onboarding 48h</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>Support Premium</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Réserver un Audit Gratuit <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Kitchen Ticket Mockup */}
            <div className="animate-float">
              <div className="glass-card rounded-2xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm text-emerald-400">Appel en cours</span>
                  </div>
                  <span className="text-xs text-muted-foreground">12:45</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="glass-card rounded-lg rounded-tl-none p-3 flex-1">
                      <p className="text-sm">Bienvenue au Fouquet's. Comment puis-je vous aider ?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg rounded-tr-none p-3 flex-1">
                      <p className="text-sm">Je voudrais réserver pour 4 personnes ce soir à 20h.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="glass-card rounded-lg rounded-tl-none p-3 flex-1">
                      <p className="text-sm">Parfait ! J'ai une table disponible à 20h. À quel nom dois-je réserver ?</p>
                    </div>
                  </div>
                </div>

                {/* Waveform visualization */}
                <div className="flex items-end justify-center gap-1 h-8">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-cyan-400 rounded-full animate-waveform"
                      style={{ 
                        animationDelay: `${i * 0.1}s`,
                        height: `${20 + Math.random() * 80}%`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Features Section (Bento Grid)
function FeaturesSection() {
  const features = [
    {
      icon: Phone,
      title: "Omnicanalité",
      description: "Appels téléphoniques, SMS, et bientôt WhatsApp. Vos clients vous joignent comme ils veulent.",
      size: "large",
      color: "cyan"
    },
    {
      icon: MessageSquare,
      title: "Knowledge Base",
      description: "L'IA répond à toutes les questions: parking, allergies, code vestimentaire...",
      size: "small",
      color: "blue"
    },
    {
      icon: ChefHat,
      title: "Mode 86",
      description: "Gérez les ruptures de stock en temps réel. L'IA adapte automatiquement ses réponses.",
      size: "small",
      color: "orange"
    },
    {
      icon: Calendar,
      title: "Agenda Intelligent",
      description: "Prise de réservations automatique avec gestion des créneaux et des tables.",
      size: "medium",
      color: "emerald"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Suivez vos performances: taux de conversion, durée des appels, sentiment client.",
      size: "medium",
      color: "purple"
    },
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Tout ce qu'il faut pour <span className="gradient-text">automatiser</span> votre accueil
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une suite complète d'outils propulsés par l'IA pour ne plus jamais manquer un client.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "glass-card glass-card-hover rounded-2xl p-6",
                feature.size === 'large' && "md:col-span-2 md:row-span-2",
                feature.size === 'medium' && "md:col-span-1"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                feature.color === 'cyan' && "bg-cyan-500/20",
                feature.color === 'blue' && "bg-blue-500/20",
                feature.color === 'orange' && "bg-orange-500/20",
                feature.color === 'emerald' && "bg-emerald-500/20",
                feature.color === 'purple' && "bg-purple-500/20",
              )}>
                <feature.icon className={cn(
                  "w-6 h-6",
                  feature.color === 'cyan' && "text-cyan-400",
                  feature.color === 'blue' && "text-blue-400",
                  feature.color === 'orange' && "text-orange-400",
                  feature.color === 'emerald' && "text-emerald-400",
                  feature.color === 'purple' && "text-purple-400",
                )} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              
              {feature.size === 'large' && (
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="text-center p-4 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-cyan-400">24/7</div>
                    <div className="text-xs text-muted-foreground">Disponible</div>
                  </div>
                  <div className="text-center p-4 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-cyan-400">&lt;1s</div>
                    <div className="text-xs text-muted-foreground">Temps de réponse</div>
                  </div>
                  <div className="text-center p-4 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-cyan-400">99%</div>
                    <div className="text-xs text-muted-foreground">Compréhension</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Use Cases Section
function UseCasesSection() {
  const [activeTab, setActiveTab] = useState(0);
  
  const useCases = [
    {
      icon: Utensils,
      title: "Restauration",
      subtitle: "Du Fouquet's au Kebab du coin",
      description: "Qu'il s'agisse d'un restaurant gastronomique ou d'une enseigne de restauration rapide, notre IA s'adapte à votre établissement.",
      features: [
        "Prise de réservations automatique",
        "Gestion des commandes à emporter",
        "Mode 86 pour les ruptures de stock",
        "Écran cuisine (KDS) temps réel"
      ]
    },
    {
      icon: Stethoscope,
      title: "Médical",
      subtitle: "Secrétariat débordé ?",
      description: "Libérez votre équipe des appels répétitifs. L'IA gère les prises de rendez-vous et répond aux questions fréquentes.",
      features: [
        "Prise de RDV qualifiée",
        "Gestion des urgences",
        "Rappels automatiques",
        "Intégration calendrier"
      ]
    },
    {
      icon: Scale,
      title: "Juridique",
      subtitle: "Qualifiez vos prospects",
      description: "Ne perdez plus de temps sur des appels non qualifiés. L'IA filtre et organise vos prises de contact.",
      features: [
        "Qualification des demandes",
        "Prise de RDV initiale",
        "Collecte d'informations préalables",
        "Transfert intelligent"
      ]
    }
  ];

  return (
    <section id="use-cases" className="py-20 px-6 bg-gradient-to-b from-transparent to-card/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Une solution pour <span className="gradient-text">chaque secteur</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ReceptionAI s'adapte à votre métier et à vos besoins spécifiques.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {useCases.map((useCase, index) => (
            <button
              key={useCase.title}
              onClick={() => setActiveTab(index)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full transition-all",
                activeTab === index 
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                  : "glass-card hover:bg-white/5"
              )}
            >
              <useCase.icon className="w-5 h-5" />
              {useCase.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-sm text-cyan-400 mb-2">{useCases[activeTab].subtitle}</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{useCases[activeTab].title}</h3>
                <p className="text-muted-foreground mb-6">{useCases[activeTab].description}</p>
                
                <ul className="space-y-3">
                  {useCases[activeTab].features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center animate-pulse-glow">
                  {(() => {
                    const Icon = useCases[activeTab].icon;
                    return <Icon className="w-24 h-24 text-cyan-400" />;
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "Comment fonctionne l'IA de réception ?",
      answer: "Notre IA utilise des modèles de langage avancés pour comprendre et répondre aux appels téléphoniques. Elle peut prendre des réservations, répondre aux questions fréquentes et transférer les appels complexes à votre équipe."
    },
    {
      question: "Combien de temps prend la mise en place ?",
      answer: "L'onboarding complet prend généralement 48 heures. Nous configurons l'IA selon vos besoins, importons votre menu/services, et vous formez votre équipe à l'utilisation du dashboard."
    },
    {
      question: "L'IA peut-elle gérer plusieurs langues ?",
      answer: "Oui, notre IA peut communiquer en français, anglais, espagnol, italien, et de nombreuses autres langues. Elle détecte automatiquement la langue du client."
    },
    {
      question: "Que se passe-t-il si l'IA ne peut pas répondre ?",
      answer: "En cas de question complexe ou de demande spéciale, l'IA peut transférer l'appel à un membre de votre équipe ou prendre un message pour un rappel ultérieur."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de bout en bout et nos serveurs sont hébergés en Europe, conformément au RGPD. Vos données ne sont jamais partagées avec des tiers."
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Questions <span className="gradient-text">fréquentes</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4"
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  openIndex === index && "rotate-180"
                )} />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
          
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à transformer votre accueil téléphonique ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Obtenez une démonstration personnalisée et un audit gratuit de vos besoins.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              Demander un devis personnalisé <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">ReceptionAI</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Confidentialité</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">CGU</Link>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2024 ReceptionAI. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
