import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { auth } from '@/lib/store';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = auth.signIn(email, password);
    
    if (user) {
      toast.success(`Bienvenue, ${user.name}!`);
      
      // Redirect based on role
      if (user.is_super_admin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Email ou mot de passe incorrect');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid-bg opacity-20" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Connexion</h1>
            <p className="text-muted-foreground">Accédez à votre tableau de bord</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Comptes de démonstration :
            </p>
            <div className="space-y-2 text-xs">
              <div className="glass-card rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400">Admin</span>
                  <span className="badge badge-orange text-xs">Super Admin</span>
                </div>
                <div className="text-muted-foreground mt-1">rayanebendaho0@gmail.com</div>
              </div>
              <div className="glass-card rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400">Client</span>
                  <span className="badge badge-cyan text-xs">Enterprise</span>
                </div>
                <div className="text-muted-foreground mt-1">contact@fouquets-paris.fr</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Mot de passe : rayane2008.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Pas encore de compte ?{' '}
          <Link to="/contact" className="text-cyan-400 hover:underline">
            Demander un accès
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
