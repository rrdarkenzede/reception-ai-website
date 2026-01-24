import { motion } from 'framer-motion';
import { Phone, PhoneIncoming } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveFeedProps {
  hasIncomingCall?: boolean;
  callData?: {
    callerName?: string;
    callerNumber?: string;
  };
}

export function LiveFeed({ hasIncomingCall = false, callData }: LiveFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative h-full min-h-[280px] rounded-2xl overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-800/50 backdrop-blur-xl" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
        {/* Header */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-orange-500 rounded-full" />
          <span className="text-sm font-semibold text-foreground">Live Feed</span>
        </div>

        {/* Phone Icon */}
        <motion.div
          animate={hasIncomingCall ? {
            scale: [1, 1.1, 1],
            rotate: [0, -10, 10, -10, 0],
          } : {}}
          transition={{
            duration: 0.5,
            repeat: hasIncomingCall ? Infinity : 0,
            repeatDelay: 0.5
          }}
          className={cn(
            "relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6",
            hasIncomingCall 
              ? "bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30" 
              : "bg-gradient-to-br from-gray-700/30 to-gray-800/20 border border-white/10"
          )}
        >
          {hasIncomingCall ? (
            <PhoneIncoming className="w-10 h-10 text-green-400" />
          ) : (
            <Phone className="w-10 h-10 text-gray-400" />
          )}
          
          {/* Pulse rings for incoming call */}
          {hasIncomingCall && (
            <>
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl border border-green-500/50"
              />
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                className="absolute inset-0 rounded-2xl border border-green-500/30"
              />
            </>
          )}
        </motion.div>

        {/* Status Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "text-base font-medium",
            hasIncomingCall ? "text-green-400" : "text-muted-foreground"
          )}
        >
          {hasIncomingCall 
            ? `Appel entrant${callData?.callerName ? ` - ${callData.callerName}` : ''}...` 
            : 'En attente d\'appels...'}
        </motion.p>

        {hasIncomingCall && callData?.callerNumber && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground mt-2"
          >
            {callData.callerNumber}
          </motion.p>
        )}

        {/* Animated dots for waiting state */}
        {!hasIncomingCall && (
          <div className="flex items-center gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 rounded-full bg-gray-500"
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default LiveFeed;
