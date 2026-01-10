import { cn } from '@/lib/utils'

interface SentimentRingProps {
  score: number // 1-10
  size?: number
  className?: string
}

export function SentimentRing({ score, size = 60, className }: SentimentRingProps) {
  const normalizedScore = Math.max(1, Math.min(10, score))
  const percentage = (normalizedScore / 10) * 100
  const circumference = 2 * Math.PI * (size / 2 - 5)
  const offset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (normalizedScore <= 3) return '#ef4444' // red
    if (normalizedScore <= 6) return '#eab308' // yellow
    return '#22c55e' // green
  }

  const color = getColor()
  const sentimentClass = normalizedScore <= 3 ? 'sentiment-low' : normalizedScore <= 6 ? 'sentiment-medium' : 'sentiment-high'

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 5}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-secondary/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 5}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn('transition-all duration-500', sentimentClass)}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold" style={{ color }}>
          {normalizedScore}
        </span>
      </div>
    </div>
  )
}
